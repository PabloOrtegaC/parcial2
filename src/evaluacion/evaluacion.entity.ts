import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ProyectoEntity } from '../proyecto/proyecto.entity';
@Entity('evaluacion')
export class EvaluacionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProyectoEntity, (evaluacion) => evaluacion.proyectos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  evaluaciones: ProyectoEntity;
}
