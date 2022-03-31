import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { EndpointType } from 'src/types';
import { Client, Event, Route } from './';

@Entity({ name: 'endpoint' })
export class Endpoint {
  @PrimaryGeneratedColumn({ name: 'endpoint_id' })
  id!: number;

  @Column({
    name: 'endpoint_uuid',
    type: 'uuid',
    nullable: false,
    unique: true,
  })
  uuid!: string;

  @Column({
    name: 'endpoint_name',
    nullable: false,
  })
  name!: string;

  @Column({
    name: 'endpoint_name_alias',
    nullable: true,
  })
  nameAlias!: string;

  @Column({
    name: 'endpoint_shortcode',
    nullable: false,
    type: 'varchar',
    length: 4,
  })
  shortcode!: string;

  @Column({
    name: 'endpoint_description',
    nullable: false,
  })
  description!: string;

  @Column({
    name: 'endpoint_description_alias',
    nullable: true,
  })
  descriptionAlias!: string;

  @ManyToOne(() => Event, (event) => event.endpoints, { nullable: false })
  @JoinColumn({ name: 'event_id' })
  event!: Event;

  @Column({ nullable: false, name: 'event_id' })
  eventId: number;

  @ManyToOne(() => Client, (client) => client.endpoints, { nullable: false })
  @JoinColumn({ name: 'client_id' })
  client!: Client;

  @Column({ nullable: false, name: 'client_id' })
  clientId: number;

  @Column({
    type: 'enum',
    enum: EndpointType,
    nullable: false,
  })
  type!: EndpointType;

  @OneToMany(() => Route, (route) => route.sourceEndpoint)
  outcomingRoutes: Route[];

  @OneToMany(() => Route, (route) => route.sinkEndpoint)
  incomingRoutes: Route[];

  @Column({
    name: 'endpoint_hex_color',
    nullable: false,
    type: 'char', // TODO: превратить в binary длиной 3 байта
    length: 6,
  })
  hexColor!: string;
  // configuration?????
}
