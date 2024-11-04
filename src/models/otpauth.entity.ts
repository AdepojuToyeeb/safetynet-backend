import { Entity, Column, CreateDateColumn } from "typeorm";
import { BaseModel } from "./BaseModel";

@Entity({ name: 'otp_auths' })
export class OtpAuth extends BaseModel {

  
    @Column({ length: 50})
    phoneNumber: string;
  
    @Column({ length: 10 })
    otp: string;
    
    @Column({default:false, name: 'is_verified'})
    isverified: boolean;
    

}