import { StringUtils } from "@/libs/utils/StringUtils";
import { v4 as uuidv4 } from 'uuid';

export class Struct {

    constructor(
        public readonly id: string = uuidv4(),
        public content: string = StringUtils.EMPTY,
        public section: string = StringUtils.EMPTY,
    ) { }

    static fromJson(json: any): Struct {
        return new Struct(
            json.id,
            json.content,
            json.section,
        );
    }

    toJSON(): object {
        return {
            id: this.id,
            content: this.content,
            section: this.section,
        };
    }
}