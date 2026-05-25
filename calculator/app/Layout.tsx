import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    // <Stack>
    //   <Stack.Screen name="index" options={{ title: 'Home' }} />
    //   <Stack.Screen name="integrals" options={{ title: 'integrals' }} />
    // </Stack>
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
