import { StringUtils } from "@/libs/utils/StringUtils";
import { v4 as uuidv4 } from 'uuid';
import { Struct } from "./Struct";

export class StructChords {

    constructor(
        public readonly id: string = uuidv4(),
        public title: string = StringUtils.EMPTY,
        public description: string = StringUtils.EMPTY,
        public singer: string = StringUtils.EMPTY,
        public tone: Date = new Date(),
        public userId: string = StringUtils.EMPTY,
        public struct: Struct = new Struct(),
        public isActive: boolean = true,
        public createdAt: string = new Date().toISOString(),
    ) { }

    static fromJson(json: any): StructChords {
        return new StructChords(
            json.id,
            json.title,
            json.description,
            json.singer,
            json.tone,
            json.userId,
            json.struct,
            json.isActive,
            json.createdAt
        );
    }

    toJSON(): object {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            phone: this.description,
            singer: this.singer,
            tone: this.tone,
            userId: this.userId,
            struct: this.struct,
            isActive: this.isActive,
            createdAt: this.createdAt,
        };
    }
}