import { v4 as uuidv4 } from 'uuid';

export class Favorite {
    constructor(
        public readonly id: string = uuidv4(),
        public idChord: string,
        public user: string | null = null,
        public isActive: boolean = true,
        public createdAt: string = new Date().toISOString()
    ) { }

    static fromJson(json: any): Favorite {
        return new Favorite(
            json.id,
            json.idChord,
            json.user,
            json.isActive,
            json.createdAt
        );
    }

    toJSON(): object {
        return {
            id: this.id,
            idChord: this.idChord,
            user: this.user,
            isActive: this.isActive,
            createdAt: this.createdAt
        };
    }
}
