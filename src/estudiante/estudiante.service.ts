import { Injectable } from '@nestjs/common';
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

  async crearEstudiante(estudiante: EstudianteEntity): Promise<EstudianteEntity> {
    return this.estudianteRepository.save(estudiante);
  }

  async eliminarEstudiante(id: number): Promise<void> {
    await this.estudianteRepository.delete(id);
  }
}
