import {View} from 'react-native';
import {WrappedButton} from "../../components/WrappedButton";
import {supabase} from "../utils/supabase"
import TabPage from "../../components/Tabs/TabPage";

const Home = () => {

    const logout = async () => {
        const { data } = await supabase.auth.getSession()
        console.log(data.session)
        const {error} = await supabase.auth.signOut();
        console.log(error);
        console.log("hai")
    }
  return (
      <TabPage title={"Home"} className={"items-center justify-center flex gap-3 h-full "}>
          <WrappedButton isActive={true} title={"Log Out"} onClick={logout} isAnimated={true}></WrappedButton>
      </TabPage>
  );
};

export default Home;
