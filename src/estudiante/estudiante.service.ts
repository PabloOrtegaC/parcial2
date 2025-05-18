import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EstudianteEntity } from './estudiante.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(EstudianteEntity)
    private readonly estudianteRepository: Repository<EstudianteEntity>,
  ) {}

  async findAllEstudiantes(): Promise<EstudianteEntity[]> {
    return this.estudianteRepository.find();
  }

  async crearEstudiante(
    estudiante: EstudianteEntity,
  ): Promise<EstudianteEntity> {
    if (estudiante.promedio <= 3.2) {
      throw new BadRequestException('El promedio debe ser mayor a 3.2');
    }

    if (estudiante.semestre < 4) {
      throw new BadRequestException('El semestre debe ser mayor o igual a 4');
    }

    return this.estudianteRepository.save(estudiante);
  }

  async eliminarEstudiante(id: number): Promise<void> {
    await this.estudianteRepository.delete(id);
  }
}
