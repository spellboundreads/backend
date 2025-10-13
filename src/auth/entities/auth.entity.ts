import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';

export class AuthEntity {
  @ApiProperty()
  accessToken: string;
}
