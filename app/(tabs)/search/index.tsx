import { supabase } from "@/app/utils/supabase"
import SigninTextField from "@/components/Signin/SignInTextField"
import FollowDisplay from "@/components/Tabs/Follows/FollowDisplay"
import TabPage from "@/components/Tabs/TabPage"
import UserDisplay, { ProfileData } from "@/components/UserDisplay"
import { Image } from "expo-image"
import { useEffect, useState } from "react"
import { Text, View } from "react-native"

const Search = () => {
    const [users, setUsers] = useState<ProfileData[]>([])
    const [searchInput, setSearchInput] = useState("")

    const fetchUsers = async () => {
        const {data} = await supabase.from("profiles").select("*").ilike("handle", `%${searchInput}%`)
        if (data == undefined) return

        setUsers(data)
    }

    useEffect(() => {
        if (searchInput == "") return

        fetchUsers()
    }, [searchInput])


    return (
        <TabPage title="Search Profile" titleVisible={true}>
            <View  className="w-full p-4 flex gap-4">
                <SigninTextField title="" placeholder="Search @handle" onChangeText={setSearchInput} iconName="tag"/>

                <View className="gap-4">
                    <Text className="text-white text-3xl">{users.length} Profiles found</Text>

                    {(users.length == 0) &&
                        (
                        <View className="flex">
                            <Image source={require("assets/Images/not_found.png")} style={{ width:"100%", height: "80%", opacity:0.2} } contentFit="contain" />
                            <Text className="text-white text-center text-4xl font-bold opacity-50 -translate-y-20">NOT FOUND</Text>
                        </View>
                        )
                    }

                    {users.map((user, i) => {
                        return (
                        <FollowDisplay targetId={user.id} key={i}>
                                 
                        </FollowDisplay>)
                    })}
                </View>
            </View>
        </TabPage>
    )
}

export default Search