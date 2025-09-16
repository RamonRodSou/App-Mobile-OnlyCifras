import { Tones } from "@/libs/enuns/Tones";
import { StringUtils } from "@/libs/utils/StringUtils";
import { v4 as uuidv4 } from 'uuid';
import { IStruct } from "../Interfaces/IStruct";

export class StructSong {

    constructor(
        public readonly id: string = uuidv4(),
        public title: string = StringUtils.EMPTY,
        public description: string = StringUtils.EMPTY,
        public singer: string = StringUtils.EMPTY,
        public tone: Tones = Tones.C_Am,
        public userId: string = StringUtils.EMPTY,
        public struct: IStruct[] = [],
        public isActive: boolean = true,
        public createdAt: string = new Date().toISOString(),
    ) { }

    static fromJson(json: any): StructSong {
        return new StructSong(
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
            singer: this.singer,
            tone: this.tone,
            userId: this.userId,
            struct: this.struct,
            isActive: this.isActive,
            createdAt: this.createdAt,
        };
    }
}