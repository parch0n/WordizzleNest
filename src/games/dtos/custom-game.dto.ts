import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CustomGameDto {
    @IsNumber()
    @Min(3)
    @Max(10)
    length: number;

    @IsNumber()
    @Min(3)
    @Max(10)
    guesses: number;

    @IsString()
    lang: string;
}
