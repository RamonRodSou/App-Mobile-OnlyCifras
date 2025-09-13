import { Crud } from "@/libs/domain/GenericCrud/GenericCrud";
import { Member } from "@/libs/domain/users/member/Member";

const collectionName = 'members';

export async function memberAdd(member: Member) {
    try {
        const user = Crud.getAuthenticatedUser();
        const passwordHash = await member.getPasswordHash();

        const saveData = await saveMemberToDatabase(member, user.uid, passwordHash)
        Crud.add(collectionName, saveData)

    } catch (error) {
        alert('Erro ao adicionar membro: ' + error);
        throw error;
    }
}

export function findAllMembers(): Promise<Member[]> {
    return Crud.findAllSummary<Member>(collectionName)
}

export function findMemberToById(id: string): Promise<(Member & { id: string }) | null> {
    return Crud.findById<Member>(id, collectionName);
};

async function saveMemberToDatabase(entity: Member, id: string, passwordHash: string) {
    const data = {
        id,
        name: entity.name,
        email: entity.email,
        phone: entity.phone,
        birthdate: entity.birthdate ? entity.birthdate.toJSON() : null,
        useId: entity.userId,
        role: entity.role,
        isActive: entity.isActive,
        createdAt: entity.createdAt,
        passwordHash,
    };

    return await data;
}
