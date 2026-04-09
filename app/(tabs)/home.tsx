import {View} from 'react-native';
import {WrappedButton} from "../../components/WrappedButton";
import {supabase} from "../utils/supabase"
import TabPage from "../../components/Tabs/TabPage";
import {useRouter} from "expo-router";

const Home = () => {
    const router = useRouter();
    const logout = async () => {
        const {error} = await supabase.auth.signOut();
    }
  return (
      <TabPage title={"Home"} className={"items-center justify-center flex gap-3 h-full "}>
          <WrappedButton isActive={true} title={"Log Out"} onClick={logout} isAnimated={true}></WrappedButton>
          <WrappedButton isActive={true} title={"rinney"} onClick={
              () => {
                  router.push("profile/rinneyboi")
              }
          } isAnimated={true}></WrappedButton>
      </TabPage>
  );
};

export default Home;
