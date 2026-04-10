import {useLocalSearchParams} from "expo-router";
import { supabase } from "@/app/utils/supabase";
import {useEffect, useState} from "react";
import TabPage from "@/components/Tabs/TabPage";
import {ActivityIndicator, Pressable, Text, View} from "react-native";
import { Image } from "expo-image";
import { fetchProfileImage } from "app/utils/postUtils";
import ImageView from "react-native-image-viewing" 
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import PostCreator from "./PostCreator";

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
    const [modalVisible, setModalVisible] = useState(false)

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

    const show = () => {
        setModalVisible(true)
    }

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
                <PostCreator displayName={profileDisplay} handle={profileHandle} imageUrl={profileImageUri} postDate={postDate}/>

                <Text className="color-white">{postDescription}</Text>
                <Pressable onPress={show} className="w-full h-[400px]">
                    <Image source={postImage} style={{width: "100%", height: "100%", borderRadius:10, borderWidth:2, borderColor:"#2f2f2f"}} contentFit="cover"/>
                </Pressable>

                <ImageView
                    visible={modalVisible}
                    images={[
                        {
                            uri: postImage
                        }
                    ]}
                    imageIndex={0}
                    onRequestClose={() => setModalVisible(false)}
                />

                <View className="flex flex-row w-full p-2 justify-between">
                    <View className="flex flex-row gap-4">
                        <Pressable>
                            <FontAwesome6 iconStyle="regular" name={"heart"} size={40} color={"#ffb900"}  />
                        </Pressable>

                        <Pressable>
                            <FontAwesome6 iconStyle="regular" name={"comment"} size={40} color={"#ffb900"}  />
                        </Pressable>
                    </View>
{/* 
                    <Pressable>
                        <FontAwesome6 iconStyle="" name={"share-from-square"} size={40} color={"#ffb900"}  />
                    </Pressable> */}
                </View>

                <View className="w-full border-t border-neutral-600 p-2 pt-4 mb-48 flex gap-4 ">
                    <Text className="text-white text-2xl">69 Comments</Text>

                    <View>

            

                    </View>
                </View>
            </View>
        </TabPage>
    )
}

export default Viewpost;
