import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EstudianteModule } from './estudiante/estudiante.module';
import { ProyectoModule } from './proyecto/proyecto.module';
import { ProfesorModule } from './profesor/profesor.module';
import { EvaluacionModule } from './evaluacion/evaluacion.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteEntity } from './estudiante/estudiante.entity';
import { ProyectoEntity } from './proyecto/proyecto.entity';
import { EvaluacionEntity } from './evaluacion/evaluacion.entity';

@Module({
  imports: [
    EstudianteModule,
    ProyectoModule,
    ProfesorModule,
    EvaluacionModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [
        EstudianteEntity,
        ProyectoEntity,
        EvaluacionEntity,
        ProyectoEntity,
      ],
      dropSchema: false,
      synchronize: true,
      logging: true,
      autoLoadEntities: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
