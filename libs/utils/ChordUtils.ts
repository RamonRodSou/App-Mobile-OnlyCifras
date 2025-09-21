
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const noteMap: { [key: string]: string } = {
    'Cb': 'B', 'C': 'C', 'C#': 'C#',
    'Db': 'C#', 'D': 'D', 'D#': 'D#',
    'Eb': 'D#', 'E': 'E', 'E#': 'F',
    'Fb': 'E', 'F': 'F', 'F#': 'F#',
    'Gb': 'F#', 'G': 'G', 'G#': 'G#',
    'Ab': 'G#', 'A': 'A', 'A#': 'A#',
    'Bb': 'A#', 'B': 'B', 'B#': 'C'
};

function getIndex(note: string): number {
    const match = note.match(/[A-G](#|b)?/);
    if (!match) {
        return -1;
    }
    const rootNote = match[0];
    const normalizedNote = noteMap[rootNote];
    if (!normalizedNote) {
        return -1;
    }
    return NOTES.indexOf(normalizedNote);
}

export function semitoneDiff(from: string, to: string): number {
    const iFrom = getIndex(from);
    const iTo = getIndex(to);
    if (iFrom < 0 || iTo < 0) {
        return 0;
    }
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