import argon2 from 'argon2';
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
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { COOKIE_NAME } from '../constants';
import { Project } from '../entities/Project';
import { User } from '../entities/User';
import { Context } from '../types';

@InputType()
class UserRegisterInput {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;
}

@InputType()
class UserLoginInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class InputError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [InputError], { nullable: true })
  errors?: InputError[];
}

@Resolver(User)
export class UserResolver {
  @Mutation(() => UserResponse, { nullable: true })
  async register(
    @Arg('creds', () => UserRegisterInput) creds: UserRegisterInput,
    @Ctx() { req }: Context
  ): Promise<UserResponse> {
    if (!creds.email.includes('@')) {
      return {
        errors: [
          {
            field: 'email',
            message: 'not valid email',
          },
        ],
      };
    }

    if (creds.password.length < 4) {
      return {
        errors: [
          {
            field: 'password',
            message: 'required length > 3',
          },
        ],
      };
    }
    const userExists = await User.findOne({
      where: {
        username: creds.username,
      },
    });

    if (userExists) {
      return {
        errors: [
          {
            field: 'username',
            message: 'user already exists',
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(creds.password);
    let user;

    try {
      user = await User.create({
        username: creds.username,
        email: creds.email,
        password: hashedPassword,
      }).save();
    } catch (err) {
      return {
        errors: [
          {
            field: 'email',
            message: 'error occured',
          },
        ],
      };
    }

    req.session.userId = user?.id;
    return { user };
  }

  @Mutation(() => UserResponse, { nullable: true })
  async login(
    @Arg('creds', () => UserLoginInput) creds: UserLoginInput,
    @Ctx() { req }: Context
  ): Promise<UserResponse> {
    const user = await User.findOne({
      where: {
        username: creds.username,
      },
    });
    if (!user) {
      return {
        errors: [
          {
            field: 'username',
            message: 'no user with this name',
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, creds.password);
    if (!valid) {
      return {
        errors: [
          {
            field: 'password',
            message: 'wrong password',
          },
        ],
      };
    }

    req.session.userId = user?.id;
    return { user };
  }

  @Query(() => [User])
  async users() {
    return User.find({ relations: ['issues'] });
  }

  @Query(() => UserResponse)
  async user(@Arg('userId', () => Int) userId: number): Promise<UserResponse> {
    const user = await User.findOne(userId);
    return {
      user,
    };
  }

  @Query(() => User, { nullable: true })
  currentUser(@Ctx() { req }: Context) {
    if (!req.session.userId) {
      return null;
    }
    return User.findOne(req.session.userId);
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: Context) {
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          resolve(false);
          return;
        }
        resolve(true);
      });
    });
  }

  @Query(() => [Project], { nullable: true })
  async userProjects(@Ctx() { req }: Context): Promise<Project[] | null> {
    const userId = [req.session.userId];
    const pIdArr: number[] = [];
    const projectIds: Record<string, number>[] = await getConnection().query(
      `
      SELECT r."projectId"
      FROM project_users_user r
      WHERE r."userId" = $1
      `,
      userId
    );

    //rerun
    projectIds.forEach((e) => pIdArr.push(e.projectId));
    const projects = await Project.findByIds(pIdArr, {
      relations: ['users'],
      order: { updatedAt: 'DESC' },
    });

    // const projects = await getConnection().query(
    //   `
    //   SELECT r.*, p.*,
    //   json_build_array(
    //     json_build_object(
    //       'id', u.id,
    //       'username', u.username,
    //       'email', u.email,
    //       'createdAt', u."createdAt",
    //       'updatedAt', u."updatedAt"
    //     )
    //   ) users
    //   FROM project_users_user r
    //   INNER JOIN project p on p.id = r."projectId"
    //   INNER JOIN public.user u on u.id = r."userId"
    //   WHERE r."projectId" = $1
    //   ORDER by p."createdAt" DESC
    //   `

    //   // pIdArr
    // );

    if (!projects) {
      return null;
    }

    return projects;
  }
}
