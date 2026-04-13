import FontAwesome6, { FontAwesome6RegularIconName } from "@react-native-vector-icons/fontawesome6"
import { ActivityIndicator, ColorValue, Pressable, StyleProp, TextStyle } from "react-native"

type iconButtonProps = {
    name: FontAwesome6RegularIconName,
    size: number,
    style: "regular" | "solid" | "brand",
    color: ColorValue,
    loading?: boolean,

    onPress: () => void
}

const IconButton = (props: iconButtonProps) => {
    
    if (props.loading)
        return (<ActivityIndicator size="large" color="#ffb900" />)

    return (
        <Pressable onPress={props.onPress}>
            <FontAwesome6 name={props.name} iconStyle={props.style as any} size={props.size} color={props.color}/>
        </Pressable>
    )
}

export default IconButton