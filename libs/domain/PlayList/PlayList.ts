import { PlaylistType } from "@/libs/enuns/PlayListType";
import { StringUtils } from "@/libs/utils/StringUtils";
import { v4 as uuidv4 } from 'uuid';

export class PlayList {
    constructor(
        public readonly id: string = uuidv4(),
        public name: string = StringUtils.EMPTY,
        public songId: string[] = [],
        public userId: string = StringUtils.EMPTY,
        public type: PlaylistType = PlaylistType.PERSONAL,
        public isActive: boolean = true,
        public createdAt: string = new Date().toISOString(),
        public groupId?: string
    ) { }

    static fromJson(json: any): PlayList {
        return new PlayList(
            json.id,
            json.name,
            json.songId || [],
            json.userId,
            json.type || PlaylistType.PERSONAL,
            json.isActive ?? true,
            json.createdAt ?? new Date().toISOString(),
            json.groupId
        );
    }

    toJSON(): object {
        return {
            id: this.id,
            name: this.name,
            songId: this.songId,
            userId: this.userId,
            type: this.type,
            isActive: this.isActive,
            createdAt: this.createdAt,
            groupId: this.groupId,
        };
    }
}

