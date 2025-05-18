import { Controller, Post, Body, Param, Put } from '@nestjs/common';
import { ProfesorService } from './profesor.service';
import { ProfesorEntity } from './profesor.entity';
import { EvaluacionEntity } from '../evaluacion/evaluacion.entity';

@Controller('profesores')
export class ProfesorController {
  constructor(private readonly profesorService: ProfesorService) {}

  @Post()
  async crearProfesor(
    @Body() profesor: ProfesorEntity,
  ): Promise<ProfesorEntity> {
    return this.profesorService.crearProfesor(profesor);
  }

  @Put(':profesorId/evaluaciones/:evaluacionId')
  async asignarEvaluador(
    @Param('profesorId') profesorId: string,
    @Param('evaluacionId') evaluacionId: string,
  ): Promise<EvaluacionEntity> {
    return this.profesorService.asignarEvaluador(evaluacionId, profesorId);
  }
}
