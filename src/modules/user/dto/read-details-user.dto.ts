import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class ReadDetailsUserDTO {
  @Expose()
  @IsString()
  readonly name: string;

  @Expose()
  @IsString()
  readonly lastname: string;
}
