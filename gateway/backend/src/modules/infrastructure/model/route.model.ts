import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
  Unique,
  JoinColumn,
} from 'typeorm';
import { Endpoint } from './';

@Entity({ name: 'route' })
@Index(['source_endpoint_id', 'sink_endpoint_id'], { unique: true })
@Unique(['source_endpoint_id', 'sink_endpoint_id'])
export class Route {
  @PrimaryGeneratedColumn({ name: 'route_id' })
  id!: number;

  @ManyToOne(() => Endpoint, (endpoint) => endpoint.outcomingRoutes, {
    nullable: false,
  })
  @JoinColumn({ name: 'source_endpoint_id' })
  sourceEndpoint!: Endpoint;

  @Column({
    nullable: false,
    name: 'source_endpoint_id',
  })
  sourceEndpointId: number;

  @ManyToOne(() => Endpoint, (endpoint) => endpoint.incomingRoutes, {
    nullable: false,
  })
  @JoinColumn({ name: 'sink_endpoint_id' })
  sinkEndpoint!: Endpoint;

  @Column({
    nullable: false,
    name: 'sink_endpoint_id',
  })
  sinkEndpointId: number;
}
