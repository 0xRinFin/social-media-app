import {Alert, Keyboard, Text, TouchableWithoutFeedback, View} from 'react-native';
import {Link} from "expo-router";
import {WrappedButton} from "../../components/WrappedButton";
import Animated, {FadeInUp} from "react-native-reanimated";
import {OnboardingAnimated} from "../../components/Onboarding/OnboardingAnimated";
import {useRef, useState, useMemo} from "react";
import SigninTextField, {SigninTextFieldRef} from "../../components/Signin/SignInTextField";

import { supabase as supabaseClient } from "../utils/supabase"

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const emailRef = useRef<SigninTextFieldRef>(null);
    const passwordRef = useRef<SigninTextFieldRef>(null);

    const isActive = useMemo(() => {
        return email.trim() !== "" && password.trim() !== "";
    }, [email, password])

    const requestSignIn = async () => {
        const {data, error} = await supabaseClient.auth.signInWithPassword({email, password})
        console.log(error)
        if (error)
            return Alert.alert("Грешка!", "Възникна неочаквана грешка")
    }

    // const {data, error} = await supabaseClient.auth.signInWithPassword({email: "radan@gmail.com", password: "radana"})

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className={'h-full items-center justify-center bg-black p-10'}>
                <View className={'flex justify-center gap-15'}>
                    <Animated.View entering={FadeInUp.duration(300).springify()}>
                        <Text className="text-white text-4xl">Готов ли си да се присъединиш?</Text>
                        <Text className="text-white text-xl font-extralight ">Влез отново в <Text className={"text-amber-300"}>Linque</Text> и продължи да чатиш с приятелите си.</Text>
                    </Animated.View>


                    <View className={"flex gap-5"}>
                        <SigninTextField iconName={"envelope"} title={"Имейл"} onChangeText={setEmail} onSubmitEditing={passwordRef.current?.focus}/>
                        <SigninTextField canReset={true} iconName={"key"} title={"Парола"} isPassword={true} onChangeText={setPassword} ref={passwordRef}/>
                    </View>

                    <WrappedButton isActive={isActive} title={"Вход"} onClick={requestSignIn} extraClassName={"rounded-xl"} isAnimated={true}/>
                </View>

                <View className={"absolute bottom-10"}>
                    <OnboardingAnimated>
                        <Text className={"text-white font-extralight text-center"}>Още нямаш регистрация?</Text>
                        <Link className={"font-light"} href={"sign-up"}>
                            <Text className={"text-amber-300 text-center"}>Създай акаунт</Text>
                        </Link>
                    </OnboardingAnimated>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
};

export default SignIn;
