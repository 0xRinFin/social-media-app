import { Stack, Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

const AuthLayout = () => {
  return (
    <Stack screenOptions={{headerShown: false}}>
      {/*<Stack.Screen name="sign-in" />*/}
        {/*<Stack.Screen name="sign-up" />*/}
        <Stack.Screen name="test" />
    </Stack>
  );
};

export default AuthLayout;
