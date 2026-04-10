import { formatDate } from "@/app/utils/postUtils"
import { Image } from "expo-image"
import { Text, View } from "react-native"

type creatorProps = {
    imageUrl: string, handle: string, displayName: string, postDate: string
}

const PostCreator = (props: creatorProps) => {
    return (
        <View className="flex items-start w-full">
            <View className="flex flex-row items-center gap-2">
                <Image source={props.imageUrl}  style={{ width: 80, height: 80, borderRadius: 50, borderWidth: 2, borderColor: "#2f2f2f" }} />

                <View>
                    <View className="flex flex-row items-center gap-1">
                        <Text className="color-white text-xl font-bold">{props.displayName}</Text>
                        <Text className="color-amber-400 opacity-50">@{props.handle}</Text>
                    </View>

                    <Text className="color-neutral-400">{formatDate(props.postDate)}</Text>
                </View>
            </View>
        </View>
    )
}

export default PostCreator