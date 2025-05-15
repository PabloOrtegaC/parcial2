import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfesorEntity } from './profesor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfesorService {
  constructor(
    @InjectRepository(ProfesorEntity)
    private readonly profesorRepository: Repository<ProfesorEntity>,
  ) {}

  async crearProfesor(profesor: ProfesorEntity): Promise<ProfesorEntity> {
    return this.profesorRepository.save(profesor);
  }

  async asignarEvaluador(id: number, profesor: ProfesorEntity): Promise<ProfesorEntity> {
    await this.profesorRepository.update(id, profesor);
    const updatedProfesor = await this.profesorRepository.findOne({
      where: { id: id.toString() },
    });
    if (!updatedProfesor) {
      throw new Error(`Profesor with id ${id} not found`);
    }
    return updatedProfesor;
  }
}
