import { UserRole } from '@magnetmlm/common';
import { ApiProperty } from '@nestjs/swagger';

export class RoleDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty({ enum: UserRole })
  role: UserRole;
}
