import { Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { EstudianteEntity } from './estudiante.entity';

@Controller('estudiantes')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Post()
  async crearEstudiante(
    @Body() estudiante: EstudianteEntity,
  ): Promise<EstudianteEntity> {
    return this.estudianteService.crearEstudiante(estudiante);
  }

  @Delete(':id')
  async eliminarEstudiante(@Param('id') id: string): Promise<void> {
    return this.estudianteService.eliminarEstudiante(id);
  }
}
