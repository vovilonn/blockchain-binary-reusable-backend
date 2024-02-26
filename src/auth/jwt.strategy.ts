import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserDataProvider } from "./userDataProvider";
import { JwtPayloadDto } from "./dto/jwtPayload.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(private userDataProvider: UserDataProvider) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: JwtPayloadDto & { serviceId: number }): Promise<JwtPayloadDto> {
        if (payload.serviceId) {
            return payload;
        }
        if (!payload.id) return;
        const user = await this.userDataProvider.getUser(payload.id);
        if (!user) {
            throw new UnauthorizedException(null, `User with id ${payload.id} not found`);
        }
        return user;
    }
}
