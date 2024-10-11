import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseModel } from './BaseModel';

@Entity()
export class Users extends BaseModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true})
    email: string;

    @Column()
    password: string;

    @Column({default: true})
    isActive: boolean;


}