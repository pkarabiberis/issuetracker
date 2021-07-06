import { Project } from '../entities/Project';
import { isAuthenticated } from '../middleware/isAuthenticated';
import { Context } from '../types';
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { User } from '../entities/User';

@Resolver(Project)
export class ProjectResolver {
  @Mutation(() => Project)
  @UseMiddleware(isAuthenticated)
  async create(
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
}
