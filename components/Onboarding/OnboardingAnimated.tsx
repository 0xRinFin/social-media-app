import {ReactNode} from "react";
import Animated, {FadeInUp} from "react-native-reanimated";
import { styled } from "nativewind";

type OnboardingAnimatedProps = {
    children: ReactNode,
    duration?: number,
    delay?: number
}

const OnboardingAnimatedBase: React.FC<OnboardingAnimatedProps> = (props: OnboardingAnimatedProps) => {
   return (
       <Animated.View
           {...{entering:FadeInUp.duration(props.duration ? props.duration : 100).delay(props.delay ? props.delay : 100) }}
       >
           {props.children}
       </Animated.View>
   )
}

export const OnboardingAnimated = styled(OnboardingAnimatedBase);