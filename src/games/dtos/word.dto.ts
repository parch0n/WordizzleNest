import { IsString, MaxLength, MinLength } from 'class-validator';

export class WordDto {
    @IsString()
    @MinLength(3)
    @MaxLength(10)
    word: string;
}
