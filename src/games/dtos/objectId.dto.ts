import { IsMongoId, IsOptional } from 'class-validator';

export class ObjectIdDto {
    @IsMongoId()
    @IsOptional()
    id?: string;
}
