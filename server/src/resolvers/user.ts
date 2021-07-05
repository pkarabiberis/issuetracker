import { User } from '../entities/User';
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import argon2 from 'argon2';
import { Context } from 'src/types';

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
      console.log(err.message);
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
  users(): Promise<User[]> {
    return User.find({});
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: Context) {
    if (!req.session.userId) {
      return null;
    }
    return User.findOne(req.session.userId);
  }
}
