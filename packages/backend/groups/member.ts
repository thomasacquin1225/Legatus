import { Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Member {
    constructor(id: string) {
        this.id = id
    }

    @PrimaryColumn()
    id: string;
}

