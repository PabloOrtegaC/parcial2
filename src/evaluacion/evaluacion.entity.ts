import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ProyectoEntity } from '../proyecto/proyecto.entity';
import { ProfesorEntity } from '../profesor/profesor.entity';

@Entity('evaluacion')
export class EvaluacionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProyectoEntity, (proyecto) => proyecto.proyectos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  proyecto: ProyectoEntity;

  @ManyToOne(() => ProfesorEntity, (profesor) => profesor.evaluaciones, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  profesor: ProfesorEntity; // New relation
}
