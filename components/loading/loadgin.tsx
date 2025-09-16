import { ActivityIndicator, View } from "react-native";

type LoadingProps = {
    visible?: boolean;
};

export default function Loading({ visible = true }: LoadingProps) {
    if (!visible) return null;

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
            <ActivityIndicator size={60} color="#ffffff" animating={true} />
        </View>
    );
}
