import { StringUtils } from "@/libs/utils/StringUtils";
import { v4 as uuidv4 } from "uuid";

export class Group {
    constructor(
        public readonly id: string = uuidv4(),
        public name: string = StringUtils.EMPTY,
        public ownerId: string = StringUtils.EMPTY,
        public membersId: string[] = [],
        public memberCount: number = 0,
        public planId: string = StringUtils.EMPTY,
        public isActive: boolean = true,
        public createdAt: string = new Date().toISOString(),
        public inviteCode?: string,
    ) { }

    static fromJson(json: any): Group {
        return new Group(
            json.id,
            json.name,
            json.ownerId,
            json.membersId || [],
            json.memberCount ?? 0,
            json.planId ?? StringUtils.EMPTY,
            json.isActive ?? true,
            json.createdAt ?? new Date().toISOString(),
            json.inviteCode
        );
    }

    toJSON(): object {
        return {
            id: this.id,
            name: this.name,
            ownerId: this.ownerId,
            membersId: this.membersId,
            memberCount: this.memberCount,
            planId: this.planId,
            isActive: this.isActive,
            createdAt: this.createdAt,
            inviteCode: this.inviteCode
        };
    }
}
