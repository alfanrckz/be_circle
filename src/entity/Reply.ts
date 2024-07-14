import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { Threads } from "./Threads";
import { Like } from "./Like";

@Entity()
export class Reply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => Threads, (thread) => thread.replies, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  thread: Threads;

  @ManyToOne(() => Reply, (reply) => reply.replies, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  reply: Reply;

  @OneToMany(() => Like, (like) => like.reply)
  likes: Like[];

  @OneToMany(() => Reply, (reply) => reply.reply)
  replies: Reply[];

  @Column({ default: () => "NOW()" })
  created_at: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
