import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
// import Animated from "react-native-reanimated";

const HeartAnimation = ({ visible, onComplete }: { visible: boolean; onComplete: () => void }) => {
    const scale = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!visible) return;

        scale.setValue(0);
        opacity.setValue(1);

        Animated.sequence([
            Animated.spring(scale, {
                toValue: 1.3,
                useNativeDriver: true,
                speed: 40,
                bounciness: 10,
            }),

            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 350,
                    useNativeDriver: true,
                }),
                Animated.timing(scale, {
                    toValue: 0.6,
                    duration: 350,
                    useNativeDriver: true,
                }),
            ]),
        ]).start(() => onComplete());
    }, [visible]);

    if (!visible) return null;

    return (
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <Animated.View style={{ transform: [{ scale }], opacity }}>
                <FontAwesome6 iconStyle="solid" name="heart" size={100} color={"#ffb900"} />
            </Animated.View>
        </View>
    );
};

export default HeartAnimation