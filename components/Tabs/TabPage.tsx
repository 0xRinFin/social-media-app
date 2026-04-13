import {PropsWithChildren, Ref, useCallback, useState} from "react";
import {KeyboardAvoidingView, Platform, RefreshControl, ScrollView, Text, View} from "react-native";
import {Label} from "expo-router/unstable-native-tabs";
import {SafeAreaView} from "react-native-safe-area-context";

export type refreshType = React.Dispatch<React.SetStateAction<boolean>>

export type TabProps = {
    title: string;
    titleVisible?: boolean,
    scrollDisabled?: boolean

    onRefresh?: (setRefreshing: refreshType) => Promise<void>,

    className?: string,
    scrollRef?: Ref<ScrollView>
} & PropsWithChildren

const TabPage = (props: TabProps) => {
    const showTitle = (props.titleVisible != false && props.titleVisible != undefined)

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(async () => {
        if (props.onRefresh != undefined) await props.onRefresh(setRefreshing);
    }, []);

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View className="bg-black h-full">
                <SafeAreaView className={""}>
                    {showTitle && (<Text className={"text-white text-2xl w-full border-b border-b-neutral-600 bg-neutral-900 pt-16 z-20 p-5 absolute"}>{props.title}</Text>)}

                    <ScrollView scrollEnabled={props.scrollDisabled != true} contentContainerClassName={"grow min-h-full"} keyboardShouldPersistTaps="handled" refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                    } ref={props.scrollRef}>
                        <View className={`pt-${showTitle ? 16 : 1} flex-1 flex flex-col  ${props.className || ""}`}>
                            {props.children}
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View>
        </KeyboardAvoidingView>
    );
}

export default TabPage;
