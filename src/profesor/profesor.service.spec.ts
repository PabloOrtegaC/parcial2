import { Test, TestingModule } from '@nestjs/testing';
import { ProfesorService } from './profesor.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProfesorEntity } from './profesor.entity';
import { EvaluacionEntity } from '../evaluacion/evaluacion.entity';
import { ProyectoEntity } from '../proyecto/proyecto.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

describe('ProfesorService', () => {
  let service: ProfesorService;
  let profesorRepository: Repository<ProfesorEntity>;
  let evaluacionRepository: Repository<EvaluacionEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfesorService,
        {
          provide: getRepositoryToken(ProfesorEntity),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(EvaluacionEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProfesorService>(ProfesorService);
    profesorRepository = module.get<Repository<ProfesorEntity>>(
      getRepositoryToken(ProfesorEntity),
    );
    evaluacionRepository = module.get<Repository<EvaluacionEntity>>(
      getRepositoryToken(EvaluacionEntity),
    );
  });

  describe('crearProfesor', () => {
    it('crear el profesor correctamente', async () => {
      const profesor = {
        cedula: 123456789,
        nombre: 'Dr. Smith',
        departamento: 'Computer Science',
        extension: 12345,
        esParEvaluador: true,
      } as ProfesorEntity;

      jest.spyOn(profesorRepository, 'save').mockResolvedValue(profesor);

      const result = await service.crearProfesor(profesor);
      expect(result).toEqual(profesor);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(profesorRepository.save).toHaveBeenCalledWith(profesor);
    });

    it('deberia arrojar error si la extension es invalida', async () => {
      const profesor = {
        cedula: 123456789,
        nombre: 'Dr. Smith',
        departamento: 'Computer Science',
        extension: 1234, // Invalido
        esParEvaluador: true,
      } as ProfesorEntity;

      await expect(service.crearProfesor(profesor)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('asignarEvaluador', () => {
    it('debería asignar un evaluador exitosamente', async () => {
      const profesor = {
        id: 'prof1',
        evaluaciones: [],
        proyectos: [],
        cedula: 123456789,
        nombre: 'Dr. Smith',
        departamento: 'Computer Science',
        extension: 12345,
        esParEvaluador: true,
      } as ProfesorEntity;

      const proyecto = {
        id: 'proj1',
      } as ProyectoEntity;

      const evaluacion = {
        id: 'eval1',
        profesor: null as ProfesorEntity | null,
        proyecto,
      } as EvaluacionEntity;

      jest.spyOn(profesorRepository, 'findOne').mockResolvedValue(profesor);
      jest.spyOn(evaluacionRepository, 'findOne').mockResolvedValue(evaluacion);
      jest.spyOn(evaluacionRepository, 'save').mockResolvedValue({
        ...evaluacion,
        profesor,
      });

      const result = await service.asignarEvaluador('eval1', 'prof1');
      expect(result.profesor).toEqual(profesor);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(evaluacionRepository.save).toHaveBeenCalledWith({
        ...evaluacion,
        profesor,
      });
    });

    it('debería arrojar un error si el profesor tiene 3 evaluaciones activas', async () => {
      const profesor = {
        id: 'prof1',
        evaluaciones: [{}, {}, {}], // 3 activas
      } as ProfesorEntity;

      jest.spyOn(profesorRepository, 'findOne').mockResolvedValue(profesor);

      await expect(service.asignarEvaluador('eval1', 'prof1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
