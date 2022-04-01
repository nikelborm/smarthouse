import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  DeleteDateColumn,
} from 'typeorm';
import { AccessScopeType } from 'src/types';
import { User } from '.';

@Entity()
export class AccessScope {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'enum',
    enum: AccessScopeType,
    nullable: false,
  })
  type!: AccessScopeType;

  @ManyToMany(() => User, (user) => user.accessScopes)
  usersWithThatAccessScope!: User[];

  @DeleteDateColumn({ select: false })
  deletedAt?: Date;
}
