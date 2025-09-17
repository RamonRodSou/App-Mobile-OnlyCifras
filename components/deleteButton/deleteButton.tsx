import { TouchableOpacity } from "react-native";
import { IconButton } from "react-native-paper";

type Props = {
    color?: string
    handle: () => void;
}

export default function DeleteButton({ color = '#620e0e96', handle }: Props) {
    return (
        <TouchableOpacity
            onPress={() => handle()}
        >
            <IconButton
                icon="delete-circle-outline"
                size={28}
                iconColor={color}
            />
        </TouchableOpacity>
    )
}