import { Test, TestingModule } from '@nestjs/testing';
import { EvaluacionService } from './evaluacion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EvaluacionEntity } from './evaluacion.entity';
import { Repository } from 'typeorm';
import { ProyectoEntity } from '../proyecto/proyecto.entity';
import { BadRequestException } from '@nestjs/common';

describe('EvaluacionService', () => {
  let service: EvaluacionService;
  let repository: Repository<EvaluacionEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EvaluacionService,
        {
          provide: getRepositoryToken(EvaluacionEntity),
          useValue: {
            save: jest.fn(),
            manager: {
              findOne: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<EvaluacionService>(EvaluacionService);
    repository = module.get<Repository<EvaluacionEntity>>(
      getRepositoryToken(EvaluacionEntity),
    );
  });

  describe('crearEvaluacion', () => {
    it('debería crear una evaluación exitosamente', async () => {
      const evaluacion = {
        proyecto: { id: '1' },
        profesor: { id: '2' },
      } as EvaluacionEntity;

      const proyecto = {
        id: '1',
        profesor: { id: '3' },
      } as ProyectoEntity;

      jest.spyOn(repository.manager, 'findOne').mockResolvedValue(proyecto);
      jest.spyOn(repository, 'save').mockResolvedValue(evaluacion);

      const result = await service.crearEvaluacion(evaluacion);
      expect(result).toEqual(evaluacion);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.manager.findOne).toHaveBeenCalledWith(ProyectoEntity, {
        where: { id: evaluacion.proyecto.id },
        relations: ['profesor'],
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.save).toHaveBeenCalledWith(evaluacion);
    });

    it('debería lanzar un error si el proyecto no existe', async () => {
      const evaluacion = {
        proyecto: { id: '1' },
        profesor: { id: '2' },
      } as EvaluacionEntity;

      jest.spyOn(repository.manager, 'findOne').mockResolvedValue(null);

      await expect(service.crearEvaluacion(evaluacion)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('debería lanzar un error si el profesor del proyecto es el mismo que el profesor de la evaluación', async () => {
      const evaluacion = {
        proyecto: { id: '1' },
        profesor: { id: '2' },
      } as EvaluacionEntity;

      const proyecto = {
        id: '1',
        profesor: { id: '2' },
      } as ProyectoEntity;

      jest.spyOn(repository.manager, 'findOne').mockResolvedValue(proyecto);

      await expect(service.crearEvaluacion(evaluacion)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
