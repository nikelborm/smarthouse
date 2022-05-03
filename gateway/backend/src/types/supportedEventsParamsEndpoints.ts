export enum SupportedEventsParamsEndpoints {
  CREATE_ROUTE_SINK_ENDPOINT = '18ebc545-5c33-42da-b879-48adac946ef5',
  DELETE_ROUTE_SINK_ENDPOINT = '864eb22c-3c90-4f8f-b020-f0afeb7b9ba9',
  GET_ALL_ROUTES_SINK_ENDPOINT = '2def646b-e7e5-40e5-a94c-9253b942dce4',
  CREATE_CLIENT_SINK_ENDPOINT = '117fd2d0-5ffd-4715-893a-a6f87612888b',
  GET_CLIENT_INFO_SINK_ENDPOINT = 'f1d5f1d6-a899-4ec8-abdb-301ab145a1ac',
  GET_ALL_CLIENTS_INFO_SINK_ENDPOINT = '0e1789a3-1d6a-41d5-b0ad-cbbd8b640eac',
  DELETE_CLIENT_SINK_ENDPOINT = 'd6f90913-5cb5-4d87-a553-e691c4e75974',
  APPROVE_CLIENT_SINK_ENDPOINT = '71bdd03c-5f6b-4c4f-8d5e-dedf3461af2c',
  EDIT_CLIENT_SINK_ENDPOINT = '7a542147-97cc-4120-b864-015eb104f675',
  GET_ALL_EVENTS_WITH_PARAMETERS_INFO_SINK_ENDPOINT = '9a5ebe14-582c-4076-ac7c-d7b34ac61eba',
  EDIT_EVENT_SINK_ENDPOINT = '98696981-c41f-4a40-8c35-5619a24ba825',
  GET_ALL_PARAMETERS_INFO_SINK_ENDPOINT = '2d533727-0a5c-4807-acd8-af502516917e',
  EDIT_PARAMETER_SINK_ENDPOINT = '7af8cdd3-809f-46ba-b2fd-a23d0a10dc42',

  CREATE_ROUTE_EVENT = '',
  DELETE_ROUTE_EVENT = '',
  GET_ALL_ROUTES_EVENT = '',
  CREATE_CLIENT_EVENT = '',
  GET_CLIENT_INFO_EVENT = '',
  GET_ALL_CLIENTS_INFO_EVENT = '',

  DELETE_CLIENT_EVENT = '',
  APPROVE_CLIENT_EVENT = '',
  EDIT_CLIENT_EVENT = '',
  GET_ALL_EVENTS_WITH_PARAMETERS_INFO_EVENT = '',
  EDIT_EVENT_EVENT = '',
  GET_ALL_PARAMETERS_INFO_EVENT = '',
  EDIT_PARAMETER_EVENT = '',

  ENTITY_UUID_PARAMETER = '3ec4f1b4-8b65-4fe2-b777-d8df4ce03eac',
  ROUTE_OUTCOMING_ENDPOINT_ID_PARAMETER = '715622d1-7866-466e-9786-49c8ef2e93f9',
  ROUTE_INCOMING_ENDPOINT_ID_PARAMETER = '9ac7f810-eabc-43bc-a714-e6f48b736d7c',
  JSON_RESPONSE_PARAMETER = '67f6bbd6-e0f6-4427-aeb2-c12c4ac6d9ff',
}

// {
// {
//   uuid: '4377e209-22d6-4e46-8f62-6fbefdce65a9',
//   name: 'Запрос: Получить список маршрутов (откуда и куда идёт эндпоинт) с приджойнеными эндпоинтами',
//   description: '-----',
//   type: EventType.QUERY,
//   requiredParameterUUIDs: [],
//   optionalParameterUUIDs: [
//     '9ac7f810-eabc-43bc-a714-e6f48b736d7c',
//     '715622d1-7866-466e-9786-49c8ef2e93f9',
//     '67f6bbd6-e0f6-4427-aeb2-c12c4ac6d9ff',
//   ],
//   hexColor: '1abd23',
// },

// {
//   uuid: 'd3adeb40-d41f-459a-a3ad-b198967fd11d',
//   name: 'Команда: Создать клиент',
//   description: '-----',
//   type: EventType.COMMAND,
//   requiredParameterUUIDs: [], // сюда передавать хендшейк json, но прям сейчас мы это релиазовыввать не будем
//   optionalParameterUUIDs: [],
//   hexColor: '1abd23',
// },
// {
//   uuid: '99ee576d-c42f-464d-9682-83f62ba3721a',
//   name: 'Запрос: Получить информацию о клиенте',
//   description: '-----',
//   type: EventType.QUERY,
//   requiredParameterUUIDs: [
//     '3ec4f1b4-8b65-4fe2-b777-d8df4ce03eac',
//     '4491eaf5-9f95-489d-9493-5af8e75cbf76',
//   ],
//   optionalParameterUUIDs: ['67f6bbd6-e0f6-4427-aeb2-c12c4ac6d9ff'],
//   hexColor: '1abd23',
// },
// {
//   uuid: '552b5fde-036d-4850-ae17-e1d8ed64660f',
//   name: 'Запрос: Получить информацию обо всех клиентах в системе с их эндпоинтами, без инфы о том как они соединены',
//   description: '-----',
//   type: EventType.QUERY,
//   requiredParameterUUIDs: [],
//   optionalParameterUUIDs: ['67f6bbd6-e0f6-4427-aeb2-c12c4ac6d9ff'],
//   hexColor: '1abd23',
// },











// {
//   uuid: 'b773420f-3a57-426c-b7a3-0dec53667a37',
//   name: 'Команда: Удалить клиент',
//   description: '-----',
//   type: EventType.COMMAND,
//   requiredParameterUUIDs: ['3ec4f1b4-8b65-4fe2-b777-d8df4ce03eac'],
//   optionalParameterUUIDs: [],
//   hexColor: '1abd23',
// },
// {
//   uuid: '8fa5b0ac-400a-4b80-bc5a-f39d63611599',
//   name: 'Команда: Аппрувнуть клиента',
//   description: '-----',
//   type: EventType.COMMAND,
//   requiredParameterUUIDs: ['3ec4f1b4-8b65-4fe2-b777-d8df4ce03eac'],
//   optionalParameterUUIDs: [],
//   hexColor: '1abd23',
// },
// {
//   uuid: 'f4bfcb53-7e06-48fd-a019-1c3ca7dd3b8d',
//   name: 'Команда: Отредактировать клиента',
//   description: '-----',
//   type: EventType.COMMAND,
//   requiredParameterUUIDs: ['3ec4f1b4-8b65-4fe2-b777-d8df4ce03eac'],
//   optionalParameterUUIDs: [], // опциональные параметры на указание того какие поля изменились, но мы это делать не будем сейчас
//   hexColor: '1abd23',
// },

// {
//   uuid: 'a1df12b6-2403-4960-8d67-c851c2550caa',
//   name: 'Запрос: Получить список всех событий в системе с прикреплёнными к ним параметрами',
//   description: '-----',
//   type: EventType.QUERY,
//   requiredParameterUUIDs: [],
//   optionalParameterUUIDs: ['67f6bbd6-e0f6-4427-aeb2-c12c4ac6d9ff'],
//   hexColor: '1abd23',
// },
// {
//   uuid: 'fd424f4e-064a-4f45-8294-f1228a2da475',
//   name: 'Команда: Изменить событие',
//   description: '-----',
//   type: EventType.COMMAND,
//   requiredParameterUUIDs: ['3ec4f1b4-8b65-4fe2-b777-d8df4ce03eac'],
//   optionalParameterUUIDs: [], // опциональные параметры на указание того какие поля изменились, но мы это делать не будем сейчас
//   hexColor: '1abd23',
// },

// {
//   uuid: '635d41ab-c29b-4f38-8c77-d8b5c499c6d6',
//   name: 'Запрос: Получить список всех параметров событий в системе с прикреплёнными к ним событиями',
//   description: '-----',
//   type: EventType.QUERY,
//   requiredParameterUUIDs: [],
//   optionalParameterUUIDs: ['67f6bbd6-e0f6-4427-aeb2-c12c4ac6d9ff'],
//   hexColor: '1abd23',
// },
// {
//   uuid: '4815bb1a-fd44-402a-b9e3-6742b837c33e',
//   name: 'Команда: Изменить параметр события',
//   description: '-----',
//   type: EventType.COMMAND,
//   requiredParameterUUIDs: ['3ec4f1b4-8b65-4fe2-b777-d8df4ce03eac'],
//   optionalParameterUUIDs: [], // опциональные параметры на указание того какие поля изменились, но мы это делать не будем сейчас
//   hexColor: '1abd23',
// },
