import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { theme } from '@/libs/utils/paperThemer';
import { StringUtils } from '@/libs/utils/StringUtils';
import { DarkTheme, DefaultTheme, getFocusedRouteNameFromRoute, ParamListBase, RouteProp, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
    const colorScheme = useColorScheme();

    function getDynamicTabOptions({ route }: { route: RouteProp<ParamListBase> }) {
        const routeName = getFocusedRouteNameFromRoute(route) ?? 'index';

        let titlePage = StringUtils.EMPTY;
        switch (routeName) {
            case 'newChord':
                titlePage = 'Nova Cifra'
                break;
            case 'playListTeam':
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
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme} >
            <PaperProvider theme={theme}>
                <Stack>
                    <Stack.Screen name="(tabs)" options={getDynamicTabOptions} />
                    <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                    <Stack.Screen name="chord/[id]" options={{ title: 'Cifra' }} />
                    <Stack.Screen name="favoriteList/[id]" options={{ title: 'Play' }} />
                </Stack>
                <StatusBar style="auto" />
            </PaperProvider>

        </ThemeProvider>
    );
}
