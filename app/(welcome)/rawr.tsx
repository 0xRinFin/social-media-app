import OnboardingPage from "../../components/Onboarding/OnboardingPage";

const WelcomePage = () => {
    return (
       <OnboardingPage
           Title={"Share!"}
           Description={"Linque lets you share your personal experiences with others!"}
           currentIndex={1}

           image={require("../../assets/Images/Onboarding/3.png")}
       ></OnboardingPage>
    )
};

export default WelcomePage;