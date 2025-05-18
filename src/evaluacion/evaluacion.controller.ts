import { Controller, Post, Body } from '@nestjs/common';
import { EvaluacionService } from './evaluacion.service';
import { EvaluacionEntity } from './evaluacion.entity';

@Controller('evaluaciones')
export class EvaluacionController {
  constructor(private readonly evaluacionService: EvaluacionService) {}

  @Post()
  async crearEvaluacion(
    @Body() evaluacion: EvaluacionEntity,
  ): Promise<EvaluacionEntity> {
    return this.evaluacionService.crearEvaluacion(evaluacion);
  }
}
