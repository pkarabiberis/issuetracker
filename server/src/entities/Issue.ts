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
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Project } from './Project';
import { User } from './User';

@ObjectType()
@Entity()
export class Issue extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ unique: true })
  title!: string;

  @Field(() => Int)
  @Column()
  creatorId: number;

  @Field(() => String)
  @Column({ nullable: true })
  due: Date;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  projectId: number;

  @Field(() => String)
  @Column({ nullable: true })
  status: string;

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.issues)
  @JoinTable()
  assignedUsers: User[];

  @ManyToOne(() => Project, (project) => project.issues)
  project: Project;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}