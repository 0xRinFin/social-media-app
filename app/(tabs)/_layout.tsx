import { View, Text, TouchableOpacity } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import {Badge, Icon, Label, NativeTabs} from 'expo-router/unstable-native-tabs'
import { supabase } from '../utils/supabase';


const TabsLayout: React.FC = () => {
    const router = useRouter();

    return (
      <NativeTabs tintColor={"#ffb900"}>
          <NativeTabs.Trigger name={"home"}>
              <Label>Home</Label>
              <Icon sf={{ default: 'house', selected: 'house.fill' }} drawable="custom_home_drawable" />
          </NativeTabs.Trigger>

          <NativeTabs.Trigger name={"search"}>
              <Label>Search</Label>
              <Icon sf={{ default: 'magnifyingglass.circle', selected: 'magnifyingglass.circle.fill' }} drawable="custom_search_drawable" />
          </NativeTabs.Trigger>

          <NativeTabs.Trigger name={"messages"}>
              <Label>Messages</Label>
              <Icon sf={{ default: 'message', selected: 'message.fill' }} drawable="custom_messages_drawable" />
              <Badge>99</Badge>
          </NativeTabs.Trigger>

          <NativeTabs.Trigger name={"profile"} >
              <Label>Profile</Label>
              <Icon sf={{ default: 'person', selected: 'person.fill' }} drawable="custom_profile_drawable" />
          </NativeTabs.Trigger>

          <NativeTabs.Trigger name={"post"} hidden={true} >
          </NativeTabs.Trigger>
      </NativeTabs>
    );
};

export default TabsLayout;