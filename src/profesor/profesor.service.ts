import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfesorEntity } from './profesor.entity';
import { Repository } from 'typeorm';
import { EvaluacionEntity } from '../evaluacion/evaluacion.entity';

@Injectable()
export class ProfesorService {
  constructor(
    @InjectRepository(ProfesorEntity)
    private readonly profesorRepository: Repository<ProfesorEntity>,
  ) {}

  @InjectRepository(EvaluacionEntity)
  private readonly evaluacionRepository: Repository<EvaluacionEntity>;

  async crearProfesor(profesor: ProfesorEntity): Promise<ProfesorEntity> {
    const extensionRegex = /^\d{5}$/;
    if (!extensionRegex.test(profesor.extension.toString())) {
      throw new BadRequestException(
        'La extensión debe tener exactamente 5 dígitos',
      );
    }

    return this.profesorRepository.save(profesor);
  }

  async asignarEvaluador(
    evaluacionId: string,
    profesorId: string,
  ): Promise<EvaluacionEntity> {
    const profesor = await this.profesorRepository.findOne({
      where: { id: profesorId },
      relations: ['evaluaciones'],
    });

    if (!profesor) {
      throw new BadRequestException(
        `El profesor con id ${profesorId} no existe`,
      );
    }

    if (profesor.evaluaciones.length >= 3) {
      throw new BadRequestException(
        'El profesor ya tiene 3 evaluaciones activas',
      );
    }

    const evaluacion = await this.evaluacionRepository.findOne({
      where: { id: evaluacionId },
      relations: ['profesor'],
    });

    if (!evaluacion) {
      throw new BadRequestException(
        `La evaluación con id ${evaluacionId} no existe`,
      );
    }

    evaluacion.profesor = profesor;

    return this.evaluacionRepository.save(evaluacion);
  }
}
