import { StringUtils } from "./StringUtils";

export function formatDateBR(text: string): string {
    const cleaned = text.replace(/\D/g, StringUtils.EMPTY);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
}

export function formatDateToPtBr(dateInput?: string | Date): string {
    if (!dateInput) {
        return StringUtils.EMPTY;
    }

    try {
        const date = new Date(dateInput);

        if (isNaN(date.getTime())) {
            return StringUtils.EMPTY;
        }

        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: 'UTC',
        });
    } catch (error) {
        console.error("Erro ao formatar a data:", error);
        return StringUtils.EMPTY;
    }
}