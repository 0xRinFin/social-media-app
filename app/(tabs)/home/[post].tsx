import {useLocalSearchParams} from "expo-router";
import { supabase } from "@/app/utils/supabase";
import {useEffect, useState} from "react";
import TabPage from "@/components/Tabs/TabPage";
import {ActivityIndicator, Text, View} from "react-native";
import { Image } from "expo-image";
import { fetchProfileImage } from "../profile/[handle]";

const formatDate = (created_at: string) => {
  return new Date(created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const Viewpost = () => {
    const {post} = useLocalSearchParams<{ post: string }>();

    const [postData, setPostData] = useState<any>();

    const [postImage, setPostImage] = useState<string>("");
    const [postDescription, setPostDescription] = useState<string>("");
    const [postProfile, setPostProfile] = useState<string>("");
    const [postDate, setPostDate] = useState("")

    const [postProfileData, setPostProfileData] = useState<any>();
    const [profileImageUri, setProfileImageUri] = useState("")
    const [profileHandle, setProfileHandle] = useState("")
    const [profileDisplay, setProfileDisplay] = useState("")

    const [isLoading, setIsLoading] = useState(true)

    const fetchPostData = async () => {
        if (post == undefined) return;

        const {data} = await supabase.from("posts").select("*").eq("id", post).single()

        if (data == undefined) return
        setPostData(data)
    }

    const fetchProfileData = async () => {
        if (post == undefined) return;
        if (postData == undefined) return;

        const {data} = await supabase.from("profiles").select("*").eq("id", postProfile).single()
        console.log("hi", data, postProfile, "meow?")
        if (data == undefined) return

        setPostProfileData(data)
    }

    const renderPostData = async () => {
        if (post == undefined) return;
        if (postData == undefined) return;

        setPostImage(postData.image_url)
        setPostDescription(postData.content)
        setPostProfile(postData.user_id)
        setPostDate(postData.created_at)
    }

    const renderProfileData = async () => {
        if (postProfileData == undefined) return;

        const imageUri = await fetchProfileImage(postProfile)

        setProfileImageUri(imageUri)
        setProfileDisplay(postProfileData.display_name)
        setProfileHandle(postProfileData.handle)

        console.log("quick, eh?")
        setIsLoading(false)
    }

    useEffect(() => {
        renderProfileData()
    }, [postProfileData])

    useEffect(() => {
        fetchProfileData();
    }, [postProfile])

    useEffect(() => {
        renderPostData();
    }, [postData])

    useEffect(() => {
        fetchPostData()
    }, [fetchPostData, post])

    if (isLoading) {
        return (
          <TabPage title={"View Post"} titleVisible={true}>
            <View className="w-full h-[70%] items-center justify-center">
                <ActivityIndicator size="large" color="#ffb900" className={`absolute`} />
            </View>
          </TabPage>
        )
    }

    return (
        <TabPage title={"View Post"} titleVisible={true}>
            <View className="items-center p-4  w-full flex gap-4">
                <View className="flex items-start w-full">
                    <View className="flex flex-row items-center gap-2">
                        <Image source={profileImageUri}  style={{ width: 80, height: 80, borderRadius: 50, borderWidth: 2, borderColor: "#2f2f2f" }} />

                        <View>
                            <View className="flex flex-row items-center gap-1">
                                <Text className="color-white text-xl font-bold">{profileDisplay}</Text>
                                <Text className="color-amber-400 opacity-50">@{profileHandle}</Text>
                            </View>

                            <Text className="color-neutral-400">{formatDate(postDate)}</Text>
                        </View>
                    </View>
                </View>

                <Text className="color-white">{postDescription}</Text>
                <Image source={postImage} style={{width: "100%", height: 400, borderRadius:10, borderWidth:2, borderColor:"#2f2f2f"}} contentFit="cover"/>
            </View>
        </TabPage>
    )
}

export default Viewpost;