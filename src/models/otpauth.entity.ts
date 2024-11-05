import { Entity, Column, CreateDateColumn } from "typeorm";
import { BaseModel } from "./BaseModel";
import { CHANNEL } from "src/constants";

@Entity({ name: 'otp_auths' })
export class OtpAuth extends BaseModel {
    @Column({ length: 50 })
    recipient: string;

    @Column({ length: 10 })
    otp: string;

    @Column({ default: false, name: 'is_verified' })
    isverified: boolean;

    @Column({ type: 'enum', enum: Object.values(CHANNEL) })
    channel: CHANNEL
}