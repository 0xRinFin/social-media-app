import { Image } from "expo-image";
import {Alert, ScrollView, StyleSheet, Text, View} from "react-native";
import { useContext, useEffect, useState, useCallback } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AuthContext } from "../../authentication/use-auth-context";
import { supabase } from "@/app/utils/supabase";
import TabPage from "@/components/Tabs/TabPage";
import { WrappedButton } from "@/components/WrappedButton";
import { ProfileImage } from "@/components/Tabs/Profile/ProfileImage";
import {apiFetch} from "@/app/utils/apiFetch";
import { defaultIcon, fetchProfileImage } from "@/app/utils/postUtils";

type postData = {
    content: string,
    created_at: string,
    id: string,
    image_url: string
} 

const Viewprofile = () => {
    const router = useRouter();
    const { profile, session } = useContext(AuthContext);
    const params = useLocalSearchParams<{ handle: string }>();

    const [isLoading, setIsLoading] = useState(false);

    const [targetProfile, setTargetProfile] = useState<typeof profile | null>(null);
    const [isSelf, setIsSelf] = useState(false);
    const [reloadCounter, setReloadCounter] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);
    const [posts, setPosts] = useState<any>([]);

    const [name, setName] = useState("Viewprofile");
    const [handle, setHandle] = useState("Viewprofile");
    const [description, setDescription] = useState("");
    const [profileImageUri, setProfileImageUri] = useState<string | null>(defaultIcon);

    const requestFollow = async () => {
        if (!session) return

        setIsLoading(true);
        const res = await apiFetch("/api/ProfileController/follow", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': session.access_token
            },

            body: JSON.stringify({handle})
        })

        setIsLoading(false);
        setReloadCounter(prev => prev + 1)
    }

    const checkFollowing = async () => {
        if (isSelf) return

        console.log("follower", profile.id)
        console.log("following", targetProfile.id)
        const {data} = await supabase.from("follows").select("*").eq("follower_id", profile.id).eq("following_id", targetProfile.id).single();

        setIsFollowing(data != null)
    }

    const fetchProfileData = useCallback(async () => {
        const profileHandle = params.handle || profile?.handle;

        if (!profileHandle) return;

        const { data, error } = await supabase.from("profiles").select("*").eq("handle", profileHandle).single();

        if (error) {
            console.error("Error fetching profile:", error);
            setTargetProfile(null);
            return;
        }

        setTargetProfile(data);
    }, [params.handle, profile?.handle, profile]);

    const fetchProfilePosts = async () => {
        if (targetProfile == undefined) return

        const {data} = await supabase.from("posts").select("*").eq("user_id", targetProfile.id);
        setPosts(data)
    }

    const loadProfileImage = useCallback(async (id?: string) => {
        const uri = await fetchProfileImage(id);
        setProfileImageUri(uri);
    }, []);

    useEffect(() => {
        if (!targetProfile) return;

        checkFollowing()
        fetchProfilePosts()

        setName(targetProfile.display_name);
        setHandle(targetProfile.handle);
        setDescription(targetProfile.description);
        setIsSelf(targetProfile.id === profile?.id);

        loadProfileImage(targetProfile.id);
    }, [targetProfile, profile?.id, loadProfileImage]);

    useEffect(() => {
        fetchProfileData();
    }, [fetchProfileData, reloadCounter, profile]);

    const refreshPage = async (setRefreshing: React.Dispatch<React.SetStateAction<boolean>>) => {
        setRefreshing(true);
        setReloadCounter(prev => prev + 1)
        setRefreshing(false)
    }

    return (
        <TabPage title="Index View" onRefresh={refreshPage} className={""}>
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="border-b-2 border-b-neutral-800 m-4 pb-4 gap-2">
                    <View className="flex flex-row items-center gap-4 p-2">
                        <Image
                            source={profileImageUri}
                            style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: "#2f2f2f" }}
                        />
                        <View className="flex gap-4">
                            <View className="flex flex-row gap-2 items-center">
                                <Text className="text-4xl color-white font-bold">{name}</Text>
                                <Text className="text-2xl color-amber-400 opacity-70">@{handle}</Text>
                            </View>
                            <View className="flex flex-row gap-4">
                                <Text className="text-xl color-neutral-400 font-light">
                                    Followers: <View className="bg-amber-400 rounded-md translate-y-[6px] p-[1px]"><Text className="font-bold">123</Text></View>
                                </Text>
                                <Text className="text-xl color-neutral-400 font-light">
                                    Following: <View className="bg-amber-400 rounded-md translate-y-[6px] p-[1px]"><Text className="font-bold">123</Text></View>
                                </Text>
                            </View>
                        </View>
                    </View>
                    {description ? <Text className="color-white mb-6">{description}</Text> : null}
                    <WrappedButton
                        isActive
                        title={isSelf ? "Edit Profile" : (isFollowing ? "Following" : "Follow") }
                        isLoading={isLoading}
                        onClick={() => {
                            if (isSelf)
                                router.push("profile/editprofile")
                            else // follow
                                requestFollow()
                        }}
                        isAnimated
                        extraClassName={`w-[90vw] text-md rounded-xl p-[10px] ${ isFollowing && "bg-neutral-600" }`}
                    />
                </View>

                <View className="flex flex-row flex-wrap gap-1 mt-1 w-full items-center">
                    {posts.map((postData: postData, i: number) => (
                        <ProfileImage key={i} height={100} width={100} postId={postData.id} imageUrl={postData.image_url}/>
                    ))}
                </View>
            </ScrollView>
        </TabPage>
    );
};

export default Viewprofile;