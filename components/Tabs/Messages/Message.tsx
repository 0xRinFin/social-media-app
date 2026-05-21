import { fetchProfileImage, formatTime } from "@/app/utils/postUtils"
import UserDisplay, { ProfileData } from "@/components/UserDisplay"
import { Image } from "expo-image"
import { Text, View } from "react-native"

export type MessageData = {
    id: string,

    conversation_id: string,
    sender_id: string,

    content: string,
    image_url?: string,

    created_at: string,
}


const Message = (props: {isSelf: boolean, messageData: MessageData, userData: ProfileData, avatar_url: string}) => {
    const reverseString = props.isSelf ? "flex-row-reverse" : "flex-row"

    return (
        <View className={`flex ${reverseString} gap-2 w-full items-start`}>
            <Image source={props.avatar_url} style={{height: 50, width:50, borderRadius:50, borderWidth:1, borderColor:"#2f2f2f"}}/>

            <View className={`grow flex gap-2 ${props.isSelf ? "items-end" : "items-start" } `}>
                <View className={`flex ${reverseString} justify-between`}>
                    <View className={`flex ${reverseString} gap-1 grow`}>
                        <Text className="text-white text-md font-bold">{props.userData.display_name}</Text>
                        <Text className="text-amber-400">@{props.userData.handle}</Text>
                    </View>

                    <Text className="text-neutral-500">{formatTime(props.messageData.created_at)}</Text>
                </View>

                <Text className={`${props.isSelf ? "bg-amber-400" : "bg-neutral-400"} p-2 text-lg rounded-lg wrap-normal max-w-[85%] font-medium`}>{props.messageData.content}</Text>
            </View>
        </View>
    )
}

export default Message