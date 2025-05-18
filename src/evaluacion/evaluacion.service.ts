import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvaluacionEntity } from './evaluacion.entity';
import { Repository } from 'typeorm';
import { ProyectoEntity } from '../proyecto/proyecto.entity';

@Injectable()
export class EvaluacionService {
  constructor(
    @InjectRepository(EvaluacionEntity)
    private readonly evaluacionRepository: Repository<EvaluacionEntity>,
  ) {}

  async crearEvaluacion(
    evaluacion: EvaluacionEntity,
  ): Promise<EvaluacionEntity> {
    const proyecto = await this.evaluacionRepository.manager.findOne(
      ProyectoEntity,
      {
        where: { id: evaluacion.proyecto.id },
        relations: ['profesor'],
      },
    );

    if (!proyecto) {
      throw new BadRequestException(
        `El proyecto con id ${evaluacion.proyecto.id} no existe`,
      );
    }

    if (proyecto.profesor.id === evaluacion.profesor.id) {
      throw new BadRequestException(
        'El profesor asignado al proyecto no puede ser el mismo que el profesor asignado para evaluar',
      );
    }

    return this.evaluacionRepository.save(evaluacion);
  }
}
