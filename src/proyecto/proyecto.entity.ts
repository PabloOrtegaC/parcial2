import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { ProfesorEntity } from '../profesor/profesor.entity';
import { EvaluacionEntity } from '../evaluacion/evaluacion.entity';

@Entity('proyecto')
export class ProyectoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column()
  area: string;

  @Column()
  presupuesto: number;

  @Column()
  notaFinal: number;

  @Column()
  estado: number;

  @Column()
  fechaInicio: string;

  @Column()
  fechaFin: string;

  @ManyToOne(() => EstudianteEntity, (estudiante) => estudiante.proyectos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  estudiante: EstudianteEntity;

  @ManyToOne(() => ProfesorEntity, (profesor) => profesor.proyectos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  profesor: ProfesorEntity;

  @OneToMany(() => EvaluacionEntity, (evaluacion) => evaluacion.proyecto)
  proyectos: EvaluacionEntity[];
}
