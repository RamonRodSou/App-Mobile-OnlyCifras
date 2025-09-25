
import { StringUtils } from '@/libs/utils/StringUtils';
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';

export class User {
	constructor(
		public readonly id: string = uuidv4(),
		public name: string = StringUtils.EMPTY,
		public birthdate: Date = new Date(),
		public cpf: string = StringUtils.EMPTY,
		public email: string = StringUtils.EMPTY,
		public phone: string = StringUtils.EMPTY,
		public groupId: string = StringUtils.EMPTY,
		public activePlan: string = StringUtils.EMPTY,
		public isActive: boolean = true,
		public createdAt: string = new Date().toISOString(),
		protected password: string = StringUtils.EMPTY,
	) { }

	static fromJson(json: any): User {
		return new User(
			json.id,
			json.name,
			new Date(json.birthdate),
			json.cpf,
			json.email,
			json.phone,
			json.role,
			json.groupId,
			json.activePlan,
			json.isActive,
		);
	}

	toJSON(): object {
		return {
			id: this.id,
			name: this.name,
			birthdate: this.birthdate.toISOString(),
			cpf: this.cpf,
			email: this.email,
			phone: this.phone,
			groupId: this.groupId,
			activePlan: this.activePlan,
			isActive: this.isActive,
			createdAt: this.createdAt,
		};
	}

	getPassword(): string {
		return this.password;
	}

	async getPasswordHash(): Promise<string> {
		const salt = await bcrypt.genSalt(10);
		return bcrypt.hash(this.password, salt);
	}

	async checkPassword(plain: string): Promise<boolean> {
		return bcrypt.compare(plain, this.password);
	}
}