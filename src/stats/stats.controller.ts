import { Controller, Get, Param } from '@nestjs/common';
import { ObjectIdDto } from 'src/games/dtos/objectId.dto';
import { StatsService } from './stats.service';

@Controller('')
export class StatsController {
    constructor(private statsService: StatsService) {}
    @Get('/getStats/:id?')
    getStats(@Param() ObjId: ObjectIdDto) {
        return this.statsService.getStats(ObjId);
    }
}
