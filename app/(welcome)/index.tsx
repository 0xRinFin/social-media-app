import OnboardingPage, { Slide } from "../../components/Onboarding/OnboardingPage";
import { router } from "expo-router";
import { useState } from "react";

const slides: Slide[] = [
    {
        Title: "Какво е Linque?",
        Description: "Linque ти позволява да публикуваш, разглеждаш и да се свързваш със света около теб.",
        image: require("assets/Images/Onboarding/1.png"),
    },
    {
        Title: "Споделяй!",
        Description: "Linque ти позволява да споделяш личните си преживявания с други хора!",
        image: require("assets/Images/Onboarding/3.png"),
    },
    {
        Title: "Разглеждай публикации",
        Description: "Linque свързва теб и приятелите ти чрез споделени публикации!",
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
            buttonText={index === slides.length - 1 ? "Готово" : "Напред"}
            onFinish={() => {
                if (index === slides.length - 1) {
                    router.replace("/(auth)/sign-up");
                }
            }}
        />
    );
};

export default AboutLinque;
