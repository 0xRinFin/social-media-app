import {Alert, Text, View} from "react-native";
import SignInTextField from "@/components/Signin/SignInTextField";

import {useLocalSearchParams, useRouter} from "expo-router";
import TabPage from "@/components/Tabs/TabPage";
import {WrappedButton} from "@/components/WrappedButton";
import {baseEditButtonStyle, editButtonStyle} from "@/app/(tabs)/profile/editprofile";
import {useContext, useEffect, useState} from "react";
import {apiCall} from "@/app/utils/apiUtils";
import {AuthContext} from "@/app/authentication/use-auth-context";

const details = {
    ["handle"]: "Потребителско име",
    ["display_name"]: "Име за показване"
}

const error_codes = {
    setting_error: "Възникна грешка при запазването на данните",
    handle_taken: "Потребителското име вече съществува"
}

const updateDetailPage = () => {
    const router = useRouter();
    const {profile, session, fetchProfile} = useContext(AuthContext);
    const params = useLocalSearchParams()

    const [active, setActive] = useState<boolean>(false);
    const [newDetailValue, setNewDetailValue] = useState<string>("");

    const detail: string = params.detail as string

    // @ts-ignore
    const detailName = details[detail]
    if (!detail || detailName == undefined) return ( <View><Text>Невалидно име на поле</Text></View> )

    // @ts-ignore
    const requestChangeDetail = () => {
        if (profile == undefined) return; // eror

        (async () => {
            const data = await apiCall({
                method: "POST",
                controller: "ProfileController",
                route: "changeDetail",
                session: session,
                body: {
                    detail: detail,
                    value: newDetailValue
                }
            })
            console.log(data)
            if (data.success) {
                Alert.alert("Успех", `${detailName} беше променено успешно!`)
                fetchProfile()
                router.back()
            }
            else {
                // @ts-ignore
                const errorText = error_codes[data.code]
                Alert.alert("Грешка", errorText)
            }
        })()
    }

    useEffect(() => {
        setActive(newDetailValue != "")
    }, [newDetailValue]);

    return (
        <TabPage title={`Промяна на ${detailName}`} titleVisible={true}>
            <View className="p-4 flex gap-2">
                <SignInTextField title={detailName} onChangeText={setNewDetailValue}></SignInTextField>

                <WrappedButton isActive={active} title={"Промени"} onClick={requestChangeDetail } isAnimated={true} extraClassName={baseEditButtonStyle + " text-black"}></WrappedButton>
                <WrappedButton isActive={true} title={"Отказ"} onClick={() => router.back()} isAnimated={true} extraClassName={editButtonStyle}></WrappedButton>
            </View>
        </TabPage>
    )
}

export default updateDetailPage
