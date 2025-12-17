import { Image } from 'expo-image';
import { StyleSheet, Pressable, Alert } from 'react-native';
import { useState } from 'react';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const colorScheme = useColorScheme();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      Alert.alert(
        'Sign-Out Error',
        error instanceof Error ? error.message : 'An error occurred during sign-out'
      );
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.userContainer}>
        <ThemedText type="subtitle">Logged in as:</ThemedText>
        <ThemedText style={styles.email}>{user?.email ?? 'Unknown'}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.signOutContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.signOutButton,
            {
              backgroundColor: colorScheme === 'dark' ? '#EF4444' : '#DC2626',
              opacity: pressed || isSigningOut ? 0.7 : 1,
            },
          ]}
          onPress={handleSignOut}
          disabled={isSigningOut}
        >
          <ThemedText style={styles.signOutButtonText}>
            {isSigningOut ? 'Signing out...' : 'Sign Out'}
          </ThemedText>
        </Pressable>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userContainer: {
    gap: 4,
    marginTop: 16,
    marginBottom: 16,
  },
  email: {
    opacity: 0.7,
  },
  signOutContainer: {
    marginTop: 24,
  },
  signOutButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
