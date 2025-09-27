import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import 'react-native-reanimated';
import '../global.css';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { CredentialsProvider } from '@/context/CredentialsContext';
import { PermissionProvider } from '@/context/PermissionContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { theme } from '@/libs/utils/paperThemer';
import { StringUtils } from '@/libs/utils/StringUtils';
import { DarkTheme, getFocusedRouteNameFromRoute, ParamListBase, RouteProp, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const router = useRouter();
    const { user, loading } = useAuth();
    const segments = useSegments();

    function getDynamicTabOptions({ route }: { route: RouteProp<ParamListBase> }) {
        const routeName = getFocusedRouteNameFromRoute(route) ?? 'index';

        let titlePage = StringUtils.EMPTY;

        switch (routeName) {
            case 'songsList':
                titlePage = 'Biblioteca';
                break;
            case 'playListTeam':
                titlePage = 'Playlist';
                break;
            default:
                titlePage = 'Home';
                break;
        }
        return { title: titlePage };
    }

    useEffect(() => {
        if (loading) return;
        const inAuthGroup = segments[0] === '(auth)';

        if (!user && !inAuthGroup) {
            router.replace('./(auth)/index');
        }

        if (user && inAuthGroup) {
            router.replace('./(tabs)/menu');
        }
    }, [user, segments, loading]);

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DarkTheme}>
            <AuthProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <PaperProvider theme={theme}>
                        <PermissionProvider>
                            <CredentialsProvider>
                                <Stack>
                                    <Stack.Screen name="(auth)/index" options={{ headerShown: false }} />
                                    <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
                                    <Stack.Screen name="(auth)/forgotPassWord" options={{ headerShown: false }} />

                                    <Stack.Screen name="(menu)/chordDetails" options={{ headerShown: false }} />
                                    <Stack.Screen name="(menu)/groupScreen" options={{ headerShown: false }} />

                                    <Stack.Screen name="(tabs)" options={getDynamicTabOptions} />
                                    <Stack.Screen name="chord/[id]" options={{ title: 'Cifra' }} />
                                    <Stack.Screen name="editChord/[id]" options={{ title: 'Editar Cifra' }} />
                                    <Stack.Screen name="favoriteList/[id]" options={{ title: 'Play' }} />
                                    <Stack.Screen name="chordFavorites/[id]" options={{ title: 'Cifra' }} />
                                </Stack>
                            </CredentialsProvider>
                        </PermissionProvider>
                        <StatusBar style="auto" />
                    </PaperProvider>
                </GestureHandlerRootView>
            </AuthProvider>
        </ThemeProvider>
    );
}
