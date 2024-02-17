import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./member";
import { Group } from "./group";

@Entity()
export class Signal {
    @PrimaryGeneratedColumn()
    id: string;

    @ManyToOne(() => Group, (group) => group.signals)
    group: Group;

    @ManyToOne(() => Member, (member) => member.id)
    member: Member;

    @Column()
    signalMsg: string;

    @Column()
    proof: string;
}


