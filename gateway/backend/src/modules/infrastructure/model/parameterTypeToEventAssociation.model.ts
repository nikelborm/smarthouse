import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
  Unique,
  JoinColumn,
} from 'typeorm';
import { EventParameter, Event } from '.';

@Entity({ name: 'parameter_type_to_event_association' })
@Index(['event_parameter_id', 'event_id'], { unique: true })
@Unique(['event_parameter_id', 'event_id'])
export class ParameterTypeToEventAssociation {
  @PrimaryGeneratedColumn({ name: 'parameter_type_to_event_association_id' })
  id!: number;

  @ManyToOne(
    () => EventParameter,
    (eventParameter) => eventParameter.eventAssociations,
    { nullable: false },
  )
  @JoinColumn({ name: 'event_parameter_id' })
  eventParameter!: EventParameter;

  @Column({
    nullable: false,
    name: 'event_parameter_id',
  })
  eventParameterId!: number;

  @ManyToOne(() => Event, (event) => event.parameterAssociations, {
    nullable: false,
  })
  @JoinColumn({ name: 'event_id' })
  event!: Event;

  @Column({
    nullable: false,
    name: 'event_id',
  })
  eventId!: number;

  @Column({
    nullable: false,
    name: 'is_parameter_required_for_event',
  })
  isParameterRequired!: boolean;
}
