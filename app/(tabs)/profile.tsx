import {Text, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TabPage from "../../components/Tabs/TabPage";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../authentication/use-auth-context";
import {Image} from "expo-image";
// import from "@assets"

const Profile = () => {
    const {profile} = useContext(AuthContext);
    const [name, setName] = useState<string>("Profile");

    useEffect(() => {
        if (profile !== null) {
            setName(profile.display_name);
        }
    }, [profile]);

  return (
      <TabPage title={"Profile View"} className={""}>
          <View className={"h-1/5 border-b-neutral-800 border-b-1"}>
              {/* <Image source={require("")}>

              </Image> */}
          </View>
      </TabPage>
  );
};

export default Profile;
