import { v4 as uuidv4 } from 'uuid';

export class Audit {
    constructor(
        public readonly id: string = uuidv4(),
        public action: string,
        public classRef: string | null = null,
        public user: string | null = null,
        public isActive: boolean = true,
        public createdAt: string = new Date().toISOString()
    ) { }

    static create(action: string, classRef: string): Audit {
        return new Audit(uuidv4(), action, classRef)
    }

    static fromJson(json: any): Audit {
        return new Audit(
            json.id,
            json.action,
            json.classRef,
            json.user,
            json.isActive,
            json.createdAt
        );
    }

    toJSON(): object {
        return {
            id: this.id,
            action: this.action,
            classRef: this.classRef,
            user: this.user,
            isActive: this.isActive,
            createdAt: this.createdAt
        };
    }
}
