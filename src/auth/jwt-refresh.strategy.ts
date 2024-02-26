import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UserDataProvider } from "./userDataProvider";
import { JwtPayloadDto } from "./dto";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor(private userDataProvider: UserDataProvider) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_REFRESH_SECRET,
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
