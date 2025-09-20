import { Tones } from "../enuns/Tones";

const NOTES = Object.values(Tones).map(t => t.split('/')[0].trim());

function getIndex(note: string) {
    const match = note.match(/[A-G](#|b)?/);
    if (!match) return -1;
    const root = match[0].replace("b", "#");
    return NOTES.indexOf(root);
}

export function semitoneDiff(from: string, to: string) {
    const iFrom = getIndex(from);
    const iTo = getIndex(to);
    if (iFrom < 0 || iTo < 0) return 0;
    return (iTo - iFrom + NOTES.length) % NOTES.length;
}

export function transposeChord(chord: string, diff: number): string {
    if (!chord || !chord.trim().match(/^[A-G]/)) {
        return chord;
    }

    const parts = chord.split('/');

    const transposedParts = parts.map(part => {
        const match = part.match(/[A-G](#|b)?/);
        if (!match) {
            return part;
        }

        const rootIndex = getIndex(match[0]);
        if (rootIndex === -1) {
            return part;
        }

        const newRoot = NOTES[(rootIndex + diff + NOTES.length) % NOTES.length];

        const suffix = part.slice(match[0].length);

        return newRoot + suffix;
    });

    return transposedParts.join('/');
}
