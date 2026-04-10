import {View} from 'react-native';
import {WrappedButton} from "components/WrappedButton";
import {supabase} from "../../utils/supabase"
import TabPage from "components/Tabs/TabPage";
import {useRouter} from "expo-router";
import {apiFetch} from "@/app/utils/apiFetch";
import {useContext} from "react";
import {AuthContext} from "@/app/authentication/use-auth-context";
import {toByteArray} from "base64-js";
import * as ImagePicker from "expo-image-picker";


const Home = () => {
    const router = useRouter();
    const {session} = useContext(AuthContext)

    const logout = async () => {
        const {error} = await supabase.auth.signOut();
    }

    const requestPostUpload = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            quality: 1,
            base64: true,
        });

        if (result.canceled || !result.assets.length) return;
        const chosenImage = result.assets[0];

        if (chosenImage.base64 == undefined) return;
        const res = await apiFetch("/api/ProfileController/uploadPost", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': session.access_token
            },

            body: JSON.stringify({
                description: "This is a testing description. Miti e gei i obicha deca i to mnogo",
                image: chosenImage.base64
            })
        })

        const rawr = await res.json()
        router.push({pathname:`home/post/${rawr.uuid}`})
    };

  return (
      <TabPage title={"Index"} className={"items-center justify-center flex gap-3 h-full "}>
          <WrappedButton isActive={true} title={"Log Out"} onClick={logout} isAnimated={true}></WrappedButton>
          <WrappedButton isActive={true} title={"rinney"} onClick={
              () => {
                  router.push("profile/rinneyboi")
              }
          } isAnimated={true}></WrappedButton>
          <WrappedButton isActive={true} title={"upload post"} onClick={
              () => {
                  requestPostUpload()
              }
          } isAnimated={true}></WrappedButton>
      </TabPage>
  );
};

export default Home;
