import { Role } from '@/libs/enuns/Role';
import { StringUtils } from '@/libs/utils/StringUtils';
import { v4 as uuidv4 } from 'uuid';

export class Member {
    constructor(
        public readonly id: string = uuidv4(),
        public name: string = StringUtils.EMPTY,
        public email: string = StringUtils.EMPTY,
        public phone: string = StringUtils.EMPTY,
        public birthdate: Date = new Date(),
        public userId: string = StringUtils.EMPTY,
        public role: Role = Role.MEMBER,
        public isActive: boolean = true,
        public password: string = StringUtils.EMPTY,
        public createdAt: string = new Date().toISOString(),
    ) { }

    static fromJson(json: any): Member {
        return new Member(
            json.id,
            json.name,
            json.phone,
            json.birthdate,
            json.userId,
            json.role,
            json.isActive,
            json.password,
            json.createdAt
        );
    }

    toJSON(): object {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            phone: this.phone,
            birthdate: this.birthdate.toISOString(),
            userId: this.userId,
            role: this.role,
            isActive: this.isActive,
            createdAt: this.createdAt,
        };
    }


    async getPasswordHash(): Promise<string> {
        // return bcrypt.hash(this.password, 10);
        return this.password
    }
}
