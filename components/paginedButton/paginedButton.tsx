import { StringUtils } from "@/libs/utils/StringUtils";
import { Text, View } from "react-native";
import { IconButton } from "react-native-paper";

type Props<T> = {
    page: number;
    setPage: (page: number) => void;
    activeEntity: T[]
}

export default function PaginedButton<T>({ page, setPage, activeEntity }: Props<T>) {
    return (
        <View className="flex-row justify-between items-center px-2 py-1">
            <IconButton
                icon="chevron-left"
                size={24}
                iconColor="white"
                onPress={() => setPage(Math.max(page - 1, 0))}
            />
            <Text className="text-white">
                {page * StringUtils.ROWS_PER_PAGE + 1}-
                {Math.min((page + 1) * StringUtils.ROWS_PER_PAGE, activeEntity.length)} de {activeEntity.length}
            </Text>
            <IconButton
                icon="chevron-right"
                size={24}
                iconColor="white"
                onPress={() => setPage(Math.min(page + 1, Math.ceil(activeEntity.length / StringUtils.ROWS_PER_PAGE) - 1))}
            />
        </View>
    )
}