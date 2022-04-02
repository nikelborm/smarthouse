import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Client } from '.';

@Entity({ name: 'encryption_worker' })
export class EncryptionWorker {
  @PrimaryGeneratedColumn({ name: 'encryption_worker_id' })
  id!: number;

  @Column({
    name: 'encryption_worker_uuid',
    type: 'uuid',
    nullable: false,
    unique: true,
  })
  uuid!: string;

  @Column({
    name: 'encryption_worker_name',
    nullable: false,
  })
  name!: string;

  @OneToMany(() => Client, (client) => client.encryptionWorker)
  clients!: Client[];
}
