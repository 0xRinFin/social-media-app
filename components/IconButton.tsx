import FontAwesome6, { FontAwesome6RegularIconName } from "@react-native-vector-icons/fontawesome6"
import { ColorValue, Pressable, StyleProp, TextStyle } from "react-native"

type iconButtonProps = {
    name: FontAwesome6RegularIconName,
    size: number,
    style: "regular" | "solid" | "brand",
    color: ColorValue,

    onPress: () => void
}

const IconButton = (props: iconButtonProps) => {
    return (
        <Pressable onPress={props.onPress}>
            <FontAwesome6 name={props.name} iconStyle={props.style as any} size={props.size} color={props.color}/>
        </Pressable>
    )
}

export default IconButton