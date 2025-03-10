import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany } from 'typeorm';
import { BaseModel } from './BaseModel';
import * as bcrypt from 'bcrypt';
import { EmergencyContacts } from './emergencycontact.entity';


@Entity()
export class Users extends BaseModel {
    @Column({nullable:true, name:'full_name'})
    fullName:string

    @Column({nullable:true})
    email: string;

    @Column({nullable: false,length: 60, name:'password'})
    password: string;
    
    @Column({nullable:true, name:'phone_number'})
    phoneNumber:string

   @OneToMany(() => EmergencyContacts, (emergencyContact) => emergencyContact.user)
   emergencyContacts: EmergencyContacts[];


    @BeforeInsert()
    async hashpassword(){
        const rounds = 10;
        this.password = await bcrypt.hash(this.password, rounds)
    }


    static async comparePassword(attemptedPassword:string, hashedPassword: string){
        return await bcrypt.compare(attemptedPassword, hashedPassword)
    }
}


