import { Column, Entity, ManyToOne, } from "typeorm"
import { BaseModel } from "./BaseModel";
import { Users } from "./users.entity";

@Entity({name:  'emergency_contacts'})
export class EmergencyContacts extends BaseModel{
    @Column({length: 50})
    phoneNumber: string;

    @ManyToOne(() => Users, (user) => user.emergencyContacts)
    user: Users;



    

}