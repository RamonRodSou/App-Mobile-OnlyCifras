import { v4 as uuidv4 } from "uuid";

export class Plan {
    constructor(
        public readonly id: string = uuidv4(),
        public name: string,
        public maxGroup: number = 0,
        public maxMembersPerGroup: number = 0,
        public isActive: boolean = true,
        public createdAt: string = new Date().toISOString(),
    ) { }

    static fromJson(json: any): Plan {
        return new Plan(
            json.id,
            json.name,
            json.maxGroup,
            json.maxMembersPerGroup,
            json.isActive ?? true,
            json.createdAt ?? new Date().toISOString(),
        );
    }

    toJSON(): object {
        return {
            id: this.id,
            name: this.name,
            maxGroup: this.maxGroup,
            maxMembersPerGroup: this.maxMembersPerGroup,
            isActive: this.isActive,
            createdAt: this.createdAt,
        };
    }
}
