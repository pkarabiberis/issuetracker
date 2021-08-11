import { Field, Int, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Issue } from './Issue';
import { User } from './User';

@ObjectType()
@Entity()
export class Project extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ unique: true })
  name!: string;

  @Field(() => Int)
  @Column()
  creatorId: number;

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.projects)
  @JoinTable()
  users: User[];

  @Field(() => [Issue])
  @OneToMany(() => Issue, (issue) => issue.project, {
    onDelete: 'CASCADE',
  })
  issues: Issue[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
