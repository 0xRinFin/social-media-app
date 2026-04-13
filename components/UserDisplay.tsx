import { Pressable, Text, View } from "react-native"
import { Image } from "expo-image"
import { PropsWithChildren, useContext, useEffect, useState } from "react"
import { supabase } from "@/app/utils/supabase"
import { fetchProfileImage } from "@/app/utils/postUtils"
import { usePathname, useRouter } from "expo-router"

export type ProfileData = {
    id: string,
    handle: string,
    display_name: string,
    description: string,
    avatar_url?: string
}

const UserDisplay = (props: {targetId: string, onClick?: () => void, userData?: ProfileData} & PropsWithChildren) => {
    const router = useRouter()
    const pathName = usePathname()
    const routeOpened = pathName.split("/")[1]
    
    const [handle, setHandle] = useState("")
    const [display, setDisplay] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    
    const [profileData, setProfileData] = useState<any>(undefined)

    const fetchProfileData = async () => {
        if (props.userData) return setProfileData(props.userData)

        const {data, success} = await supabase.from("profiles").select("*").eq("id", props.targetId).single()    
        if (!success)
            return

        setProfileData(data)
    }

    const renderProfile = async () => {
        if (profileData == undefined) return

        
        const image = await fetchProfileImage(props.targetId)
        setImageUrl(image)
        
        setHandle(profileData.handle)
        setDisplay(profileData.display_name)
    }

    useEffect(() => {
        renderProfile()
    }, [profileData])

    useEffect(() => {
        fetchProfileData()
    }, [fetchProfileData])

    return (
        <View className="w-full h-24 border border-neutral-800 rounded-xl flex flex-row justify-between items-center p-2">
          <Pressable onPress={props.onClick || (() => router.push(`${routeOpened}/profile/${handle}`))} className="grow">
              <View className="flex flex-row gap-3">
                <Image source={imageUrl} style={{ width:70, height: 70, borderRadius:100, borderWidth:1, borderColor:"#2f2f2f" }}/>

                <View className="flex items-start gap-1 justify-center">
                    <Text className="color-white text-xl font-bold">{display}</Text>
                    <Text className="color-amber-400 opacity-50">@{handle}</Text>
                </View>
            </View>
          </Pressable>

           {props.children}
        </View>
    )
}

export default UserDisplay