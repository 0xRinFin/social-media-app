import OnboardingPage, { Slide } from "../../components/Onboarding/OnboardingPage";
import { router } from "expo-router";
import { useState } from "react";

const slides: Slide[] = [
    {
        Title: "What is Linque?",
        Description: "Linque lets you post, explore, and connect with the world around you.",
        image: require("assets/Images/Onboarding/1.png"),
    },
    {
        Title: "Share!",
        Description: "Linque lets you share your personal experiences with others!",
        image: require("assets/Images/Onboarding/3.png"),
    },
    {
        Title: "Browse posts",
        Description: "Linque links you and your friends by sharing posts!",
        image: require("assets/Images/Onboarding/2.png"),
    },
]

const AboutLinque = () => {
    const [index, setIndex] = useState(0);

    return (
        <OnboardingPage
            slides={slides}
            currentIndex={index}
            setCurrentIndex={setIndex}
            buttonText={index === slides.length - 1 ? "Finish" : "Next"}
            onFinish={() => {
                if (index === slides.length - 1) {
                    router.replace("/(auth)/sign-up");
                }
            }}
        />
    );
};

export default AboutLinque;