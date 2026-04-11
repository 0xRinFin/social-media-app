import {WrappedButton} from "components/WrappedButton";
import TabPage from "components/Tabs/TabPage";
import {useRouter} from "expo-router";
import {apiFetch} from "@/app/utils/apiFetch";
import {useContext} from "react";
import {AuthContext} from "@/app/authentication/use-auth-context";
import * as ImagePicker from "expo-image-picker";
import { baseEditButtonStyle } from '../profile/editprofile';


const Home = () => {
    const router = useRouter();

  return (
      <TabPage title={"Index"} className={"p-4 flex gap-3 h-full "}>
          <WrappedButton isActive={true} title={"Upload Post"} extraClassName={baseEditButtonStyle} onClick={
              () => {
                router.push("home/post/uploadpost")
                //   requestPostUpload()
              }
          } isAnimated={true}/>
      </TabPage>
  );
};

export default Home;
