import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { MethodType } from '../../constants';

export class GetSignMessageEndpointDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(MethodType)
  @ApiProperty({ enum: MethodType })
  method: MethodType;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({description: 'example: /user/grant-role'})
  path: string;
}
