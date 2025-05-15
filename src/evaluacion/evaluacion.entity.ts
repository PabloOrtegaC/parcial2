import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ProyectoEntity } from '../proyecto/proyecto.entity';

@Entity('evaluacion')
export class EvaluacionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProyectoEntity, (proyecto) => proyecto.proyectos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  proyecto: ProyectoEntity;
}
