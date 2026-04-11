import FontAwesome6 from "@react-native-vector-icons/fontawesome6"
import { ActivityIndicator, View } from "react-native"

type UploadableIndicator = {
    visible: boolean,
    loading: boolean,
}

const UploadableIndicator = (props: UploadableIndicator) => {
    return (
         <View className={`z-30 w-full h-full absolute flex justify-center items-center ${!props.visible && "hidden"} `}>
        
            <ActivityIndicator size="large" color="#ffb900" className={`absolute ${!props.loading && "hidden"}`} />

            {!props.loading && (<FontAwesome6 name={"image"} size={50} color={"white"}  />)}
        </View>
    )
}

export default UploadableIndicator