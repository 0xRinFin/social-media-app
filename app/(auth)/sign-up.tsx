import {Text, View, Alert, KeyboardAvoidingView, ScrollView, Platform} from 'react-native';
import Animated, {FadeInUp} from "react-native-reanimated";
import {WrappedButton} from "../../components/WrappedButton";
import {OnboardingAnimated} from "../../components/Onboarding/OnboardingAnimated";
import {Link, router} from "expo-router";
import {useMemo, useRef, useState} from "react";
import SignInTextField, {SigninTextFieldRef} from "../../components/Signin/SignInTextField";
import SignInCheckBox from "../../components/Signin/SignInCheck";

import {apiCall} from "../utils/apiUtils";

const errorCodes = {
    email_exists: "Имейлът вече съществува.",
    validation_failed: "Невалиден формат на имейл адреса.",
    handle_taken: "Потребителското име вече е заето.",
}

const RequestSignUp = async (
    handle: string,
    display_name: string,
    email: string,
    password: string
) => {
    return await apiCall({
        method: "POST",
        controller:"ProfileController",
        route: "signup",

        body: {
            handle: handle,
            display_name: display_name,
            email: email,
            password: password,
        }
    })
}

const SignUp = () => {
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [agreed, setAgreed] = useState(false);

    const usernameRef = useRef<SigninTextFieldRef | null>(null);
    const displayNameRef = useRef<SigninTextFieldRef | null>(null);
    const emailRef = useRef<SigninTextFieldRef | null>(null);
    const passwordRef = useRef<SigninTextFieldRef>(null);

    const isActive = useMemo(() => {
        return email.trim() !== "" && password.trim() !== "" && username.trim() !== "" && displayName.trim() !== "" && agreed != false;
    }, [email, password, username, displayName, agreed]);

    const showErrorMessage = (errorMessage: string) => {
        Alert.alert("Съжаляваме, възникна грешка!", errorMessage);
    }

    const handleSignUp = async () => {
        const response = await RequestSignUp(username, displayName, email, password);
        // const response = await RequestSignUp("radan", "radan", "radana@gmail.com", "radana");
        if (response === undefined) return;

        if (response.success) {
            Alert.alert("Успех!", "Моля, влез в профила си");
            router.replace("/(auth)/sign-in");
            return;
        }

        const { code } = response;
        console.log(response)
        // error handling \\
        if (code === undefined) return;

        // @ts-ignore, uhhhhh
        let alertString: string = errorCodes[code] || code;
        showErrorMessage(alertString);
    }

  return (
    <KeyboardAvoidingView className={'h-full bg-black'} behavior={Platform.OS === "ios" ? "padding" : "height"}>
       <ScrollView contentContainerClassName={"grow"} keyboardShouldPersistTaps="handled">
           <View className={'flex-1 items-center p-20 w-full pt-40'}>
               <View className={'flex justify-center gap-7'}>
                   <Animated.View entering={FadeInUp.duration(300).springify()}>
                       <Text className="text-white text-4xl">Създай акаунт</Text>
                       <Text className="text-white text-xl font-extralight ">На една стъпка си от това да използваш <Text className={"text-amber-300"}>Linque</Text>!</Text>
                   </Animated.View>

                   <View className={"flex gap-5"}>
                       <SignInTextField iconName={"user"} title={"Потребителско име"} onChangeText={setUsername} ref={usernameRef} onSubmitEditing={displayNameRef.current?.focus}/>
                       <SignInTextField iconName={"tag"} title={"Име за показване"} onChangeText={setDisplayName} ref={displayNameRef} onSubmitEditing={emailRef.current?.focus}/>

                       <SignInTextField iconName={"envelope"}  title={"Имейл"} onChangeText={setEmail} ref={emailRef} onSubmitEditing={passwordRef.current?.focus}/>
                       <SignInTextField iconName={"key"} title={"Парола"} isPassword={true} onChangeText={setPassword} ref={passwordRef}/>
                   </View>

                   <SignInCheckBox label={`Съгласявам се с `} termsHref={"terms"} termsLabel={"Общите условия"} onChange={setAgreed}/>
                   <WrappedButton isActive={isActive} title={"Създай акаунт"} onClick={handleSignUp} extraClassName={"rounded-xl"} isAnimated={true}/>
               </View>

               <View className={"absolute bottom-10"}>
                   <OnboardingAnimated>
                       <Text className={"text-white font-extralight text-center"}>Вече имаш акаунт?</Text>
                       <Link className={"font-light"} href={"sign-in"}>
                           <Text className={"text-amber-300 text-center"}>Влез</Text>
                       </Link>
                   </OnboardingAnimated>
               </View>
           </View>
       </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
