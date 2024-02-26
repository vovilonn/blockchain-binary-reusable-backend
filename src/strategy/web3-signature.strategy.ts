import { PassportStrategy } from '@nestjs/passport';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { MetamaskLogin } from 'metamask-node-auth';
import { CommonAuthStrategies, CommonCachePrefixes } from '../constants';

@Injectable()
export class Web3SigStrategy extends PassportStrategy(
  Strategy,
  CommonAuthStrategies.byWeb3Signature,
) {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    super();
  }
  async validate(req: Request): Promise<boolean> {
    const address = req.body.address;
    const signature = req.body.signature;
    if (!address || !signature) {
      return false;
    }
    const cacheKey = CommonCachePrefixes.authMessageToSign + address;
    const message: string = await this.cacheManager.get(cacheKey);
    if (!message) return false;
    await this.cacheManager.del(cacheKey);
    return MetamaskLogin.verifySignature(message, address, signature);
  }
}
