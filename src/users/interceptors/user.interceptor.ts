import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map } from 'rxjs';
import { UserDto } from '../dtos/user.dto';

export class UserInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>) {
        return next.handle().pipe(
            map((data: any) => {
                return plainToInstance(UserDto, data, {
                    excludeExtraneousValues: true
                });
            })
        );
    }
}
