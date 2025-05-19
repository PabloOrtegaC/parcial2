import { Test, TestingModule } from '@nestjs/testing';
import { ProyectoService } from './proyecto.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProyectoEntity } from './proyecto.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

describe('ProyectoService', () => {
  let service: ProyectoService;
  let repository: Repository<ProyectoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProyectoService,
        {
          provide: getRepositoryToken(ProyectoEntity),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProyectoService>(ProyectoService);
    repository = module.get<Repository<ProyectoEntity>>(
      getRepositoryToken(ProyectoEntity),
    );
  });

  describe('crearProyecto', () => {
    it('debería crear un proyecto exitosamente', async () => {
      const proyecto = {
        titulo: 'Proyecto de Investigación',
        presupuesto: 10000,
        estado: 1,
      } as ProyectoEntity;

      jest.spyOn(repository, 'save').mockResolvedValue(proyecto);

      const result = await service.crearProyecto(proyecto);
      expect(result).toEqual(proyecto);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.save).toHaveBeenCalledWith(proyecto);
    });

    it('debería lanzar un error si el presupuesto es menor o igual a 0', async () => {
      const proyecto = {
        titulo: 'Proyecto de Investigación',
        presupuesto: 0, // Presupuesto inválido
        estado: 1,
      } as ProyectoEntity;

      await expect(service.crearProyecto(proyecto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('debería lanzar un error si el título tiene 15 caracteres o menos', async () => {
      const proyecto = {
        titulo: 'Proyecto', // Título inválido
        presupuesto: 10000,
        estado: 1,
      } as ProyectoEntity;

      await expect(service.crearProyecto(proyecto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('avanzarProyecto', () => {
    it('debería avanzar exitosamente el estado del proyecto', async () => {
      const proyecto = {
        id: '1',
        estado: 2,
      } as ProyectoEntity;

      jest.spyOn(repository, 'findOne').mockResolvedValue(proyecto);
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue({ ...proyecto, estado: 3 });

      const result = await service.avanzarProyecto(1);
      expect(result.estado).toBe(3);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.save).toHaveBeenCalledWith({ ...proyecto, estado: 3 });
    });

    it('should throw an error if the project does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.avanzarProyecto(1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('debería lanzar un error si el proyecto ya está completado', async () => {
      const proyecto = {
        id: '1',
        estado: 4,
      } as ProyectoEntity;

      jest.spyOn(repository, 'findOne').mockResolvedValue(proyecto);

      await expect(service.avanzarProyecto(1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAllEstudiantes', () => {
    it('debería devolver todos los estudiantes asociados con un proyecto', async () => {
      const estudiante = { id: '1', nombre: 'Juan Pérez' };
      const proyecto = {
        id: '1',
        estudiante,
      } as ProyectoEntity;

      jest.spyOn(repository, 'findOne').mockResolvedValue(proyecto);

      const result = await service.findAllEstudiantes('1');
      expect(result).toEqual([estudiante]);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['estudiante'],
      });
    });

    it('debería lanzar un error si el proyecto no existe', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findAllEstudiantes('1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
