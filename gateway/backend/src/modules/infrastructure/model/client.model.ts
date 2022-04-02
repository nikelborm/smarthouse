import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EncryptionWorkerCredentialsStoredInDB } from 'src/types';
import { Endpoint, EncryptionWorker } from '.';

@Entity({ name: 'client' })
export class Client {
  @PrimaryGeneratedColumn({ name: 'client_id' })
  id!: number;

  @Column({
    name: 'client_uuid',
    type: 'uuid',
    nullable: false,
    unique: true,
  })
  uuid!: string;

  @Column({
    name: 'client_shortname',
    nullable: false,
  })
  shortname!: string;

  @Column({
    name: 'client_shortname_alias',
    nullable: true,
  })
  shortnameAlias!: string;

  @Column({
    name: 'client_fullname',
    nullable: false,
  })
  fullname!: string;

  @Column({
    name: 'client_fullname_alias',
    nullable: true,
  })
  fullnameAlias!: string;

  @Column({
    name: 'client_description',
    nullable: false,
  })
  description!: string;

  @Column({
    name: 'client_description_alias',
    nullable: true,
  })
  descriptionAlias!: string;

  @Column({
    type: 'timestamptz',
    nullable: false,
    name: 'client_was_last_active_at',
  })
  wasLastActiveAt!: Date;

  @ManyToOne(
    () => EncryptionWorker,
    (encryptionWorker) => encryptionWorker.clients,
    { nullable: false },
  )
  @JoinColumn({ name: 'encryption_worker_id' })
  encryptionWorker!: EncryptionWorker;

  @Column({
    name: 'encryption_worker_id',
    nullable: false,
  })
  encryptionWorkerId!: number;

  @Column({
    name: 'client_encryption_credentials',
    nullable: false,
    type: 'jsonb',
  })
  encryptionWorkerCredentials!: EncryptionWorkerCredentialsStoredInDB;

  @OneToMany(() => Endpoint, (endpoint) => endpoint.client)
  endpoints!: Endpoint[];

  // TODO: configuration?????
}
