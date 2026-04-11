import TabPage from "../TabPage"
import {WrappedButton} from "components/WrappedButton";
import {useRouter} from "expo-router";
import {apiFetch} from "@/app/utils/apiFetch";
import {useContext, useState} from "react";
import {AuthContext} from "@/app/authentication/use-auth-context";
import * as ImagePicker from "expo-image-picker";
import { ActivityIndicator, Alert, Pressable, View } from "react-native";
import SigninTextField from "@/components/Signin/SignInTextField";
import PostImage from "./PostImage";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import UploadableIndicator from "@/components/UploadableIndicator";
import { baseButtonStyle, baseEditButtonStyle, editButtonStyle } from "@/app/(tabs)/profile/editprofile";

const checkered = require("assets/Images/checkered.jpg")

const UploadPost = () => {
    const router = useRouter()
    const {session} = useContext(AuthContext)

    const [description, setDescription] = useState("")
    const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null)
    const [isImageLoading, setisImageLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const promptSelectImage = async () => {
        setisImageLoading(true)
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            quality: 1,
            base64: true,
            allowsEditing: true
        });
        setisImageLoading(false)
        
        if (result.canceled || !result.assets.length) return;
        const chosenImage = result.assets[0];

        if (chosenImage.base64 == undefined) return;
        setSelectedImage(chosenImage)
    };

    const requestPostUpload = async () => {
        if (selectedImage == null) return

        setIsLoading(true)
        const res = await apiFetch("/api/PostController/uploadPost", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': session.access_token
            },

            body: JSON.stringify({
                description: description,
                image: selectedImage.base64
            })
        })
        
        setIsLoading(false)

        const rawr = await res.json()
        if (rawr && rawr.code == "success")
            router.replace({pathname:`home/post/${rawr.uuid}`})
        else
            Alert.alert("Error", `Sorry there was an error!\n${rawr.code}`)
    };

    return (
        <TabPage title="Upload Post" titleVisible={true}>
            <View className="p-4 pt-6 flex gap-6 mb-[35vh]">
                <View className="w-full h-[400px]">
                    <Pressable onPress={promptSelectImage}>
                        <View className={`z-10 w-full h-full absolute flex justify-center items-center ${selectedImage != null && "" }`}>
                            <ActivityIndicator size="large" color="#ffb900" className={`absolute ${!isImageLoading && "hidden"}`} />
                
                            <WrappedButton isAnimated={true} onClick={promptSelectImage} title="Upload Image" isActive={true} extraClassName={baseButtonStyle + ` w-full ${isImageLoading && "hidden"}`}/>
                        </View>

                        <PostImage source={selectedImage || checkered} className={`opacity-${selectedImage != null ? 100 : 50 }`}/>
                    </Pressable>
                </View>

                <SigninTextField onChangeText={setDescription} title="Description" placeholder="What do you wanna say?" />
                <WrappedButton isLoading={isLoading} title="Post" isActive={true} isAnimated={true} onClick={requestPostUpload} extraClassName={baseEditButtonStyle} />
            </View>
        </TabPage>
    )
}

export default UploadPost