import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProyectoEntity } from '../proyecto/proyecto.entity';
import { EvaluacionEntity } from '../evaluacion/evaluacion.entity';

@Entity('profesor')
export class ProfesorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cedula: number;

  @Column()
  nombre: string;

  @Column()
  departamento: string;

  @Column()
  extension: number;

  @Column()
  esParEvaluador: boolean;

  @OneToMany(() => ProyectoEntity, (proyecto) => proyecto.profesor)
  proyectos: ProyectoEntity[];

  @OneToMany(() => EvaluacionEntity, (evaluacion) => evaluacion.profesor)
  evaluaciones: EvaluacionEntity[];
}
