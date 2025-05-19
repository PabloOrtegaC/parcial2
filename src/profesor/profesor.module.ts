import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfesorEntity } from './profesor.entity';
import { EvaluacionEntity } from '../evaluacion/evaluacion.entity';
import { ProfesorService } from './profesor.service';
import { ProfesorController } from './profesor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProfesorEntity, EvaluacionEntity])],
  providers: [ProfesorService],
  controllers: [ProfesorController],
  exports: [ProfesorService],
})
export class ProfesorModule {}
