import { Image, ImageSource } from "expo-image"
import { styled } from "nativewind"
import { ReactElement } from "react"
import { ViewProps } from "react-native"

type imageProps = {
    source: ImageSource | string
    className?: ViewProps["className"]
    style?: {}
} 

const PostImage = (props: imageProps) => {
    return (
        <Image
            source={props.source}
            style={{
                width: "100%",
                height: "100%",
                borderRadius: 10,
                borderWidth: 2,
                borderColor: "#2f2f2f",

                ... props.style
            }}
            contentFit="cover"
        />
    )
}

export default styled(PostImage)