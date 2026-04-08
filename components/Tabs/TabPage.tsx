import {PropsWithChildren} from "react";
import {ScrollView, Text, View} from "react-native";
import {Label} from "expo-router/unstable-native-tabs";
import {SafeAreaView} from "react-native-safe-area-context";

type TabProps = {
    title: string;
    className?: string,
} & PropsWithChildren

const TabPage = (props: TabProps) => {
    return (
        <View className="bg-black h-full">
            <SafeAreaView className={""}>
                    <Text className={"text-white text-2xl w-full border-b-1 border-b-neutral-600 bg-neutral-900 pt-16 z-20 p-5 absolute"}>{props.title}</Text>
                    <ScrollView contentContainerClassName={"grow min-h-full"} keyboardShouldPersistTaps="handled">
                        <View className={`pt-16 flex-1 flex flex-col  ${props.className || ""}`}>
                            {props.children}
                        </View>
                    </ScrollView>
            </SafeAreaView>
        </View>
    );
}

export default TabPage;
