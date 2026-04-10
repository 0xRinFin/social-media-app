import { formatDate } from "@/app/utils/postUtils"
import { Image } from "expo-image"
import { Text, View } from "react-native"

const PostComment = (imageUrl: string, handle: string, displayName: string, postDate: string) => {
    return (
         <View>
            <View className="flex flex-row items-center gap-2">
                <Image source={imageUrl}  style={{ width: 50, height: 50, borderRadius: 50, borderWidth: 1, borderColor: "#2f2f2f" }} />

                <View>
                    <View className="flex flex-row items-center gap-1">
                        <Text className="color-white text-xl font-bold">{displayName}</Text>
                        <Text className="color-amber-400 opacity-50">@{handle}</Text>
                    </View>

                    <Text className="color-neutral-400">{formatDate(postDate)}</Text>
                </View>
            </View>
        </View>
    )
}

export default PostComment