import {KeyboardAvoidingView, Pressable, Text, TextInput, View, ViewProps} from 'react-native';
import { FontAwesome6, FontAwesome6SolidIconName } from '@react-native-vector-icons/fontawesome6';
import {Link} from "expo-router";
import {OnboardingAnimated} from "../Onboarding/OnboardingAnimated";
import {useRef, useState, forwardRef, useImperativeHandle} from "react";

export type SigninTextFieldRef = {
    focus: () => void;
    blur: () => void;
};

export type SignInTextfieldProps = {
    placeholder?: string,
    title: string,
    isPassword?: boolean,
    canReset?: boolean,
    onChangeText?: (text: string) => void,
    onSubmitEditing?: () => void,
    value?: string,
    disabled?: boolean,
    iconName?: FontAwesome6SolidIconName,

    className?: ViewProps["className"]
} 

const SigninTextField = forwardRef<SigninTextFieldRef, SignInTextfieldProps>((props, ref) => {
    const [secure, setSecure] = useState(props.isPassword);
    const inputRef = useRef<TextInput>(null);

    useImperativeHandle(ref, () => ({
        focus: () => inputRef.current?.focus(),
        blur: () => inputRef.current?.blur(),
    }));

    let padding = "";
    if (props.isPassword) padding += "pr-12"
    if (props.iconName) padding += " pl-14"

    return (
        <OnboardingAnimated className={props.className}>
            <View className={"flex gap-3 w-full"}>
                {props.title !== "" && 
                (
                <View className={"flex flex-row justify-between"}>
                    <Text className={"text-white text-md"}>{props.title}</Text>
                    {(props.isPassword && props.canReset) && (
                        <Link href={"forgot-password"}>
                            <Text className={"color-amber-300 underline underline-offset-4"}>Забравена парола?</Text>
                        </Link>
                    )}
                </View>
                )}

                <View className="">
                    {props.isPassword && (
                        <Pressable className={"absolute z-2 justify-center items-center h-full right-2 w-12"} onPress={() => setSecure(!secure)}>
                            <FontAwesome6 name={secure ? "eye" : "eye-slash"} iconStyle={"solid"} color={"#505050"} size={16} />
                        </Pressable>
                    )}

                    {props.iconName && (
                        <Pressable className={"absolute z-2 justify-center items-center h-full left-2 w-12"} onPress={() => setSecure(!secure)}>
                            <FontAwesome6 name={props.iconName} iconStyle={"solid"} color={"#505050"} size={16} />
                        </Pressable>
                    )}

                    <TextInput
                        ref={inputRef}
                        returnKeyType={props.onSubmitEditing ? "next" : "done"}
                        onSubmitEditing={props.onSubmitEditing}
                        onChangeText={props.onChangeText ?? (() => {})}
                        className={`min-h-12 text-neutral-400 h-14 bg-black border p-4 w-full rounded-xl border-[#202020] ${props.disabled && "bg-neutral-900"}` + padding}
                        secureTextEntry={secure}
                        editable={!props.disabled}
                        value={props.value}
                        placeholder={props.placeholder}
                        // multiline={true}
                    />
                </View>
            </View>
        </OnboardingAnimated>
    )
});

export default SigninTextField;
