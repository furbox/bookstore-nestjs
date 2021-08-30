import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBookDTO {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsNotEmpty()
  readonly authors: number[];
}
