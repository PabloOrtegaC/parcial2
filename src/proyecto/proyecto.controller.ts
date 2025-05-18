import { Controller, Post, Body, Param, Get, Put } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { ProyectoEntity } from './proyecto.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity';

@Controller('proyectos')
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService) {}

  @Post()
  async crearProyecto(
    @Body() proyecto: ProyectoEntity,
  ): Promise<ProyectoEntity> {
    return this.proyectoService.crearProyecto(proyecto);
  }

  @Put(':id')
  async avanzarProyecto(@Param('id') id: number): Promise<ProyectoEntity> {
    return this.proyectoService.avanzarProyecto(id);
  }

  @Get(':id/estudiantes')
  async findAllEstudiantes(
    @Param('id') id: string,
  ): Promise<EstudianteEntity[]> {
    return this.proyectoService.findAllEstudiantes(id);
  }
}
