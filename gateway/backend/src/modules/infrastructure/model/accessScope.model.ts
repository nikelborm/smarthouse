import { AccessScopeType, AccessScopeTypeClarification } from 'src/types';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '.';

@Entity()
export class AccessScope {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  name!: string; // 'mixed' | 'admin' | 'superAdmin' and so on (anything you want)

  @Column({
    type: 'enum',
    enum: AccessScopeType,
    nullable: false,
  })
  type!: AccessScopeType;

  @Column({
    type: 'enum',
    enum: AccessScopeTypeClarification,
    nullable: true,
    default: null,
  })
  typeClarification?: AccessScopeTypeClarification;

  @ManyToMany(() => User, (user) => user.accessScopes)
  usersWithThatAccessScope!: User[];

  @DeleteDateColumn({ select: false })
  deletedAt?: Date;
}
