import { EventType } from 'src/types';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Endpoint, ParameterTypeToEventAssociation } from '.';

@Entity({ name: 'event' })
export class Event {
  @PrimaryGeneratedColumn({ name: 'event_id' })
  id!: number;

  @Column({
    name: 'event_uuid',
    type: 'uuid',
    nullable: false,
    unique: true,
  })
  uuid!: string;

  @Column({
    name: 'event_name',
    nullable: false,
  })
  name!: string;

  @Column({
    name: 'event_name_alias',
    nullable: true,
  })
  nameAlias!: string;

  @Column({
    name: 'event_description',
    nullable: false,
  })
  description!: string;

  @Column({
    name: 'event_description_alias',
    nullable: true,
  })
  descriptionAlias!: string;

  @Column({
    type: 'enum',
    enum: EventType,
    nullable: false,
  })
  type!: EventType;

  @OneToMany(() => Endpoint, (endpoint) => endpoint.event)
  endpoints!: Endpoint[];

  @OneToMany(
    () => ParameterTypeToEventAssociation,
    (parameterAssociation) => parameterAssociation.event,
  )
  parameterAssociations!: ParameterTypeToEventAssociation[];

  @Column({
    name: 'event_hex_color',
    nullable: false,
    type: 'char', // TODO: превратить в binary длиной 3 байта
    length: 6,
  })
  hexColor!: string;
}
