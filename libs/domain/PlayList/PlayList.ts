import { v4 as uuidv4 } from 'uuid';

export class PlayList {
    constructor(
        public readonly id: string = uuidv4(),
        public name: string,
        public user: string | null = null,
        public isActive: boolean = true,
        public createdAt: string = new Date().toISOString()
    ) { }

    static fromJson(json: any): PlayList {
        return new PlayList(
            json.id,
            json.name,
            json.user,
            json.isActive,
            json.createdAt
        );
    }

    toJSON(): object {
        return {
            id: this.id,
            name: this.name,
            user: this.user,
            isActive: this.isActive,
            createdAt: this.createdAt
        };
    }
}
