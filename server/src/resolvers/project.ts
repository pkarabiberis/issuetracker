import { Project } from '../entities/Project';
import { isAuthenticated } from '../middleware/isAuthenticated';
import { Context } from '../types';
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
import { User } from '../entities/User';
import { Issue } from '../entities/Issue';
import { getConnection, getRepository } from 'typeorm';

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

  @Query(() => ProjectResponse, { nullable: true })
  async projects(): Promise<ProjectResponse> {
    const projects = await Project.find({ relations: ['users'] });
    return {
      projects,
    };
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
    return Issue.create({
      ...input,
      status: 'Ongoing',
      assignedUsers: usersToAssign,
      creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Issue)
  @UseMiddleware(isAuthenticated)
  async updateissue(
    @Arg('id', () => Int) id: number,
    @Arg('title', () => String) title: string,
    @Arg('status', () => String) status: string,
    @Arg('due', () => String, { nullable: true }) due: string,
    @Arg('assignedUsers', () => [Int]) assignedUsers: number[]
  ): Promise<Issue> {
    const usersToAssign = await User.findByIds(assignedUsers);
    const issue = await Issue.findOne(id);
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
    return {
      issue,
    };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async deleteIssue(@Arg('id', () => Int) id: number) {
    await Issue.delete(id);
    return true;
  }
}
