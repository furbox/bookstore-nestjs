import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsString, MaxLength } from 'class-validator';

@Exclude()
export class ReadRoleDTO {
  @Expose()
  @IsNumber()
  readonly id: number;

  @Expose()
  @IsString()
  @MaxLength(50, { message: 'this name is no valid' })
  readonly name: string;

  @Expose()
  @IsString()
  @MaxLength(100, { message: 'this description is no valid' })
  readonly description: string;
}
