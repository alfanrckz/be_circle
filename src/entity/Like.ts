import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  ManyToMany,
} from "typeorm";
import { Threads } from "./Threads";
import { User } from "./User";
import { Reply } from "./Reply";

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Threads, (thread) => thread.likes, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  thread: Threads;

  @ManyToOne(() => Reply, (reply) => reply.likes, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  reply: Reply;

  @ManyToOne(() => User, (user) => user.likes, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  user: User;
}
