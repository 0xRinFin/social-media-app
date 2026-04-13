import {WrappedButton} from "components/WrappedButton";
import TabPage from "components/Tabs/TabPage";
import {useRouter} from "expo-router";
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

        <WrappedButton isActive={true} title={"rinney"} extraClassName={baseEditButtonStyle} onClick={
              () => {
                router.push("profile/profile/rinneyboi")
              }
          } isAnimated={true}/>
      </TabPage>
  );
};

export default Home;
