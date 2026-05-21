import React, {useState} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import {FontAwesome6} from "@react-native-vector-icons/fontawesome6";
import {Link} from "expo-router";

interface CheckBoxProps {
    label: string;
    termsHref?: string;
    termsLabel?: string;

    onChange: (value: boolean) => void;
}

const SignInCheckBox = (props: CheckBoxProps) => {
    const [value, setValue] = useState(false);

    const toggle = (value: boolean) => {
        setValue(value);
        props.onChange(value);
    };

    return (
        <View>
            <View className={"flex flex-row items-center gap-3"}>
                <TouchableOpacity onPress={() => toggle(!value)}>
                    <View className={`h-8 aspect-square border-2 border-neutral-500 rounded-md justify-center items-center ${value && "bg-neutral-500"}`}>
                        <FontAwesome6 name={"check"} iconStyle={"solid"} size={16} color={"#000000"}></FontAwesome6>
                    </View>
                </TouchableOpacity>

                <View className={"flex flex-row flex-wrap flex-1"}>
                    <Text className={"text-neutral-500"} onPress={() => toggle(!value)}>
                        {props.label}
                    </Text>
                    {props.termsHref && props.termsLabel && (
                        <Link href={props.termsHref}>
                            <Text className={"text-amber-300"}>{props.termsLabel}</Text>
                        </Link>
                    )}
                </View>
            </View>
        </View>
    );
};
export default SignInCheckBox;
