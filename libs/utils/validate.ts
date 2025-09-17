import dayjs from "dayjs";
import { IErrors } from "../domain/Interfaces/IError";
import { PlayList } from "../domain/PlayList/PlayList";
import { StructSong } from "../domain/StructSong/StructSong";
import { StringUtils } from "./StringUtils";

const phoneDigitsRegex = /^[0-9]{8,11}$/;

export function sanitize(input: string): string {
    return input.replace(/<[^>]*>?/gm, StringUtils.EMPTY).trim();
}

export function validatePhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length >= 8 && cleaned.length <= 11;
}

export function validateMemberForm(entity: any, quantity?: number): IErrors {
    const error: IErrors = {};

    textValidate(entity.name, error);

    if (entity.phone) {
        phoneValidate(entity.phone, error, "phone");
    }

    return error;
}

export function validateSongForm(entity: StructSong): IErrors {
    const error: IErrors = {};

    textValidate(entity.title, error);
    textValidate(entity.singer, error, 3);

    if (!entity.tone) {
        error.tone = "O tom é obrigatório.";
    }

    if (!entity.struct || entity.struct.length === 0) {
        error.struct = "Pelo menos uma seção deve ser adicionada.";
    } else {
        entity.struct.forEach((section: any, index: number) => {
            if (!section.section || sanitize(section.section).length < 2) {
                error[`struct_section_${index}`] = "Nome da seção inválido.";
            }
            if (!section.content || section.content.join("").trim().length < 2) {
                error[`struct_content_${index}`] = "Cifra inválida.";
            }
        });
    }

    return error;
}


export function validatePlayListForm(entity: PlayList): IErrors {
    const error: IErrors = {};
    textValidate(entity.name, error);

    return error;
}

function textValidate(
    text: string,
    error: IErrors,
    length: number = 4,
    field: keyof IErrors = "text"
) {
    if (!text || sanitize(String(text)).length < length) {
        error[field] = `${text} inválido (mínimo ${length} caracteres).`;
    }
    return error;
}

function phoneValidate(
    phone: string,
    error: IErrors,
    field: keyof IErrors = "phone"
) {
    const phoneFormatted = String(phone ?? StringUtils.EMPTY).replace(/\D/g, StringUtils.EMPTY);
    if (!phoneDigitsRegex.test(phoneFormatted)) {
        error[field] = "Telefone deve conter de 8 a 11 dígitos.";
    }
    return error;
}

function birthdateValidate(
    birthdate: string | undefined,
    error: IErrors,
    field: keyof IErrors = "birthdate"
) {
    if (!birthdate) {
        error[field] = "Data de nascimento obrigatória.";
    } else {
        const birth = dayjs(birthdate);
        const minBirth = dayjs().subtract(16, "years");
        if (birth.isAfter(minBirth)) {
            error[field] = "Idade mínima: 16 anos.";
        }
    }
    return error;
}