import { useEffect, useState } from "react";
import { TextInput } from "react-native-paper";

type SearchProps<T> = {
    data: T[];
    onFilter: (filtered: T[]) => void;
    label: string;
    searchBy: (item: T, term: string) => boolean;
};

export default function SearchBar<T>({ data, onFilter, label, searchBy }: SearchProps<T>) {
    const [searchTerm, setSearchTerm] = useState<string>("");

    const handleChange = (term: string) => {
        setSearchTerm(term);
        const filtered = data.filter(item => searchBy(item, term));
        onFilter(filtered);
    };

    useEffect(() => {
        if (!searchTerm) {
            onFilter(data);
            return;
        }
        const filtered = data.filter((item) => searchBy(item, searchTerm));
        onFilter(filtered);
    }, [searchTerm, data]);

    return (
        <TextInput
            mode="outlined"
            label={label}
            className="mb-2"
            value={searchTerm}
            onChangeText={handleChange}
        />
    );
}
