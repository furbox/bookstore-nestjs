import { IsString, MaxLength } from 'class-validator';

export class UpdateRoleDTO {
  @IsString()
  @MaxLength(50, { message: 'this name is no valid' })
  readonly name: string;

  @IsString()
  @MaxLength(100, { message: 'this description is no valid' })
  readonly description: string;
}
