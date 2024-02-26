import { PassportStrategy } from '@nestjs/passport';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { MetamaskLogin } from 'metamask-node-auth';
import { JwtPayloadDto } from '../auth/dto/jwtPayload.dto';
import { CommonAuthStrategies, CommonCachePrefixes } from '../constants';

@Injectable()
export class EndpointSigStrategy extends PassportStrategy(
  Strategy,
  CommonAuthStrategies.endpointSignature,
) {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    super();
  }
  async validate(req: Request & { user: JwtPayloadDto }) {
    const signature = req.headers.signature as string;
    const endpointPath = req.originalUrl;
    const method = req.method;
    const cacheKey = `${CommonCachePrefixes.endpointMessageToSign}-${method}-${endpointPath}-${req?.user?.id}`;

    const address = req.user.addr;

    if (!address || !signature) {
      return false;
    }
    const message: string = await this.cacheManager.get(cacheKey);
    if (!message) return false;
    await this.cacheManager.del(cacheKey);
    return MetamaskLogin.verifySignature(message, address, signature);
  }
}
