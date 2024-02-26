import { UserRole } from "@magnetmlm/common";
import { BadRequestException, Inject, Injectable, Optional, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import axios from "axios";

@Injectable()
export class UserDataProvider {
    constructor(
        private jwtService: JwtService,
        @Optional()
        @Inject("UserService")
        private userService?: any
    ) {}

    async getUser(id: number) {
        if (this.userService) {
            try {
                const user = await this.userService.getUser(id);
                return user;
            } catch (err) {
                throw new UnauthorizedException("Unauthorized");
            }
        } else {
            try {
                const token = this.getServiceToken();
                const { data } = await axios.get(`${process.env.USERS_URL}/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                return data;
            } catch (error) {
                throw new UnauthorizedException(null, error.message);
            }
        }
    }

    async getUserByAddress(address: string) {
        if (this.userService) {
            try {
                const user = await this.userService.getUserByAddress(address);
                return user;
            } catch (err) {
                throw new UnauthorizedException("Unauthorized");
            }
        } else {
            try {
                const token = this.getServiceToken();
                const { data } = await axios.get(`${process.env.USERS_URL}/by-address/${address}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                return data;
            } catch (error) {
                throw new UnauthorizedException(null, error.message);
            }
        }
    }

    public getServiceToken() {
        const serviceId = process.env.SERVICE_ID;
        const jwtSecret = process.env.JWT_SECRET;
        return this.jwtService.sign({ serviceId, roles: [{ role: UserRole.Service }] }, { secret: jwtSecret });
    }
}
