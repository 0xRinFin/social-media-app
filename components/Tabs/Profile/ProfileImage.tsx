import {Image} from "expo-image";
import {Pressable, View} from "react-native";

type imageProps = {
    height: number;
    width: number;
}

export const ProfileImage = (props: imageProps) => {
 return (
     <View className={" "}>
         <Pressable>
             <Image source={"https://picsum.photos/1000/1000"} contentFit={"cover"} style={{width:props.width, height:props.height, opacity:0.8}} />
         </Pressable>
     </View>
 )
}