import { Injectable } from '@nestjs/common';
import { ClientInitialHandshakeUseCase } from 'src/modules';

import { repo } from 'src/modules/infrastructure';
import { EndpointType, EventType } from 'src/types';

@Injectable()
export class MockDataUseCase {
  constructor(
    private readonly routeRepo: repo.RouteRepo,
    private readonly clientInitialHandshakeUseCase: ClientInitialHandshakeUseCase,
  ) {}

  async fillDBScript() {
    const asd = {
      shortname: 'door locked/unlocked open/close',
      fullname: 'Механизм открытия/закрытия дверей с обратной связью',
      description:
        'Механизм, который позволяет разблокировать дверь по команде и заблокировать дверь по команде, а также узнать дверь сейчас открыта или закрыта',

      uuid: '51eea88c-9c7c-49a5-b38c-a1526ac88e0f',

      encryptionWorkerUUID: 'ca4e23ec-f2a4-4d78-aa94-206s5d72d5824',

      encryptionWorkerCredentials: {
        clientPublicKey: 'public client key of esp8266',
        clientUUIDSignedByClientPrivateKey:
          'blablablablablabalblalbabalbbalablablalbablaabllbaablabalbalablablablabalb',
      },

      supported: {
        eventParameters: [
          {
            uuid: 'b0f1315d-b681-4a39-b50c-ad30b0740d96',
            name: 'Флаг: Должна ли быть заблокирована дверь?',
            dataValidatorUUID: '930877ce-d692-4ae1-a1db-580ae6546c36',
            measurementUnit: 'Булево значение',
          },
        ],
        events: [
          {
            uuid: '344fe486-4006-445c-ab92-84cb427e2d7e',
            name: 'Заблокировать дверь',
            description: 'Команда, которая приводит к блокировке двери',
            type: EventType.COMMAND,
            requiredParameterUUIDs: [],
            optionalParameterUUIDs: [],
            hexColor: '1abd23',
          },
          {
            uuid: '08ff24dd-1cc8-424a-a638-88e68cf4218e',
            name: 'Разблокировать дверь',
            description: 'Команда, которая приводит к разблокировке двери',
            type: EventType.COMMAND,
            requiredParameterUUIDs: [],
            optionalParameterUUIDs: [],
            hexColor: '123abd',
          },
          {
            uuid: 'adcb7802-a91c-44cb-8404-fd01d2af4624',
            name: 'Установить статус блокировки двери',
            description:
              'Команда, которая приводит к установки статуса блокировки двери',
            type: EventType.COMMAND,
            requiredParameterUUIDs: ['b0f1315d-b681-4a39-b50c-ad30b0740d96'],
            optionalParameterUUIDs: ['b0f1315d-b681-4a39-b50c-ad30b0740d96'],
            hexColor: '126067',
          },
          {
            uuid: '88658487-39c3-484e-81d3-84c432d72d44',
            name: 'Дверь Открылась',
            description: 'Лог о том, что открылась дверь',
            type: EventType.LOG,
            requiredParameterUUIDs: [],
            optionalParameterUUIDs: [],
            hexColor: '0e8203',
          },
          {
            uuid: 'a04a2a11-2f2d-4f5e-9659-7337f4543f7a',
            name: 'Дверь закрылась',
            description: 'Лог о том, что закрылась дверь',
            type: EventType.LOG,
            requiredParameterUUIDs: [],
            optionalParameterUUIDs: [],
            hexColor: '10128d',
          },
        ],
        routeEndpoints: [
          {
            uuid: '0578d33e-0f83-411d-91e8-a6eb3add4432',
            name: 'Unlock door endpoint',
            shortcode: 'UD',
            description: 'Вход для команды на разблокировку двери',
            eventUUID: '08ff24dd-1cc8-424a-a638-88e68cf4218e',
            type: EndpointType.EVENT_SINK,
            hexColor: '077291',
          },
          {
            uuid: 'c2d4e359-1171-44c0-b1c7-4ab44b9de44a',
            name: 'Lock door endpoint',
            shortcode: 'LD',
            description: 'Вход для команды на блокировку двери',
            eventUUID: '344fe486-4006-445c-ab92-84cb427e2d7e',
            type: EndpointType.EVENT_SINK,
            hexColor: '169420',
          },
          {
            uuid: '98e6e883-6b15-46e5-9fc8-9aef8116e47c',
            name: 'Set door status endpoint',
            shortcode: 'SDS',
            description:
              'Вход для команды на установку статуса блокировки двери',
            eventUUID: 'adcb7802-a91c-44cb-8404-fd01d2af4624',
            type: EndpointType.EVENT_SINK,
            hexColor: '845130',
          },
          {
            uuid: 'db414f8b-a7b9-4c94-b00e-c0f9890e1b8e',
            name: 'Door was opened',
            shortcode: 'OD',
            description: 'Выход с сообщениями об открытой двери',
            eventUUID: '88658487-39c3-484e-81d3-84c432d72d44',
            type: EndpointType.EVENT_SOURCE,
            hexColor: '160420',
          },
          {
            uuid: '646014f8-d864-462e-a49c-6209f083884c',
            name: 'Door was closed',
            shortcode: 'CD',
            description: 'Выход с сообщениями о закрытой двери',
            eventUUID: 'a04a2a11-2f2d-4f5e-9659-7337f4543f7a',
            type: EndpointType.EVENT_SOURCE,
            hexColor: '840130',
          },
        ],
        transport: {
          wss: true,
          http: false,
        },
      },
    };
    try {
      await this.clientInitialHandshakeUseCase.init(asd);
    } catch (error) {
      console.log('error: ', error);
    }
  }
}
