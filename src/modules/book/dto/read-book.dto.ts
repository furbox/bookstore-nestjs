import { Exclude, Expose, Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { ReadUserDTO } from '../../user/dto/read-user.dto';

@Exclude()
export class ReadBookDTO {
  @Expose()
  @IsNumber()
  readonly id: number;

  @Expose()
  @IsString()
  readonly name: string;

  @Expose()
  @IsString()
  readonly description: string;

  @Expose()
  @Type((type) => ReadUserDTO)
  readonly authors: ReadBookDTO[];
}
