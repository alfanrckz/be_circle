import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { Like } from "./Like";
import { Reply } from "./Reply";

@Entity()
export class Threads {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => Like, (like) => like.thread)
  likes: Like[];

  @OneToMany(() => Reply, (reply) => reply.thread)
  replies: Reply[];

  @Column({ default: () => "NOW()" })
  created_at: Date;

  @Column({ default: () => "NOW()" })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.threads)
  user: User;
}
