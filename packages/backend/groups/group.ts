import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { Member } from "./member";
import { Signal } from "./signal";

@Entity()
export class Group {
    constructor(treeDepth: number, members: Member[]) {
        this.treeDepth = treeDepth;
        this.members = members;
    }
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    treeDepth: number;

    @ManyToMany(() => Member, (member) => member.id)
    @JoinTable()
    members: Member[];

    @OneToMany(() => Signal, (signal) => signal.group)
    signals: Signal[];
}
