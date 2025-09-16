import { StringUtils } from '@/libs/utils/StringUtils';
import { v4 as uuidv4 } from 'uuid';

export class Favorite {
    constructor(
        public readonly id: string = uuidv4(),
        public songId: string = StringUtils.EMPTY,
        public userId: string = StringUtils.EMPTY,
        public isActive: boolean = true,
        public createdAt: string = new Date().toISOString(),
    ) { }

    static fromJson(json: any): Favorite {
        return new Favorite(
            json.id,
            json.songId,
            json.userId,
            json.isActive,
            json.createdAt
        );
    }

    toJSON(): object {
        return {
            id: this.id,
            songId: this.songId,
            userId: this.userId,
            isActive: this.isActive,
            createdAt: this.createdAt
        };
    }
}
