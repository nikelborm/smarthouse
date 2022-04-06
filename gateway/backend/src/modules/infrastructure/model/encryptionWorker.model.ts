import {
  Entity,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Client } from '.';

@Entity({ name: 'encryption_worker' })
export class EncryptionWorker {
  @Column({
    name: 'encryption_worker_uuid',
    type: 'uuid',
    nullable: false,
    primary: true,
  })
  uuid!: string;

  @Column({
    name: 'encryption_worker_name',
    nullable: false,
  })
  name!: string;

  @OneToMany(() => Client, (client) => client.encryptionWorker)
  clients!: Client[];

  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: false })
  updatedAt!: Date;
}
