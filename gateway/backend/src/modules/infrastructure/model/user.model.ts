import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { AccessScope } from '.';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  firstName!: string;

  @Column({ nullable: false, default: '' })
  lastName!: string;

  @Column({ nullable: false, unique: true })
  email!: string;

  @Column({ nullable: false, select: false })
  salt!: string;

  @Column({ nullable: false, select: false })
  passwordHash!: string;

  @ManyToMany(
    () => AccessScope,
    (accessScope) => accessScope.usersWithThatAccessScope,
  )
  @JoinTable({ name: 'user_to_access_scope' })
  accessScopes!: AccessScope[];
}
