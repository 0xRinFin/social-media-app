import {Text, View, Alert, KeyboardAvoidingView, ScrollView, Platform} from 'react-native';
import Animated, {FadeInUp} from "react-native-reanimated";
import {WrappedButton} from "../../components/WrappedButton";
import {OnboardingAnimated} from "../../components/Onboarding/OnboardingAnimated";
import {Link, router} from "expo-router";
import {useMemo, useRef, useState} from "react";
import SignInTextField, {SigninTextFieldRef} from "../../components/Signin/SignInTextField";
import SignInCheckBox from "../../components/Signin/SignInCheck";

import {apiFetch} from "../utils/apiFetch";

const errorCodes = {
    email_exists: "Email already exists.",
    validation_failed: "Invalid email address format.",
    handle_taken: "Username already taken.",
}

const RequestSignUp = async (
    handle: string,
    display_name: string,
    email: string,
    password: string
) => {
    return await apiFetch("/api/ProfileController/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            handle: handle,
            display_name: display_name,
            email: email,
            password: password,
        })

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
        Alert.alert("Sorry, there was an error!", errorMessage);
    }

    const handleSignUp = async () => {
        const response = await RequestSignUp(username, displayName, email, password);
        // const response = await RequestSignUp("radan", "radan", "radan@gmail.com", "radana");
        if (response === undefined) return;

        if (response.status === 201) {
            Alert.alert("Success!", "Please, sign in");
            router.replace("/(auth)/sign-in");

            return;
        }

        const parsedData = await response.json();
        const { __isAuthError, code } = parsedData;
        console.log(parsedData)
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
                       <Text className="text-white text-4xl">Create an account</Text>
                       <Text className="text-white text-xl font-extralight ">You are one step away from using <Text className={"text-amber-300"}>Linque</Text>!</Text>
                   </Animated.View>

                   <View className={"flex gap-5"}>
                       <SignInTextField iconName={"user"} title={"Username"} onChangeText={setUsername} ref={usernameRef} onSubmitEditing={displayNameRef.current?.focus}/>
                       <SignInTextField iconName={"tag"} title={"Display Name"} onChangeText={setDisplayName} ref={displayNameRef} onSubmitEditing={emailRef.current?.focus}/>

                       <SignInTextField iconName={"envelope"}  title={"E-mail"} onChangeText={setEmail} ref={emailRef} onSubmitEditing={passwordRef.current?.focus}/>
                       <SignInTextField iconName={"key"} title={"Password"} isPassword={true} onChangeText={setPassword} ref={passwordRef}/>
                   </View>

                   <SignInCheckBox label={`I agree to the Terms Of Services`} onChange={setAgreed}/>
                   <WrappedButton isActive={isActive} title={"Create Account"} onClick={handleSignUp} extraClassName={"rounded-xl"} isAnimated={true}/>
               </View>

               <View className={"absolute bottom-10"}>
                   <OnboardingAnimated>
                       <Text className={"text-white font-extralight text-center"}>Already have an account?</Text>
                       <Link className={"font-light"} href={"sign-in"}>
                           <Text className={"text-amber-300 text-center"}>Sign in</Text>
                       </Link>
                   </OnboardingAnimated>
               </View>
           </View>
       </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
