import { StringUtils } from "./StringUtils";

export function formatDateBR(text: string): string {
    const cleaned = text.replace(/\D/g, StringUtils.EMPTY);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
}
