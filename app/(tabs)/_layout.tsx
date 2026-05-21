import { View, Text, TouchableOpacity } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import {Badge, Icon, Label, NativeTabs} from 'expo-router/unstable-native-tabs'
import { supabase } from '../utils/supabase';


const TabsLayout: React.FC = () => {
    const router = useRouter();

    return (
      <NativeTabs tintColor={"#ffb900"}>
          <NativeTabs.Trigger name={"home"}>
              <Label>Начало</Label>
              <Icon sf={{ default: 'house', selected: 'house.fill' }} drawable="custom_home_drawable" />
          </NativeTabs.Trigger>

          <NativeTabs.Trigger name={"search"}>
              <Label>Търсене</Label>
              <Icon sf={{ default: 'magnifyingglass.circle', selected: 'magnifyingglass.circle.fill' }} drawable="custom_search_drawable" />
          </NativeTabs.Trigger>

          <NativeTabs.Trigger name={"messages"}>
              <Label>Съобщения</Label>
              <Icon sf={{ default: 'message', selected: 'message.fill' }} drawable="custom_messages_drawable" />
              <Badge>2</Badge>
          </NativeTabs.Trigger>

          <NativeTabs.Trigger name={"profile"} >
              <Label>Профил</Label>
              <Icon sf={{ default: 'person', selected: 'person.fill' }} drawable="custom_profile_drawable" />
          </NativeTabs.Trigger>

          <NativeTabs.Trigger name={"post"} hidden={true} >
          </NativeTabs.Trigger>
      </NativeTabs>
    );
};

export default TabsLayout;
