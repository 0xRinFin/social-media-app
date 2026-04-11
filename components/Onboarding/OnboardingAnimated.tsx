import {ReactNode} from "react";
import Animated, {FadeInUp} from "react-native-reanimated";
import { styled } from "nativewind";
import { View, ViewProps } from "react-native";
import { Text } from "react-native";

const StyledAnimatedView = styled(Animated.View)

type OnboardingAnimatedProps = {
    children: ReactNode,
    duration?: number,
    delay?: number,
    style?: {}
    className?: ViewProps["className"]
}

const OnboardingAnimatedBase: React.FC<OnboardingAnimatedProps> = (props: OnboardingAnimatedProps) => {
   return (
       <StyledAnimatedView
            style={props.style}

           {...{entering:FadeInUp.duration(props.duration ? props.duration : 100).delay(props.delay ? props.delay : 100) }}
       >
           {props.children}
       </StyledAnimatedView>
   )
}

export const OnboardingAnimated = styled(OnboardingAnimatedBase);