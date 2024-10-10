import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../models/users.entity';
import { join } from 'path';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PW,
    database: process.env.POSTGRES_DB,
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
    autoLoadEntities: true,
    migrationsRun: true,
    logging: true,
    entities: [join(__dirname, './../models/**.{.ts,.js}')],
    migrations: [join(__dirname, './../migrations/{.ts,*.js}')],
  })
    ,UsersModule,
    AuthModule],
  controllers: [AppController],
  providers: [AppService],

  

  
})
export class AppModule {}
