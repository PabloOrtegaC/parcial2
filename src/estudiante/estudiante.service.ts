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

  async eliminarEstudiante(id: string): Promise<void> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id },
      relations: ['proyectos'],
    });

    if (!estudiante) {
      throw new BadRequestException('El estudiante no existe');
    }

    if (estudiante.proyectos && estudiante.proyectos.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar el estudiante porque tiene proyectos activos',
      );
    }

    await this.estudianteRepository.delete(id);
  }
}
