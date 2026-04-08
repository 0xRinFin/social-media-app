import React, {useEffect, useMemo, useState} from "react";
import {Text, Touchable, TouchableOpacity, View} from "react-native";
import {FontAwesome6} from "@react-native-vector-icons/fontawesome6";

interface CheckBoxProps {
    label: string;

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
            <TouchableOpacity onPress={() => toggle(!value)} className={"flex flex-row items-center gap-3"}>
                <View className={`h-8 aspect-square border-2 border-neutral-500 rounded-md justify-center items-center ${value && "bg-neutral-500"}`}>
                    <FontAwesome6 name={"check"} iconStyle={"solid"} size={16} color={"#000000"}></FontAwesome6>
                </View>

                <Text className={"text-neutral-500"}>
                    {props.label}
                </Text>
            </TouchableOpacity>
        </View>
    );
};
export default SignInCheckBox;