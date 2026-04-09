import {Alert, Text, View} from "react-native";
import SignInTextField from "@/components/Signin/SignInTextField";

import {useLocalSearchParams, useRouter} from "expo-router";
import TabPage from "@/components/Tabs/TabPage";
import {WrappedButton} from "@/components/WrappedButton";
import {baseEditButtonStyle, editButtonStyle} from "@/app/(tabs)/profile/editprofile";
import {useContext, useEffect, useState} from "react";
import {apiFetch} from "@/app/utils/apiFetch";
import {AuthContext} from "@/app/authentication/use-auth-context";

const details = {
    ["handle"]: "Handle",
    ["display_name"]: "Display Name"
}

const error_codes = {
    setting_error: "There was an error setting the data",
    handle_taken: "Handle already exists"
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
    if (!detail || detailName == undefined) return ( <View><Text>Invalid detail name</Text></View> )

    // @ts-ignore
    const requestChangeDetail = () => {
        if (profile == undefined) return; // eror

        (async () => {
            const res = await apiFetch("/api/ProfileController/changeDetail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': session.access_token
                },

                body: JSON.stringify({
                    detail: detail,
                    value: newDetailValue
                })

            })

            const data = await res.json()
            console.log(data)
            if (data.success) {
                Alert.alert("Success", `Successfully changed your ${detailName}!`)
                fetchProfile()
                router.back()
            }
            else {
                // @ts-ignore
                const errorText = error_codes[data.code]
                Alert.alert("Error", errorText)
            }
        })()
    }

    useEffect(() => {
        setActive(newDetailValue != "")
    }, [newDetailValue]);

    return (
        <TabPage title={`Change ${detailName}`} titleVisible={true}>
            <View className="p-4 flex gap-2">
                <SignInTextField title={detailName} onChangeText={setNewDetailValue}></SignInTextField>

                <WrappedButton isActive={active} title={"Change"} onClick={requestChangeDetail } isAnimated={true} extraClassName={baseEditButtonStyle + " text-black"}></WrappedButton>
                <WrappedButton isActive={true} title={"Cancel"} onClick={() => router.back()} isAnimated={true} extraClassName={editButtonStyle}></WrappedButton>
            </View>
        </TabPage>
    )
}

export default updateDetailPage