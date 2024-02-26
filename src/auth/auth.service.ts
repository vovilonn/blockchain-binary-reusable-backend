import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { CommonCachePrefixes, CommonSignMessagePrefixes, SignMessageEndpointsConfig } from "../constants";
import { GetSignMessageEndpointDto } from "./dto/signEndpoint.dto";
import { v4 } from "uuid";
import { Cache, CachingConfig } from "cache-manager";

@Injectable()
export class AuthService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    public async getSignEndpointMessage({ method, path }: GetSignMessageEndpointDto, userId: number) {
        const cacheKey = `${CommonCachePrefixes.endpointMessageToSign}-${method}-${path}-${userId}`;
        const message = CommonSignMessagePrefixes.endpointMessageToSign + v4();
        const cacheConfing: CachingConfig<any> = {};
        for (const ttlOption of SignMessageEndpointsConfig) {
            if (ttlOption.path.includes(path) && method === ttlOption.method) {
                cacheConfing.ttl = ttlOption.ttl;
            }
        }
        await this.cacheManager.set(cacheKey, message, cacheConfing);
        return message;
    }
}
