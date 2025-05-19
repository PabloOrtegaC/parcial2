import { Test, TestingModule } from '@nestjs/testing';
import { EstudianteService } from './estudiante.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EstudianteEntity } from './estudiante.entity';
import { Repository, DeleteResult } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

describe('EstudianteService', () => {
  let service: EstudianteService;
  let repository: Repository<EstudianteEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstudianteService,
        {
          provide: getRepositoryToken(EstudianteEntity),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EstudianteService>(EstudianteService);
    repository = module.get<Repository<EstudianteEntity>>(
      getRepositoryToken(EstudianteEntity),
    );
  });

  describe('crearEstudiante', () => {
    it('debería crear un estudiante exitosamente', async () => {
      const estudiante = {
        cedula: 123456789,
        nombre: 'Juan Pérez',
        semestre: 5,
        programa: 'Ingeniería de Sistemas',
        promedio: 4.5,
      } as EstudianteEntity;

      jest.spyOn(repository, 'save').mockResolvedValue(estudiante);
      const result = await service.crearEstudiante(estudiante);
      expect(result).toEqual(estudiante);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.save).toHaveBeenCalledWith(estudiante);
    });

    it('debería lanzar un error si el promedio es menor o igual a 3.2', async () => {
      const estudiante = {
        cedula: 123456789,
        nombre: 'Juan Pérez',
        semestre: 5,
        programa: 'Ingeniería de Sistemas',
        promedio: 3.0, // Invalid promedio
      } as EstudianteEntity;

      await expect(service.crearEstudiante(estudiante)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('eliminarEstudiante', () => {
    it('debería eliminar un estudiante exitosamente', async () => {
      const estudiante = {
        id: '1',
        proyectos: [],
        cedula: 123456789,
        nombre: 'Default Name',
        semestre: 1,
        programa: 'Default Program',
        promedio: 3.5,
      } as EstudianteEntity;

      jest.spyOn(repository, 'findOne').mockResolvedValue(estudiante);
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 1 } as DeleteResult);

      await service.eliminarEstudiante('1');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['proyectos'],
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.delete).toHaveBeenCalledWith('1');
    });

    it('debería lanzar un error si el estudiante tiene proyectos activos', async () => {
      const estudiante = {
        id: '1',
        proyectos: [{ id: 'project1' }],
      } as EstudianteEntity;

      jest.spyOn(repository, 'findOne').mockResolvedValue(estudiante);

      await expect(service.eliminarEstudiante('1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
