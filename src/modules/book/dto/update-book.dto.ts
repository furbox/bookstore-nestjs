import { IsString } from 'class-validator';

export class UpdateBookDTO {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;
}
