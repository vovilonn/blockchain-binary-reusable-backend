import { Controller, Get, HttpCode, HttpStatus, Query, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { RolesGuard } from "../roles.guard";
import { Reflector } from "@nestjs/core";
import { GetSignMessageEndpointDto } from "./dto/signEndpoint.dto";
import { JwtPayloadDto } from "./dto/jwtPayload.dto";
import { AuthService } from "./auth.service";

@Controller('sign')
@ApiTags('Sign')
@UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
@ApiBearerAuth()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/endpoint-message')
  @ApiOperation({ summary: 'Get message to sign for some endpoint' })
  @ApiOkResponse({ type: String, description: 'Message to sign' })
  async getSignEndpointMessage(
    @Query() query: GetSignMessageEndpointDto,
    @Request() req: { user: JwtPayloadDto },
  ): Promise<string> {
    return this.authService.getSignEndpointMessage(query, req.user.id);
  }
}
