import Animated, {FadeInUp} from "react-native-reanimated";
import {ActivityIndicator, Pressable, Text, View, ViewProps} from "react-native";
import {OnboardingAnimated} from "./Onboarding/OnboardingAnimated"

export const WrappedButton = (props: { isLoading?: boolean, isActive: boolean, title: string, onClick: () => void, isAnimated: boolean, extraClassName?: string}) => {
    const callback = async () => {
        if (!props.isActive) return;

        props.onClick()
    }

    return (
        <OnboardingAnimated duration={props.isAnimated ? 100 : -100}>
            <Pressable onPress={callback} className={"items-center"}>
                <View className={`${!props.isLoading && "hidden"} absolute h-full w-full justify-center items-center z-20`}>
                    <ActivityIndicator size="large" color="#000000" />
                </View>

                <Text className={`text-2xl text-black font-medium transition-all duration-700 ${props.isActive ? "bg-amber-300" : "bg-[#1F1F1F]" } w-100 text-center p-4 font-sans rounded-full ${props.extraClassName}` }>{!props.isLoading && props.title}</Text>
            </Pressable>
        </OnboardingAnimated>
    );
};
