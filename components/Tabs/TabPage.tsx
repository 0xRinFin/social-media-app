import {PropsWithChildren, useCallback, useState} from "react";
import {KeyboardAvoidingView, RefreshControl, ScrollView, Text, View} from "react-native";
import {Label} from "expo-router/unstable-native-tabs";
import {SafeAreaView} from "react-native-safe-area-context";

type TabProps = {
    title: string;
    titleVisible?: boolean,

    onRefresh?: (setRefreshing: React.Dispatch<React.SetStateAction<boolean>>) => Promise<void>,

    className?: string,
} & PropsWithChildren

const TabPage = (props: TabProps) => {
    const showTitle = (props.titleVisible != false && props.titleVisible != undefined)

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(async () => {
        if (props.onRefresh) await props.onRefresh(setRefreshing);
    }, []);

    return (
        <KeyboardAvoidingView>
            <View className="bg-black h-full">
                <SafeAreaView className={""}>
                    {showTitle && (<Text className={"text-white text-2xl w-full border-b-1 border-b-neutral-600 bg-neutral-900 pt-16 z-20 p-5 absolute"}>{props.title}</Text>)}

                    <ScrollView contentContainerClassName={"grow min-h-full"} keyboardShouldPersistTaps="handled" refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                    }>
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
