import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { EventParameter } from '.';

@Entity({ name: 'data_validator' })
export class DataValidator {
  @PrimaryGeneratedColumn({ name: 'data_validator_id' })
  id!: number;

  @Column({
    name: 'data_validator_uuid',
    type: 'uuid',
    nullable: false,
    unique: true,
  })
  uuid!: string;

  @Column({
    name: 'data_validator_name',
    nullable: false,
  })
  name!: string;

  @OneToMany(
    () => EventParameter,
    (eventParameter) => eventParameter.dataValidator,
  )
  eventParameters!: EventParameter[];
}

// По умолчанию будут включены следующие валидаторы данных

// float: aae1f077-aeeb-4e84-8e9e-5c0e402e8af9
// integer: 00db2932-12b8-415f-b5f2-9f6f6f8d8d06
// boolean: 930877ce-d692-4ae1-a1db-580ae6546c36
// string: 7f28e4a4-eec8-408f-bf61-a4d7cf734a45
// date: 17a8cf06-0490-4326-941b-660d56de4e73
// json: e9693774-a2d1-450a-b293-e77298e47bad

// Также производители могут загружать свои кастомные валидаторы данных
// тем самым например создавая свои типы данных аля enum или другие даже вложенные структуры
