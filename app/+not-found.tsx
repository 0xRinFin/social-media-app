import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native';

const NotFound = () => {
  return (
    <SafeAreaView className="items-center justify-center text-center">
      <Text>Страницата не е намерена!</Text>
    </SafeAreaView>
  );
};

export default NotFound;
