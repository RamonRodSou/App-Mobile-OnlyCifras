import 'react-native-get-random-values';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { StringUtils } from '@/libs/utils/StringUtils';
import { DarkTheme, DefaultTheme, getFocusedRouteNameFromRoute, ParamListBase, RouteProp, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
    const colorScheme = useColorScheme();

    function getDynamicTabOptions({ route }: { route: RouteProp<ParamListBase> }) {
        const routeName = getFocusedRouteNameFromRoute(route) ?? 'index';

        let titlePage = StringUtils.EMPTY;
        switch (routeName) {
            case 'newChord':
                titlePage = 'Nova Cifra'
                break;
            case 'playList':
                titlePage = 'Playlist'
                break;
            default:
                titlePage = 'Biblioteca'
                break;
        }
        return {
            title: titlePage,
        };
    }

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="(tabs)" options={getDynamicTabOptions} />
                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                <Stack.Screen name="chord/[id]" options={{ title: 'Cifra' }} />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}
