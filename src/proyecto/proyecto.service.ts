import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProyectoEntity } from './proyecto.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProyectoService {
  constructor(
    @InjectRepository(ProyectoEntity)
    private readonly proyectoRepository: Repository<ProyectoEntity>,
  ) {}

  async crearProyecto(proyecto: ProyectoEntity): Promise<ProyectoEntity> {
    return this.proyectoRepository.save(proyecto);
  }

  async avanzarProyecto(id: number, proyecto: ProyectoEntity): Promise<ProyectoEntity> {
    await this.proyectoRepository.update(id, proyecto);
    const updatedProyecto = await this.proyectoRepository.findOne({
      where: { id: id.toString() },
    });
    if (!updatedProyecto) {
      throw new Error(`Proyecto with id ${id} not found`);
    }
    return updatedProyecto;
  }
}
