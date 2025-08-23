import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Post } from "../posts/post.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullname?: string;

  @Column()
  email?: string;

  @Column()
  password!: string;

  @OneToMany(() => Post, (post) => post.userData)
  posts!: Post[];
}
