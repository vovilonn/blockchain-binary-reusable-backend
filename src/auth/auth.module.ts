import { Module } from "@nestjs/common";
import { UserDataProvider } from "./userDataProvider";
import { JwtStrategy } from "./jwt.strategy";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { EndpointSigStrategy } from "../strategy/endoint-signature.strategy";
import { JwtModule } from "@nestjs/jwt";
import { Web3SigStrategy } from "../strategy/web3-signature.strategy";
import { JwtRefreshStrategy } from "./jwt-refresh.strategy";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";

@Module({
    imports: [
        JwtModule,
        ConfigModule.forRoot({
            envFilePath: [".env.local", ".env"],
            validationSchema: Joi.object({
                SERVICE_ID: Joi.string().required(),
                JWT_SECRET: Joi.string().required(),
                JWT_REFRESH_SECRET: Joi.string().required(),
                USERS_URL: Joi.string().uri().required(),
            }),
        }),
    ],
    providers: [UserDataProvider, JwtStrategy, AuthService, EndpointSigStrategy, Web3SigStrategy, JwtRefreshStrategy],
    exports: [JwtStrategy, EndpointSigStrategy, Web3SigStrategy, JwtRefreshStrategy, UserDataProvider],
    controllers: [AuthController],
})
export class AuthModule {}
