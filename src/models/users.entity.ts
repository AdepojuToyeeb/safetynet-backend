import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { BaseModel } from './BaseModel';
import * as bcrypt from 'bcrypt';

@Entity()
export class Users extends BaseModel {
    @Column({unique:true})
    email: string;

    @Column({nullable:true, name:'first_name'})
    firstName:string

    @Column({nullable:true, name:'last_name'})
    lastName:string

    @Column({nullable:true, name:'phone_number'})
    phoneNumber:string

    @Column()
    password: string;

    @Column({default: true})
    isActive: boolean;

    @BeforeInsert()
    async hashPassword(){
        const rounds = 10;
        this.password = await bcrypt.hash(this.password, rounds)
    }

    static async comparePassword(attemptedPassword:string, hashedPassword: string){
        return await bcrypt.compare(attemptedPassword, hashedPassword)
    }
}