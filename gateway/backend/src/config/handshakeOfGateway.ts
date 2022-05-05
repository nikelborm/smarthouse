import { EndpointType, EventType } from 'src/types';

export const handshakeOfGateway = {
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
        uuid: '67f6bbd6-e0f6-4427-aeb2-c12c4ac6d9ff',
        name: 'JSON response',
        dataValidatorUUID: '2a07c01f-ebb9-4f47-97e4-be09142e16af',
        measurementUnit: '-----',
      },
      {
        uuid: '3ec4f1b4-8b65-4fe2-b777-d8df4ce03eac',
        name: 'UUID сущности',
        dataValidatorUUID: '55912e8f-dcf8-4e8a-8816-a0e33c4c4366',
        measurementUnit: '-----',
      },
      {
        uuid: '715622d1-7866-466e-9786-49c8ef2e93f9',
        name: 'ID выходного эндпоинта',
        dataValidatorUUID: 'dafb84cc-8e4d-45a2-9dac-41067be67b89',
        measurementUnit: '-----',
      },
      {
        uuid: '9ac7f810-eabc-43bc-a714-e6f48b736d7c',
        name: 'ID входного эндпоинта',
        dataValidatorUUID: 'dafb84cc-8e4d-45a2-9dac-41067be67b89',
        measurementUnit: '-----',
      },
      {
        uuid: '4491eaf5-9f95-489d-9493-5af8e75cbf76',
        name: 'Надо ли приджойнивать маршруты к клиенту',
        dataValidatorUUID: '930877ce-d692-4ae1-a1db-580ae6546c36',
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
          '67f6bbd6-e0f6-4427-aeb2-c12c4ac6d9ff',
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
        optionalParameterUUIDs: ['67f6bbd6-e0f6-4427-aeb2-c12c4ac6d9ff'],
        hexColor: '1abd23',
      },
      {
        uuid: '552b5fde-036d-4850-ae17-e1d8ed64660f',
        name: 'Запрос: Получить информацию обо всех клиентах в системе с их эндпоинтами, без инфы о том как они соединены',
        description: '-----',
        type: EventType.QUERY,
        requiredParameterUUIDs: [],
        optionalParameterUUIDs: ['67f6bbd6-e0f6-4427-aeb2-c12c4ac6d9ff'],
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
        optionalParameterUUIDs: ['67f6bbd6-e0f6-4427-aeb2-c12c4ac6d9ff'],
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
        optionalParameterUUIDs: ['67f6bbd6-e0f6-4427-aeb2-c12c4ac6d9ff'],
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
