import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { BaseModel } from './BaseModel';
import * as bcrypt from 'bcrypt';

@Entity()
export class Users extends BaseModel {


    @Column({nullable:false, name:'first_name'})
    firstName:string

    @Column({nullable:false, name:'last_name'})
    lastName:string

    @Column({unique:true})
    email: string;

    @Column({nullable: false,length: 60, name:'password'})
    password: string;
    
    @Column({unique:true, name:'phone_number'})
    phoneNumber:string


    @BeforeInsert()
    async hashpassword(){
        const rounds = 10;
        this.password = await bcrypt.hash(this.password, rounds)
    }


    static async comparePassword(attemptedPassword:string, hashedPassword: string){
        return await bcrypt.compare(attemptedPassword, hashedPassword)
    }
}


