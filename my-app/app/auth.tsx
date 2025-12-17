import { StyleSheet, View, Pressable, ActivityIndicator, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AuthScreen() {
    const { signInWithGoogle } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const colorScheme = useColorScheme();

    const handleSignIn = async () => {
        setIsLoading(true);
        try {
            await signInWithGoogle();
        } catch (error) {
            Alert.alert(
                'Sign-In Error',
                error instanceof Error ? error.message : 'An error occurred during sign-in'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <View style={styles.content}>
                <ThemedText type="title" style={styles.title}>
                    Welcome
                </ThemedText>
                <ThemedText style={styles.subtitle}>
                    Sign in to continue
                </ThemedText>

                <Pressable
                    style={({ pressed }) => [
                        styles.googleButton,
                        {
                            backgroundColor: colorScheme === 'dark' ? '#4285F4' : '#FFFFFF',
                            borderColor: colorScheme === 'dark' ? '#4285F4' : '#DADCE0',
                            opacity: pressed ? 0.8 : 1,
                        },
                    ]}
                    onPress={handleSignIn}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator
                            size="small"
                            color={colorScheme === 'dark' ? '#FFFFFF' : '#4285F4'}
                        />
                    ) : (
                        <>
                            <View style={styles.googleIconContainer}>
                                <ThemedText style={styles.googleIcon}>G</ThemedText>
                            </View>
                            <ThemedText
                                style={[
                                    styles.googleButtonText,
                                    { color: colorScheme === 'dark' ? '#FFFFFF' : '#1F1F1F' },
                                ]}
                            >
                                Sign in with Google
                            </ThemedText>
                        </>
                    )}
                </Pressable>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    content: {
        width: '100%',
        maxWidth: 320,
        alignItems: 'center',
    },
    title: {
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        marginBottom: 48,
        opacity: 0.7,
        textAlign: 'center',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        borderWidth: 1,
        minHeight: 48,
    },
    googleIconContainer: {
        width: 24,
        height: 24,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
    },
    googleIcon: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4285F4',
    },
    googleButtonText: {
        fontSize: 16,
        fontWeight: '500',
    },
});
