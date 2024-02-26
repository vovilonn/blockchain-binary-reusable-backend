import {AuthGuard} from "@nestjs/passport";

export const JwtRefreshGuard = AuthGuard('jwt-refresh');
