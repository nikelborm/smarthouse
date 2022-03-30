export class IUser {
  firstName: string;
  lastName: string;
  email: string;
  salt: string;
  passwordHash: string;
  id: number;
}

export class CreateManyUsersResponseDTO {
  response: {
    users: IUser[];
  };
}
