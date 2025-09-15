import { StringUtils } from "@/libs/utils/StringUtils";
import { v4 as uuidv4 } from 'uuid';
import { Struct } from "./Struct";

export class StructSong {

    constructor(
        public readonly id: string = uuidv4(),
        public title: string = StringUtils.EMPTY,
        public description: string = StringUtils.EMPTY,
        public singer: string = StringUtils.EMPTY,
        public tom: string = StringUtils.EMPTY,
        public userId: string = StringUtils.EMPTY,
        public Struct: Struct[] = [],
        public isActive: boolean = true,
        public createdAt: string = new Date().toISOString(),
    ) { }

    static fromJson(json: any): StructSong {
        return new StructSong(
            json.id,
            json.title,
            json.description,
            json.singer,
            json.tom,
            json.userId,
            json.Struct,
            json.isActive,
            json.createdAt
        );
    }

    toJSON(): object {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            singer: this.singer,
            tom: this.tom,
            userId: this.userId,
            Struct: this.Struct,
            isActive: this.isActive,
            createdAt: this.createdAt,
        };
    }
}