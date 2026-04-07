import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    // 'screenOptions={{ headerShown: false }}' hides the default top top-bar 
    // so we can build our own custom headers later.
    <Stack screenOptions={{ headerShown: false }}>
      {/* This tells the layout to render your index.tsx file first */}
      <Stack.Screen name="index" />
    </Stack>
  );
}