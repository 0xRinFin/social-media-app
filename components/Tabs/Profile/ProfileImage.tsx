import {Image} from "expo-image";
import {Pressable, View} from "react-native";
import {useRouter} from "expo-router";

type imageProps = {
    height: number;
    width: number;

    postId: string,
    imageUrl: string,
}

export const ProfileImage = (props: imageProps) => {
    const router = useRouter();

    return (
         <View className={" "}>
             <Pressable onPress={
                () => router.push(
                    { 
                        pathname: `/profile/post/${props.postId}`,
                        // re
                    }
                )}>
                 <Image source={props.imageUrl} contentFit={"cover"} style={{width:props.width, height:props.height, opacity:0.8}} />
             </Pressable>
         </View>
     )
}