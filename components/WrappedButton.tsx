import Animated, {FadeInUp} from "react-native-reanimated";
import {Pressable, Text} from "react-native";
import {OnboardingAnimated} from "./Onboarding/OnboardingAnimated"

export const WrappedButton = (props: { isActive: boolean, title: string, onClick: () => void, isAnimated: boolean, extraClassName?: string}) => {

    return (
        <OnboardingAnimated duration={props.isAnimated ? 100 : -100}>
            <Pressable onPress={ props.onClick } className={"items-center"}>
                <Text className={`text-2xl text-black font-medium transition-all duration-700 ${props.isActive ? "bg-amber-300" : "bg-[#1F1F1F]" } w-100 text-center p-4 font-sans rounded-full ${props.extraClassName}` }>{props.title}</Text>
            </Pressable>
        </OnboardingAnimated>
    );
};
