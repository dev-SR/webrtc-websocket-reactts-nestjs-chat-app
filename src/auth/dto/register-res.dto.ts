import { Exclude, Expose } from 'class-transformer';

export class RegisterResponseDto {
  @Expose()
  email: string;

  @Expose()
  name: string;

  @Exclude()
  password: string;
}
