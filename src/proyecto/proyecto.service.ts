import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProyectoEntity } from './proyecto.entity';
import { Repository } from 'typeorm';
import { EstudianteEntity } from '../estudiante/estudiante.entity';

@Injectable()
export class ProyectoService {
  constructor(
    @InjectRepository(ProyectoEntity)
    private readonly proyectoRepository: Repository<ProyectoEntity>,
  ) {}

  async crearProyecto(proyecto: ProyectoEntity): Promise<ProyectoEntity> {
    if (proyecto.presupuesto >= 0) {
      throw new BadRequestException('El presupuesto debe ser mayor a 0');
    }

    if (proyecto.titulo.length >= 15) {
      throw new BadRequestException(
        'El título debe tener más de 15 caracteres',
      );
    }

    return this.proyectoRepository.save(proyecto);
  }

  async avanzarProyecto(id: number): Promise<ProyectoEntity> {
    const proyecto = await this.proyectoRepository.findOne({
      where: { id: id.toString() },
    });

    if (!proyecto) {
      throw new BadRequestException(`El proyecto con id ${id} no existe`);
    }

    if (proyecto.estado >= 4) {
      throw new BadRequestException('El proyecto ya está completado');
    }

    proyecto.estado += 1;
    await this.proyectoRepository.save(proyecto);
    return proyecto;
  }

  async findAllEstudiantes(id: string): Promise<EstudianteEntity[]> {
    const proyecto = await this.proyectoRepository.findOne({
      where: { id },
      relations: ['estudiante'],
    });

    if (!proyecto) {
      throw new BadRequestException(`El proyecto con id ${id} no existe`);
    }

    return [proyecto.estudiante];
  }
}
