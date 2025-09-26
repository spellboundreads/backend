import { Expose } from 'class-transformer';

export class PublicUserDto {
  @Expose()
  username: string;

  @Expose()
  display_name: string;

  @Expose()
  bio?: string;

  @Expose()
  avatar_url?: string;

  @Expose()
  date_of_birth?: string;
}
