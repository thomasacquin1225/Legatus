import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { Member } from "./member";

@Entity()
export class Group {
    constructor(treeDepth: number, members: Member[]) {
        this.treeDepth = treeDepth
        this.members = members
    }
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    treeDepth: number

    @ManyToMany(() => Member, (member) => member.id)
    @JoinTable()
    members: Member[]
}
