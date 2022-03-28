import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { model, repo } from '../infrastructure';
import { UserAuthInfo, UserAuthTokenPayload } from './';
import { createHash, timingSafeEqual } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { messages } from 'src/config';

export type UserWithoutSensitiveData = Omit<
  model.User,
  'passwordHash' | 'salt'
>;

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepo: repo.UserRepo,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    userModel: model.User,
    password: string,
  ): Promise<UserWithoutSensitiveData> {
    if (!userModel)
      throw new UnauthorizedException(messages.auth.incorrectUser);

    const { passwordHash, salt, ...user } = userModel;

    const isPasswordCorrect = timingSafeEqual(
      Buffer.from(passwordHash, 'hex'),
      createHash('sha256')
        .update(salt)
        .update(password)
        .update(this.configService.get('userPasswordHashSalt'))
        .digest(),
    );

    if (!isPasswordCorrect)
      throw new UnauthorizedException(messages.auth.incorrectPassword);

    if (!userModel.accessScopes.length)
      throw new UnauthorizedException(messages.auth.userHasNoAccessScopes);

    return user;
  }

  getUserAuthTokenPayload(user: UserWithoutSensitiveData) {
    const payload: UserAuthTokenPayload = {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        // @ts-expect-error я специально спрятал эту штуку, чтобы не было соблазна положиться на неё в коде. Она чисто для фронта, для показа пунктов меню
        addionalRoles: [...new Set(user.accessScopes.map(({ type }) => type))],
      },
    };
    return payload;
  }

  async getAccessToken(user: UserWithoutSensitiveData) {
    const userFromDatabase = await this.userRepo.getOneByIdWithAccessScopes(
      user.id,
    );
    return this.jwtService.sign(this.getUserAuthTokenPayload(userFromDatabase));
  }

  async verify(authHeader: string) {
    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer')
      throw new UnauthorizedException(messages.auth.incorrectTokenType);
    if (!token) throw new UnauthorizedException(messages.auth.missingToken);

    try {
      this.jwtService.verify(token, {
        secret: this.configService.get('authSecret'),
        ignoreExpiration: false,
      });
    } catch (error) {
      throw new UnauthorizedException(messages.auth.invalidToken);
    }
    const { user } = this.jwtService.decode(token) as UserAuthTokenPayload;
    const userModel: UserAuthInfo =
      await this.userRepo.getOneByIdWithAccessScopes(user.id);

    return userModel;
  }
}
