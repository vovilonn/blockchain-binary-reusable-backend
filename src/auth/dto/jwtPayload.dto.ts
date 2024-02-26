import { ApiProperty } from '@nestjs/swagger';
import { RoleDto } from './role.dto';

export class JwtPayloadDto  {
  @ApiProperty()
  id: number;

  @ApiProperty()
  uid: number;

  @ApiProperty({ isArray: true })
  roles: RoleDto[];

  @ApiProperty()
  addr: string;
}
