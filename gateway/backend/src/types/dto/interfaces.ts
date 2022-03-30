export class GetRoutesGraphQuery {
  clients: {
    id: number;
    uuid: string;
    shortname: string;
    fullname: string;
    description: string;
  }[];
}

export class GetRoutesGraphResponse {}
