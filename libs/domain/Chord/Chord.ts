import { Tones } from "@/libs/enuns/Tones";
import { StringUtils } from "@/libs/utils/StringUtils";
import { v4 as uuidv4 } from 'uuid';
import { IStruct } from "../Interfaces/IStruct";

interface ILike {
    likes: number;
    userId: string;
}

export class Chord {

    constructor(
        public readonly id: string = uuidv4(),
        public title: string = StringUtils.EMPTY,
        public singer: string = StringUtils.EMPTY,
        public tone: Tones = Tones.C_Am,
        public userId: string = StringUtils.EMPTY,
        public struct: IStruct[] = [],
        public likesCount: number = 0,
        public isActive: boolean = true,
        public createdAt: string = new Date().toISOString(),
    ) { }

    static fromJson(json: any): Chord {
        return new Chord(
            json.id,
            json.title,
            json.singer,
            json.tone,
            json.userId,
            json.struct,
            json.likesCount,
            json.isActive,
            json.createdAt
        );
    }

    toJSON(): object {
        return {
            id: this.id,
            title: this.title,
            singer: this.singer,
            tone: this.tone,
            userId: this.userId,
            struct: this.struct,
            likesCount: this.likesCount,
            isActive: this.isActive,
            createdAt: this.createdAt,
        };
    }
}