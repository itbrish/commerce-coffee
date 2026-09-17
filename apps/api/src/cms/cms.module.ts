import { Module } from '@nestjs/common';
import { CMSController } from './cms.controller';

@Module({
  controllers: [CMSController],
})
export class CMSModule {}
