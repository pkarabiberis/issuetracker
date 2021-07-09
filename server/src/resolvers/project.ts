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
  project: Project;

  @Field(() => [Issue])
  issues?: Issue[];
}

@Resolver(Project)
export class ProjectResolver {
  @Mutation(() => Project)
  @UseMiddleware(isAuthenticated)
  async createProject(
    @Arg('name') name: string,
    @Ctx() { req }: Context
  ): Promise<Project | null> {
    const user = await User.findOne(req.session.userId);
    const userArr: Array<User> = [];
    if (!user) {
      return null;
    }

    userArr.push(user);
    return Project.create({
      creatorId: req.session.userId,
      name,
      users: userArr,
    }).save();
  }

  @Query(() => ProjectResponse, { nullable: true })
  @UseMiddleware(isAuthenticated)
  async project(
    @Arg('id', () => Int) id: number
  ): Promise<ProjectResponse | null> {
    const projectIssues = await Issue.find({
      where: {
        projectId: id,
      },
      relations: ['assignedUsers'],
      order: {
        createdAt: 'DESC',
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
    @Arg('assignedUsers', () => [Int]) assignedUsers: number[]
  ): Promise<Issue> {
    const usersToAssign = await User.findByIds(assignedUsers);
    const issue = await Issue.findOne(id);
    return getRepository(Issue).save({
      ...issue,
      title,
      status,
      assignedUsers: usersToAssign,
    });
  }
}
