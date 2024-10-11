import { Exclude } from "class-transformer";
import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseModel {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at'})
    @Exclude({ toPlainOnly: true })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at'})
    @Exclude({ toPlainOnly: true })
    deletedAt: Date;
}