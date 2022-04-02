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

// По умолчанию будут включены следующие алгоритмы шифрования
// 'nothing': 'ca4e23ec-f2a4-4d78-aa94-2065d72d5824'
// 'rsa512': '92782e54-ac5b-4787-b940-2fd0978fc4b8'
// 'aes128': '6b8d962d-ac90-4719-8ae8-a5da728b750d'
