import OnboardingPage from "../../components/Onboarding/OnboardingPage";

const WelcomePage = () => {
    return (
       <OnboardingPage
           Title={"Browse posts"}
           Description={"Linque links you and your friends by sharing posts!"}
           buttonText={"Finish"}
           currentIndex={2}

           image={require("../../assets/Images/Onboarding/2.png")}
       ></OnboardingPage>
    )
};

export default WelcomePage;