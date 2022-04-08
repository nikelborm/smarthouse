import { Injectable } from '@nestjs/common';
import {
  ClientInitialHandshakeUseCase,
  GatewayAsClientUseCase,
} from 'src/modules';

import { repo } from 'src/modules/infrastructure';
import { EndpointType, EventType } from 'src/types';

@Injectable()
export class MockDataUseCase {
  constructor(
    private readonly eventRepo: repo.EventRepo,
    private readonly clientInitialHandshakeUseCase: ClientInitialHandshakeUseCase,
    private readonly gatewayAsClientUseCase: GatewayAsClientUseCase,
  ) {}

  async fillDBScript() {
    const doorHandshake = {
      shortname: 'door locked/unlocked open/close',
      fullname: 'Механизм открытия/закрытия дверей с обратной связью',
      description:
        'Механизм, который позволяет разблокировать дверь по команде и заблокировать дверь по команде, а также узнать дверь сейчас открыта или закрыта',

      uuid: '51eea88c-9c7c-49a5-b38c-a1526ac88e0f',

      encryptionWorkerUUID: 'ca4e23ec-f2a4-4d78-aa94-2065d72d5824',

      encryptionWorkerCredentials: {},
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
            optionalParameterUUIDs: [],
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
    const gatewayHandshake = {
      shortname: 'Шлюз',
      fullname: 'Шлюз',
      description:
        'Устройство, которое соединяет все устройства в одну сеть и выступает посредником в передаче всех сообщений. Шлюз хранит в себе информацию обо всех подключённых клиентах и то как они между собой соединены. Все сообщения проходят через шлюз, но для упрощения визуализации, сообщения проходят напрямую. Но сам шлюз может также выступпать и в роли клиента, обрабатывая сообщения например веб сервера',

      uuid: 'd7828c8a-f5a4-4890-ba4b-6fe15d995c6f',

      encryptionWorkerUUID: 'ca4e23ec-f2a4-4d78-aa94-2065d72d5824',

      encryptionWorkerCredentials: {},

      supported: {
        eventParameters: [
          {
            uuid: '3ec4f1b4-8b65-4fe2-b777-d8df4ce03eac',
            name: 'UUID сущности',
            dataValidatorUUID: '55912e8f-dcf8-4e8a-8816-a0e33c4c4366',
            measurementUnit: '-----',
          },
          {
            uuid: '715622d1-7866-466e-9786-49c8ef2e93f9',
            name: 'UUID выходного эндпоинта',
            dataValidatorUUID: '55912e8f-dcf8-4e8a-8816-a0e33c4c4366',
            measurementUnit: '-----',
          },
          {
            uuid: '9ac7f810-eabc-43bc-a714-e6f48b736d7c',
            name: 'UUID входного эндпоинта',
            dataValidatorUUID: '55912e8f-dcf8-4e8a-8816-a0e33c4c4366',
            measurementUnit: '-----',
          },
          {
            uuid: '4491eaf5-9f95-489d-9493-5af8e75cbf76',
            name: 'Надо ли приджойнивать маршруты к клиенту',
            dataValidatorUUID: '55912e8f-dcf8-4e8a-8816-a0e33c4c4366',
            measurementUnit: '-----',
          },
        ],
        events: [
          {
            uuid: '91de8904-65c8-4ea5-b323-65f37f9a2424',
            name: 'Команда: Создать маршрут',
            description: '-----',
            type: EventType.COMMAND,
            requiredParameterUUIDs: [
              '9ac7f810-eabc-43bc-a714-e6f48b736d7c',
              '715622d1-7866-466e-9786-49c8ef2e93f9',
            ],
            optionalParameterUUIDs: [],
            hexColor: '1abd23',
          },
          {
            uuid: 'c877a9fd-8480-4d7e-a740-93995c8a779e',
            name: 'Команда: Удалить маршрут',
            description: '-----',
            type: EventType.COMMAND,
            requiredParameterUUIDs: [
              '9ac7f810-eabc-43bc-a714-e6f48b736d7c',
              '715622d1-7866-466e-9786-49c8ef2e93f9',
            ],
            optionalParameterUUIDs: [],
            hexColor: '1abd23',
          },
          {
            uuid: '4377e209-22d6-4e46-8f62-6fbefdce65a9',
            name: 'Запрос: Получить список маршрутов (откуда и куда идёт эндпоинт) с приджойнеными эндпоинтами',
            description: '-----',
            type: EventType.QUERY,
            requiredParameterUUIDs: [],
            optionalParameterUUIDs: [
              '9ac7f810-eabc-43bc-a714-e6f48b736d7c',
              '715622d1-7866-466e-9786-49c8ef2e93f9',
            ],
            hexColor: '1abd23',
          },

          {
            uuid: 'd3adeb40-d41f-459a-a3ad-b198967fd11d',
            name: 'Команда: Создать клиент',
            description: '-----',
            type: EventType.COMMAND,
            requiredParameterUUIDs: [], // сюда передавать хендшейк json, но прям сейчас мы это релиазовыввать не будем
            optionalParameterUUIDs: [],
            hexColor: '1abd23',
          },
          {
            uuid: '99ee576d-c42f-464d-9682-83f62ba3721a',
            name: 'Запрос: Получить информацию о клиенте',
            description: '-----',
            type: EventType.QUERY,
            requiredParameterUUIDs: [
              '3ec4f1b4-8b65-4fe2-b777-d8df4ce03eac',
              '4491eaf5-9f95-489d-9493-5af8e75cbf76',
            ],
            optionalParameterUUIDs: [],
            hexColor: '1abd23',
          },
          {
            uuid: '552b5fde-036d-4850-ae17-e1d8ed64660f',
            name: 'Запрос: Получить информацию обо всех клиентах в системе с их эндпоинтами, без инфы о том как они соединены',
            description: '-----',
            type: EventType.QUERY,
            requiredParameterUUIDs: [],
            optionalParameterUUIDs: [],
            hexColor: '1abd23',
          },
          {
            uuid: 'b773420f-3a57-426c-b7a3-0dec53667a37',
            name: 'Команда: Удалить клиент',
            description: '-----',
            type: EventType.COMMAND,
            requiredParameterUUIDs: ['3ec4f1b4-8b65-4fe2-b777-d8df4ce03eac'],
            optionalParameterUUIDs: [],
            hexColor: '1abd23',
          },
          {
            uuid: '8fa5b0ac-400a-4b80-bc5a-f39d63611599',
            name: 'Команда: Аппрувнуть клиента',
            description: '-----',
            type: EventType.COMMAND,
            requiredParameterUUIDs: ['3ec4f1b4-8b65-4fe2-b777-d8df4ce03eac'],
            optionalParameterUUIDs: [],
            hexColor: '1abd23',
          },
          {
            uuid: 'f4bfcb53-7e06-48fd-a019-1c3ca7dd3b8d',
            name: 'Команда: Отредактировать клиента',
            description: '-----',
            type: EventType.COMMAND,
            requiredParameterUUIDs: ['3ec4f1b4-8b65-4fe2-b777-d8df4ce03eac'],
            optionalParameterUUIDs: [], // опциональные параметры на указание того какие поля изменились, но мы это делать не будем сейчас
            hexColor: '1abd23',
          },

          {
            uuid: 'a1df12b6-2403-4960-8d67-c851c2550caa',
            name: 'Запрос: Получить список всех событий в системе с прикреплёнными к ним параметрами',
            description: '-----',
            type: EventType.QUERY,
            requiredParameterUUIDs: [],
            optionalParameterUUIDs: [],
            hexColor: '1abd23',
          },
          {
            uuid: 'fd424f4e-064a-4f45-8294-f1228a2da475',
            name: 'Команда: Изменить событие',
            description: '-----',
            type: EventType.COMMAND,
            requiredParameterUUIDs: ['3ec4f1b4-8b65-4fe2-b777-d8df4ce03eac'],
            optionalParameterUUIDs: [], // опциональные параметры на указание того какие поля изменились, но мы это делать не будем сейчас
            hexColor: '1abd23',
          },

          {
            uuid: '635d41ab-c29b-4f38-8c77-d8b5c499c6d6',
            name: 'Запрос: Получить список всех параметров событий в системе с прикреплёнными к ним событиями',
            description: '-----',
            type: EventType.QUERY,
            requiredParameterUUIDs: [],
            optionalParameterUUIDs: [],
            hexColor: '1abd23',
          },
          {
            uuid: '4815bb1a-fd44-402a-b9e3-6742b837c33e',
            name: 'Команда: Изменить параметр события',
            description: '-----',
            type: EventType.COMMAND,
            requiredParameterUUIDs: ['3ec4f1b4-8b65-4fe2-b777-d8df4ce03eac'],
            optionalParameterUUIDs: [], // опциональные параметры на указание того какие поля изменились, но мы это делать не будем сейчас
            hexColor: '1abd23',
          },
        ],
        routeEndpoints: [
          {
            uuid: '18ebc545-5c33-42da-b879-48adac946ef5',
            name: 'Эндпоинт-вход: Команда: Создать маршрут',
            shortcode: '1',
            description: '-----',
            eventUUID: '91de8904-65c8-4ea5-b323-65f37f9a2424',
            type: EndpointType.EVENT_SINK,
            hexColor: '077291',
          },
          {
            uuid: '864eb22c-3c90-4f8f-b020-f0afeb7b9ba9',
            name: 'Эндпоинт-вход: Команда: Удалить маршрут',
            shortcode: '2',
            description: '-----',
            eventUUID: 'c877a9fd-8480-4d7e-a740-93995c8a779e',
            type: EndpointType.EVENT_SINK,
            hexColor: '077291',
          },
          {
            uuid: '2def646b-e7e5-40e5-a94c-9253b942dce4',
            name: 'Эндпоинт-вход: Запрос: Получить список маршрутов (откуда и куда идёт эндпоинт) с приджойнеными эндпоинтами',
            shortcode: '3',
            description: '-----',
            eventUUID: '4377e209-22d6-4e46-8f62-6fbefdce65a9',
            type: EndpointType.EVENT_SINK,
            hexColor: '077291',
          },
          {
            uuid: '117fd2d0-5ffd-4715-893a-a6f87612888b',
            name: 'Эндпоинт-вход: Команда: Создать клиент',
            shortcode: '4',
            description: '-----',
            eventUUID: 'd3adeb40-d41f-459a-a3ad-b198967fd11d',
            type: EndpointType.EVENT_SINK,
            hexColor: '077291',
          },
          {
            uuid: 'f1d5f1d6-a899-4ec8-abdb-301ab145a1ac',
            name: 'Эндпоинт-вход: Запрос: Получить информацию о клиенте',
            shortcode: '5',
            description: '-----',
            eventUUID: '99ee576d-c42f-464d-9682-83f62ba3721a',
            type: EndpointType.EVENT_SINK,
            hexColor: '077291',
          },
          {
            uuid: '0e1789a3-1d6a-41d5-b0ad-cbbd8b640eac',
            name: 'Эндпоинт-вход: Запрос: Получить информацию обо всех клиентах в системе с их эндпоинтами, без инфы о том как они соединены',
            shortcode: '6',
            description: '-----',
            eventUUID: '552b5fde-036d-4850-ae17-e1d8ed64660f',
            type: EndpointType.EVENT_SINK,
            hexColor: '077291',
          },
          {
            uuid: 'd6f90913-5cb5-4d87-a553-e691c4e75974',
            name: 'Эндпоинт-вход: Команда: Удалить клиент',
            shortcode: '7',
            description: '-----',
            eventUUID: 'b773420f-3a57-426c-b7a3-0dec53667a37',
            type: EndpointType.EVENT_SINK,
            hexColor: '077291',
          },
          {
            uuid: '71bdd03c-5f6b-4c4f-8d5e-dedf3461af2c',
            name: 'Эндпоинт-вход: Команда: Аппрувнуть клиента',
            shortcode: '8',
            description: '-----',
            eventUUID: '8fa5b0ac-400a-4b80-bc5a-f39d63611599',
            type: EndpointType.EVENT_SINK,
            hexColor: '077291',
          },
          {
            uuid: '7a542147-97cc-4120-b864-015eb104f675',
            name: 'Эндпоинт-вход: Команда: Отредактировать клиента',
            shortcode: '9',
            description: '-----',
            eventUUID: 'f4bfcb53-7e06-48fd-a019-1c3ca7dd3b8d',
            type: EndpointType.EVENT_SINK,
            hexColor: '077291',
          },
          {
            uuid: '9a5ebe14-582c-4076-ac7c-d7b34ac61eba',
            name: 'Эндпоинт-вход: Запрос: Получить список всех событий в системе с прикреплёнными к ним параметрами',
            shortcode: '10',
            description: '-----',
            eventUUID: 'a1df12b6-2403-4960-8d67-c851c2550caa',
            type: EndpointType.EVENT_SINK,
            hexColor: '077291',
          },
          {
            uuid: '98696981-c41f-4a40-8c35-5619a24ba825',
            name: 'Эндпоинт-вход: Команда: Изменить событие',
            shortcode: '11',
            description: '-----',
            eventUUID: 'fd424f4e-064a-4f45-8294-f1228a2da475',
            type: EndpointType.EVENT_SINK,
            hexColor: '077291',
          },
          {
            uuid: '2d533727-0a5c-4807-acd8-af502516917e',
            name: 'Эндпоинт-вход: Запрос: Получить список всех параметров событий в системе с прикреплёнными к ним событиями',
            shortcode: '12',
            description: '-----',
            eventUUID: '635d41ab-c29b-4f38-8c77-d8b5c499c6d6',
            type: EndpointType.EVENT_SINK,
            hexColor: '077291',
          },
          {
            uuid: '7af8cdd3-809f-46ba-b2fd-a23d0a10dc42',
            name: 'Эндпоинт-вход: Команда: Изменить параметр события',
            shortcode: '13',
            description: '-----',
            eventUUID: '4815bb1a-fd44-402a-b9e3-6742b837c33e',
            type: EndpointType.EVENT_SINK,
            hexColor: '077291',
          },
        ],
        transport: {
          wss: true,
          http: false,
        },
      },
    };
    const webserverHanshake = {
      shortname: 'Admin Веб сервер',
      fullname: 'Веб сервер',
      description:
        'Устройство, которое отправляет шлюзу команды на управление всеми узлами сети',

      uuid: 'cf2ca4a1-8c7f-40f7-91f7-03a10aa913ff',

      encryptionWorkerUUID: 'ca4e23ec-f2a4-4d78-aa94-2065d72d5824',

      encryptionWorkerCredentials: {},

      supported: {
        eventParameters: [
          {
            uuid: '3ec4f1b4-8b65-4fe2-b777-d8df4ce03eac',
            name: 'UUID сущности',
            dataValidatorUUID: '55912e8f-dcf8-4e8a-8816-a0e33c4c4366',
            measurementUnit: '-----',
          },
          {
            uuid: '715622d1-7866-466e-9786-49c8ef2e93f9',
            name: 'UUID выходного эндпоинта',
            dataValidatorUUID: '55912e8f-dcf8-4e8a-8816-a0e33c4c4366',
            measurementUnit: '-----',
          },
          {
            uuid: '9ac7f810-eabc-43bc-a714-e6f48b736d7c',
            name: 'UUID входного эндпоинта',
            dataValidatorUUID: '55912e8f-dcf8-4e8a-8816-a0e33c4c4366',
            measurementUnit: '-----',
          },
          {
            uuid: '4491eaf5-9f95-489d-9493-5af8e75cbf76',
            name: 'Надо ли приджойнивать маршруты к клиенту',
            dataValidatorUUID: '55912e8f-dcf8-4e8a-8816-a0e33c4c4366',
            measurementUnit: '-----',
          },
        ],
        events: [
          {
            uuid: '91de8904-65c8-4ea5-b323-65f37f9a2424',
            name: 'Команда: Создать маршрут',
            description: '-----',
            type: EventType.COMMAND,
            requiredParameterUUIDs: [
              '9ac7f810-eabc-43bc-a714-e6f48b736d7c',
              '715622d1-7866-466e-9786-49c8ef2e93f9',
            ],
            optionalParameterUUIDs: [],
            hexColor: '1abd23',
          },
          {
            uuid: 'c877a9fd-8480-4d7e-a740-93995c8a779e',
            name: 'Команда: Удалить маршрут',
            description: '-----',
            type: EventType.COMMAND,
            requiredParameterUUIDs: [
              '9ac7f810-eabc-43bc-a714-e6f48b736d7c',
              '715622d1-7866-466e-9786-49c8ef2e93f9',
            ],
            optionalParameterUUIDs: [],
            hexColor: '1abd23',
          },
          {
            uuid: '4377e209-22d6-4e46-8f62-6fbefdce65a9',
            name: 'Запрос: Получить список маршрутов (откуда и куда идёт эндпоинт) с приджойнеными эндпоинтами',
            description: '-----',
            type: EventType.QUERY,
            requiredParameterUUIDs: [],
            optionalParameterUUIDs: [
              '9ac7f810-eabc-43bc-a714-e6f48b736d7c',
              '715622d1-7866-466e-9786-49c8ef2e93f9',
            ],
            hexColor: '1abd23',
          },

          {
            uuid: 'd3adeb40-d41f-459a-a3ad-b198967fd11d',
            name: 'Команда: Создать клиент',
            description: '-----',
            type: EventType.COMMAND,
            requiredParameterUUIDs: [], // сюда передавать хендшейк json, но прям сейчас мы это релиазовыввать не будем
            optionalParameterUUIDs: [],
            hexColor: '1abd23',
          },
          {
            uuid: '99ee576d-c42f-464d-9682-83f62ba3721a',
            name: 'Запрос: Получить информацию о клиенте',
            description: '-----',
            type: EventType.QUERY,
            requiredParameterUUIDs: [
              '3ec4f1b4-8b65-4fe2-b777-d8df4ce03eac',
              '4491eaf5-9f95-489d-9493-5af8e75cbf76',
            ],
            optionalParameterUUIDs: [],
            hexColor: '1abd23',
          },
          {
            uuid: '552b5fde-036d-4850-ae17-e1d8ed64660f',
            name: 'Запрос: Получить информацию обо всех клиентах в системе с их эндпоинтами, без инфы о том как они соединены',
            description: '-----',
            type: EventType.QUERY,
            requiredParameterUUIDs: [],
            optionalParameterUUIDs: [],
            hexColor: '1abd23',
          },
          {
            uuid: 'b773420f-3a57-426c-b7a3-0dec53667a37',
            name: 'Команда: Удалить клиент',
            description: '-----',
            type: EventType.COMMAND,
            requiredParameterUUIDs: ['3ec4f1b4-8b65-4fe2-b777-d8df4ce03eac'],
            optionalParameterUUIDs: [],
            hexColor: '1abd23',
          },
          {
            uuid: '8fa5b0ac-400a-4b80-bc5a-f39d63611599',
            name: 'Команда: Аппрувнуть клиента',
            description: '-----',
            type: EventType.COMMAND,
            requiredParameterUUIDs: ['3ec4f1b4-8b65-4fe2-b777-d8df4ce03eac'],
            optionalParameterUUIDs: [],
            hexColor: '1abd23',
          },
          {
            uuid: 'f4bfcb53-7e06-48fd-a019-1c3ca7dd3b8d',
            name: 'Команда: Отредактировать клиента',
            description: '-----',
            type: EventType.COMMAND,
            requiredParameterUUIDs: ['3ec4f1b4-8b65-4fe2-b777-d8df4ce03eac'],
            optionalParameterUUIDs: [], // опциональные параметры на указание того какие поля изменились, но мы это делать не будем сейчас
            hexColor: '1abd23',
          },

          {
            uuid: 'a1df12b6-2403-4960-8d67-c851c2550caa',
            name: 'Запрос: Получить список всех событий в системе с прикреплёнными к ним параметрами',
            description: '-----',
            type: EventType.QUERY,
            requiredParameterUUIDs: [],
            optionalParameterUUIDs: [],
            hexColor: '1abd23',
          },
          {
            uuid: 'fd424f4e-064a-4f45-8294-f1228a2da475',
            name: 'Команда: Изменить событие',
            description: '-----',
            type: EventType.COMMAND,
            requiredParameterUUIDs: ['3ec4f1b4-8b65-4fe2-b777-d8df4ce03eac'],
            optionalParameterUUIDs: [], // опциональные параметры на указание того какие поля изменились, но мы это делать не будем сейчас
            hexColor: '1abd23',
          },

          {
            uuid: '635d41ab-c29b-4f38-8c77-d8b5c499c6d6',
            name: 'Запрос: Получить список всех параметров событий в системе с прикреплёнными к ним событиями',
            description: '-----',
            type: EventType.QUERY,
            requiredParameterUUIDs: [],
            optionalParameterUUIDs: [],
            hexColor: '1abd23',
          },
          {
            uuid: '4815bb1a-fd44-402a-b9e3-6742b837c33e',
            name: 'Команда: Изменить параметр события',
            description: '-----',
            type: EventType.COMMAND,
            requiredParameterUUIDs: ['3ec4f1b4-8b65-4fe2-b777-d8df4ce03eac'],
            optionalParameterUUIDs: [], // опциональные параметры на указание того какие поля изменились, но мы это делать не будем сейчас
            hexColor: '1abd23',
          },
        ],
        routeEndpoints: [
          {
            uuid: '70da3236-e82a-4869-9b2d-51e2fc3cdc17',
            name: 'Эндпоинт-выход: Команда: Создать маршрут',
            shortcode: '1',
            description: '-----',
            eventUUID: '91de8904-65c8-4ea5-b323-65f37f9a2424',
            type: EndpointType.EVENT_SOURCE,
            hexColor: '077291',
          },
          {
            uuid: '5dd4f4bd-a165-44c6-9b2f-d39f6869d135',
            name: 'Эндпоинт-выход: Команда: Удалить маршрут',
            shortcode: '2',
            description: '-----',
            eventUUID: 'c877a9fd-8480-4d7e-a740-93995c8a779e',
            type: EndpointType.EVENT_SOURCE,
            hexColor: '077291',
          },
          {
            uuid: '638bca8f-6f98-406a-bbad-0602bab08426',
            name: 'Эндпоинт-выход: Запрос: Получить список маршрутов (откуда и куда идёт эндпоинт) с приджойнеными эндпоинтами',
            shortcode: '3',
            description: '-----',
            eventUUID: '4377e209-22d6-4e46-8f62-6fbefdce65a9',
            type: EndpointType.EVENT_SOURCE,
            hexColor: '077291',
          },
          {
            uuid: 'b658622c-0266-4018-96e1-02d5b490b699',
            name: 'Эндпоинт-выход: Команда: Создать клиент',
            shortcode: '4',
            description: '-----',
            eventUUID: 'd3adeb40-d41f-459a-a3ad-b198967fd11d',
            type: EndpointType.EVENT_SOURCE,
            hexColor: '077291',
          },
          {
            uuid: '15f47344-17d3-491d-94ab-987901510c58',
            name: 'Эндпоинт-выход: Запрос: Получить информацию о клиенте',
            shortcode: '5',
            description: '-----',
            eventUUID: '99ee576d-c42f-464d-9682-83f62ba3721a',
            type: EndpointType.EVENT_SOURCE,
            hexColor: '077291',
          },
          {
            uuid: '2560084f-6108-4c86-9bd8-3063ded9da76',
            name: 'Эндпоинт-выход: Запрос: Получить информацию обо всех клиентах в системе с их эндпоинтами, без инфы о том как они соединены',
            shortcode: '6',
            description: '-----',
            eventUUID: '552b5fde-036d-4850-ae17-e1d8ed64660f',
            type: EndpointType.EVENT_SOURCE,
            hexColor: '077291',
          },
          {
            uuid: '57779aba-3b47-4f9d-97c9-9b9ac8108946',
            name: 'Эндпоинт-выход: Команда: Удалить клиент',
            shortcode: '7',
            description: '-----',
            eventUUID: 'b773420f-3a57-426c-b7a3-0dec53667a37',
            type: EndpointType.EVENT_SOURCE,
            hexColor: '077291',
          },
          {
            uuid: '91430a30-6aa0-4ba2-a1b7-41e2894fd219',
            name: 'Эндпоинт-выход: Команда: Аппрувнуть клиента',
            shortcode: '8',
            description: '-----',
            eventUUID: '8fa5b0ac-400a-4b80-bc5a-f39d63611599',
            type: EndpointType.EVENT_SOURCE,
            hexColor: '077291',
          },
          {
            uuid: '1b5c56e9-486e-4ff0-a640-54ad24d5b257',
            name: 'Эндпоинт-выход: Команда: Отредактировать клиента',
            shortcode: '9',
            description: '-----',
            eventUUID: 'f4bfcb53-7e06-48fd-a019-1c3ca7dd3b8d',
            type: EndpointType.EVENT_SOURCE,
            hexColor: '077291',
          },
          {
            uuid: 'eed06e30-db57-4ee5-bfc4-b9e15a95a498',
            name: 'Эндпоинт-выход: Запрос: Получить список всех событий в системе с прикреплёнными к ним параметрами',
            shortcode: '10',
            description: '-----',
            eventUUID: 'a1df12b6-2403-4960-8d67-c851c2550caa',
            type: EndpointType.EVENT_SOURCE,
            hexColor: '077291',
          },
          {
            uuid: '82d68be6-ac39-4fa5-a63a-413edc69028b',
            name: 'Эндпоинт-выход: Команда: Изменить событие',
            shortcode: '11',
            description: '-----',
            eventUUID: 'fd424f4e-064a-4f45-8294-f1228a2da475',
            type: EndpointType.EVENT_SOURCE,
            hexColor: '077291',
          },
          {
            uuid: 'd8f92aa0-f8a8-415c-b1db-d1a3b96b4e09',
            name: 'Эндпоинт-выход: Запрос: Получить список всех параметров событий в системе с прикреплёнными к ним событиями',
            shortcode: '12',
            description: '-----',
            eventUUID: '635d41ab-c29b-4f38-8c77-d8b5c499c6d6',
            type: EndpointType.EVENT_SOURCE,
            hexColor: '077291',
          },
          {
            uuid: '527ab762-8cee-4be8-886d-daa844625337',
            name: 'Эндпоинт-выход: Команда: Изменить параметр события',
            shortcode: '13',
            description: '-----',
            eventUUID: '4815bb1a-fd44-402a-b9e3-6742b837c33e',
            type: EndpointType.EVENT_SOURCE,
            hexColor: '077291',
          },
        ],
        transport: {
          wss: true,
          http: false,
        },
      },
    };

    try {
      await this.eventRepo.createOneWithRelations({
        uuid: 'adcb7802-a91c-44cb-8404-fd01d2af4624',
        name: 'Установить статус блокировки двери',
        description:
          'Команда, которая приводит к установки статуса блокировки двери',
        type: EventType.COMMAND,
        hexColor: '126067',
      });

      const asd2 = await this.clientInitialHandshakeUseCase.init(doorHandshake);
      console.log('doorHandshake response: ', asd2);

      const asd3 = await this.clientInitialHandshakeUseCase.init(
        gatewayHandshake,
      );
      console.log('doorHandshake response: ', asd3);

      const asd4 = await this.clientInitialHandshakeUseCase.init(
        webserverHanshake,
      );
      console.log('doorHandshake response: ', asd4);
    } catch (error) {
      console.log('error: ', error);
    }
  }
}
