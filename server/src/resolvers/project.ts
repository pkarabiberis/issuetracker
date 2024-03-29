import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { getRepository } from 'typeorm';
import { Issue } from '../entities/Issue';
import { Project } from '../entities/Project';
import { User } from '../entities/User';
import { isAuthenticated } from '../middleware/isAuthenticated';
import { Context } from '../types';
import { toISO } from '../utils/toISO';

const updateIssueUsers = async (newIssueUsers: Record<number, User[]>) => {
  const updatedIssues: Issue[] = [];
  for (const val in newIssueUsers) {
    const id = parseInt(val);
    const issue = await Issue.findOne(id);
    if (!issue) {
      return;
    }

    issue.assignedUsers = newIssueUsers[id];
    updatedIssues.push(issue);
  }

  return updatedIssues;
};

@InputType()
class IssueInput {
  @Field()
  title!: string;

  @Field(() => String, { nullable: true })
  due?: string;

  @Field()
  projectId!: number;
}

@ObjectType()
class ProjectResponse {
  @Field(() => Project)
  project?: Project;

  @Field(() => [Project])
  projects?: Project[];

  @Field(() => [Issue])
  issues?: Issue[];
}

@ObjectType()
class IssueResponse {
  @Field(() => Issue, { nullable: true })
  issue?: Issue;
}

@Resolver(Project)
export class ProjectResolver {
  @Mutation(() => Project)
  @UseMiddleware(isAuthenticated)
  async createProject(
    @Arg('name') name: string,
    @Arg('users', () => [Int], { nullable: true }) users: number[],
    @Ctx() { req }: Context
  ): Promise<Project | null> {
    const usersToAdd = await User.findByIds(users);

    return Project.create({
      creatorId: req.session.userId,
      name,
      users: usersToAdd.length > 0 ? usersToAdd : undefined,
    }).save();
  }

  @Mutation(() => ProjectResponse, { nullable: true })
  @UseMiddleware(isAuthenticated)
  async editProject(
    @Arg('id', () => Int) id: number,
    @Arg('name') name: string,
    @Arg('users', () => [Int], { nullable: true }) users: number[]
  ): Promise<ProjectResponse | null> {
    const updatedUsers = await User.findByIds(users);
    const project = await Project.findOne(id, {
      relations: ['users'],
    });

    if (!project) {
      return null;
    }

    const projectIssues = await Issue.find({
      where: {
        projectId: id,
      },
      relations: ['assignedUsers'],
    });

    const newIssueUsers: Record<number, User[]> = {};
    projectIssues.forEach((issue) => {
      newIssueUsers[issue.id] = issue.assignedUsers.filter(({ id }) =>
        users.includes(id)
      );
    });

    const updatedIssues = await updateIssueUsers(newIssueUsers);

    await getRepository(Issue).save(updatedIssues || []);

    const updatedProject = await getRepository(Project).save({
      ...project,
      name,
      users: updatedUsers,
      issues: updatedIssues,
    });

    return {
      project: updatedProject,
      issues: updatedIssues,
    };
  }

  @Query(() => ProjectResponse, { nullable: true })
  async projects(): Promise<ProjectResponse> {
    const projects = await Project.find({
      relations: ['users'],
      order: { updatedAt: 'DESC' },
    });
    return {
      projects,
    };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async deleteProject(@Arg('id', () => Int) id: number) {
    await Project.delete(id);
    return true;
  }

  @Query(() => ProjectResponse, { nullable: true })
  async project(
    @Arg('id', () => Int) id: number,
    @Arg('sortBy', () => String, { nullable: true }) sortBy: string,
    @Arg('sortDir', () => String, { nullable: true }) sortDir: string
  ): Promise<ProjectResponse | null> {
    const sortDirection = sortDir === 'ASC' ? 'ASC' : 'DESC';
    const projectIssues = await Issue.find({
      where: {
        projectId: id,
      },
      relations: ['assignedUsers'],
      order:
        sortBy === 'status'
          ? {
              status: sortDirection,
            }
          : sortBy === 'due'
          ? {
              due: sortDirection,
            }
          : {
              createdAt: sortDirection,
            },
    });

    const project = await Project.findOne(id, { relations: ['users'] });
    if (!project) {
      return null;
    }
    return {
      project,
      issues: projectIssues,
    };
  }

  @Mutation(() => Issue)
  @UseMiddleware(isAuthenticated)
  async createIssue(
    @Arg('input', () => IssueInput) input: IssueInput,
    @Arg('assignedUsers', () => [Int]) assignedUsers: number[],
    @Ctx() { req }: Context
  ): Promise<Issue> {
    const usersToAssign = await User.findByIds(assignedUsers);
    await Project.update(input.projectId, {
      updatedAt: toISO(new Date()),
    });
    return Issue.create({
      ...input,
      status: 'Ongoing',
      assignedUsers: usersToAssign,
      creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Issue, { nullable: true })
  @UseMiddleware(isAuthenticated)
  async updateissue(
    @Arg('id', () => Int) id: number,
    @Arg('title', () => String) title: string,
    @Arg('status', () => String) status: string,
    @Arg('due', () => String, { nullable: true }) due: string,
    @Arg('assignedUsers', () => [Int]) assignedUsers: number[]
  ): Promise<Issue | null> {
    const usersToAssign = await User.findByIds(assignedUsers);
    const issue = await Issue.findOne(id);
    if (!issue) {
      return null;
    }
    await Project.update(issue?.projectId, {
      updatedAt: toISO(new Date()),
    });
    return getRepository(Issue).save({
      ...issue,
      title,
      status,
      due,
      assignedUsers: usersToAssign,
    });
  }

  @Query(() => IssueResponse)
  async issue(@Arg('id', () => Int) id: number): Promise<IssueResponse> {
    const issue = await Issue.findOne(id, { relations: ['assignedUsers'] });
    return { issue };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async deleteIssue(@Arg('id', () => Int) id: number) {
    await Issue.delete(id);
    return true;
  }
}
