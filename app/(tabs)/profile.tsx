import {Image} from "expo-image";
import {Text, View} from 'react-native';
import TabPage from "../../components/Tabs/TabPage";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../authentication/use-auth-context";
import {supabase, supabase as supabaseClient} from "@/app/utils/supabase";
import {WrappedButton} from "@/components/WrappedButton";
import * as ImagePicker from 'expo-image-picker';
import { toByteArray } from 'base64-js';
import {router, useLocalSearchParams, useRouter} from "expo-router";
import {ProfileImage} from "@/components/Tabs/Profile/ProfileImage"

const defaultIcon = require("../../assets/Images/default_avatar.jpg");

const Profile = () => {
    const router = useRouter();

    const {profile} = useContext(AuthContext);
    const [isSelf, setIsSelf] = useState<boolean>(false);
    const [targetProfile, setTargetProfile] = useState<typeof profile | null>();

    const [name, setName] = useState<string>("Profile");
    const [handle, setHandle] = useState<string>("Profile");
    const params = useLocalSearchParams<{handle: string}>();

    const [profileImageUri, setProfileImageUri] = useState<string | null>(defaultIcon);
    const [description, setDescription] = useState<string>("");

    const [isFollowing, setIsFollowing] = useState<boolean>(false);

    const fetchProfileData = async () => {
        if (params.handle == undefined) return setTargetProfile(profile);

        const { data, error } = await supabase.from('profiles').select('*').eq('handle', params.handle).single()
        if (error) {
            console.error("Error fetching profile:", error);
            setTargetProfile(null);
            return;
        }

        setTargetProfile(data)
        console.log(data)
    }

    const fetchProfileImage =  async () => {
        if (targetProfile == undefined) return defaultIcon;

        const userAvatarPath =`/${targetProfile.id}/avatar.jpg`
        const doesExist = await supabaseClient.storage
            .from('avatars')
            .exists(userAvatarPath)

        if (doesExist.error || !doesExist.data) return defaultIcon;

        const url = supabaseClient.storage.from('avatars').getPublicUrl(userAvatarPath);
        return url.data.publicUrl;
    }

    const renderProfileImage = async () => {
        const uri = await fetchProfileImage()
        setProfileImageUri(uri)
    }

    useEffect(() => {
        if (targetProfile != undefined) {
            setName(targetProfile.display_name);
            setHandle(targetProfile.handle);
            setDescription(targetProfile.description);

            setIsSelf(targetProfile.id == profile.id);
        }

        renderProfileImage();
    }, [targetProfile]);

    useEffect(() => {
        fetchProfileData();
    }, [params.handle, profile]);

  return (
      <TabPage title={"Profile View"} className={""}>
          <View className={`min-h-[24vh] max-h-[30vh] grow border-b-neutral-800 border-b-2 m-4 gap-2 pb-4`}>
              {/*require("../../assets/Images/default_avatar.jpg")*/}
              <View className={"p-2  min-h-12 min-w-12 z-50 overflow-hidden grow flex flex-row items-center gap-4"}>
                  <Image source={profileImageUri} style={{width: 100, height: 100, borderRadius: "100%", borderWidth:2, borderColor:"#2f2f2f"}}/>

                  <View className={"flex gap-4"}>
                      <View className={"flex flex-row gap-2 items-center"}>
                          <Text className={"text-4xl color-white font-bold"}>{name}</Text>
                          <Text className={"text-2xl color-amber-400 opacity-70"}>@{handle}</Text>
                      </View>

                      <View className={"flex flex-row gap-4"}>
                          <Text className={"text-xl color-neutral-400 font-light"}>Followers: <View className={"bg-amber-400 rounded-md translate-y-[6px] p-[1px]"}><Text className={"font-bold"}>123</Text></View></Text>
                          <Text className={"text-xl color-neutral-400 font-light"}>Followers: <View className={"bg-amber-400 rounded-md translate-y-[6px] p-[1px]"}><Text className={"font-bold"}>123</Text></View></Text>
                      </View>
                  </View>
              </View>

              {(description != null) && (<Text className={"color-white mb-6"}>rawr{description}</Text>)}
              <WrappedButton isActive={true} title={isSelf ? "Edit Profile" : "Follow"} onClick={() => router.push("/EditProfile/")} isAnimated={true} extraClassName={"w-[90vw] text-md rounded-xl p-[10px]"}></WrappedButton>
          </View>


          <View className={"flex flex-row flex-wrap gap-1 mt-1 wrap"}>
              {Array.from({ length: 50 }).map((_, i) => (
                  <ProfileImage key={i} height={100} width={100}></ProfileImage>
              ))}
          </View>

              {/*<WrappedButton isActive={true} title={"Upload Image"} onClick={uploadProfileImage} isAnimated={true}></WrappedButton>*/}
              {/*<WrappedButton isActive={true} title={"Go to Radi"} onClick={() => {*/}
              {/*    router.setParams({*/}
              {/*        handle: "radan"*/}
              {/*    })*/}
              {/*}} isAnimated={true}></WrappedButton>*/}
              {/*<WrappedButton isActive={true} title={"Go to Rin"} onClick={() => {*/}
              {/*    router.setParams({*/}
              {/*      handle: "rinneyboi"*/}
              {/*    })*/}
              {/*}} isAnimated={true}></WrappedButton>*/}
      </TabPage>
  );
};



export default Profile;
