import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";
import { EventsService } from "./events.service";
import * as redisStore from "cache-manager-redis-store";
import type { RedisClientOptions } from "redis";
import * as Joi from "joi";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [".env.local", ".env"],
            validationSchema: Joi.object({
                REDIS_HOST: Joi.string().required(),
                REDIS_PORT: Joi.string().required(),
                REDIS_USERNAME: Joi.string().required(),
                REDIS_PASSWORD: Joi.string().required(),
            }),
        }),
        CacheModule.register<RedisClientOptions>({
            store: redisStore,
            url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
            ttl: 0,
        }),
    ],
    providers: [EventsService],
    exports: [EventsService],
})
export class EventsModule {}
