import {useMemo, useRef, useState} from "react";
import {Keyboard, Text, TouchableWithoutFeedback, View} from "react-native";
import {Link} from "expo-router";
import TabPage from "../../components/Tabs/TabPage";
import {WrappedButton} from "../../components/WrappedButton";
import SignInTextField, {SigninTextFieldRef} from "../../components/Signin/SignInTextField";
import {OnboardingAnimated} from "../../components/Onboarding/OnboardingAnimated";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const passwordRef = useRef<SigninTextFieldRef>(null);

    const isActive = useMemo(() => {
        return email.trim() !== "" && password.trim() !== "";
    }, [email, password]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className={"flex-1 bg-black"}>
                <TabPage title={"Forgot Password"} titleVisible={false} className={"items-center justify-center p-10"}>
                    <View className={"flex w-full gap-15"}>
                        <OnboardingAnimated>
                            <View>
                                <Text className={"text-white text-4xl"}>Забравена парола?</Text>
                                <Text className={"text-white text-xl font-extralight"}>
                                    Въведи имейла и паролата си за да я смениш.
                                </Text>
                            </View>
                        </OnboardingAnimated>

                        <View className={"flex gap-5"}>
                            <SignInTextField
                                iconName={"envelope"}
                                title={"Имейл"}
                                onChangeText={setEmail}
                                onSubmitEditing={() => passwordRef.current?.focus()}
                            />
                            <SignInTextField
                                ref={passwordRef}
                                iconName={"key"}
                                title={"Парола"}
                                isPassword={true}
                                onChangeText={setPassword}
                            />
                        </View>

                        <WrappedButton
                            isActive={isActive}
                            title={"Смени парола"}
                            onClick={() => {}}
                            extraClassName={"rounded-xl"}
                            isAnimated={true}
                        />
                    </View>

                    <View className={"absolute bottom-10"}>
                        <OnboardingAnimated>
                            <Link className={"font-light"} href={"sign-in"}>
                                <Text className={"text-amber-300 text-center"}>Обратно</Text>
                            </Link>
                        </OnboardingAnimated>
                    </View>
                </TabPage>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default ForgotPassword;
