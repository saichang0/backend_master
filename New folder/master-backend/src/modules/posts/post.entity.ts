import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../users/user.entity";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title?: string;

  @Column()
  details?: string;

  @Column()
  url?: string;

  @Column()
  userId!: number;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: "userId" }) // Specify the join column
  userData!: User;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
