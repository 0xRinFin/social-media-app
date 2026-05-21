import {ActivityIndicator, Text, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TabPage from "@/components/Tabs/TabPage";
import {WrappedButton} from "@/components/WrappedButton";
import { baseButtonStyle } from '../profile/editprofile';
import { apiCall } from '@/app/utils/apiUtils';
import UserDisplay from '@/components/UserDisplay';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/app/utils/supabase';
import { useAuthContext } from '@/app/authentication/use-auth-context';

type ConversationData = {
    id: string,

    user_a: string,
    user_b: string,

    created_at: string,
}

const Messages = () => {
    const router = useRouter()

    const {profile} = useAuthContext()
    const [conversationsArray, setConversationsArray] = useState<any>([])

    const [isLoading, setIsLoading] = useState(false)
    const [refreshCount, setRefreshCount] = useState(0)

    const fetchConversations = async () => {
        if (profile == undefined) return

        const { data: senderConversations } = await supabase.from("conversations").select("*").eq("user_a", profile.id);
        const { data: recipientConversations } = await supabase.from("conversations").select("*").eq("user_b", profile.id);
        if (senderConversations == null || recipientConversations == null) return

        const joinedConversations = [... recipientConversations, ... senderConversations]
        setConversationsArray(joinedConversations)
    }

    const refreshMessages = async () => {
        setRefreshCount(past => past + 1)
        setIsLoading(false)
    }

    const loadMessageData = async () => {
        setIsLoading(true)
        await fetchConversations()
        setIsLoading(false)
    }

    useEffect(() => {
        loadMessageData()
    }, [profile, refreshCount])
    
    return (
        <TabPage onRefresh={refreshMessages} title={"Messages"} titleVisible={true} className={"items-center flex h-full"}>
            {(isLoading) ?
                (<ActivityIndicator size="large" color="#ffb900" className={`absolute`} />)
            : (
            <View className="w-[95vw] mt-4 flex gap-2">
            {
                conversationsArray.map((conversationData: ConversationData, i: number) => {
                const targetId = (profile.id != conversationData.user_a) ? conversationData.user_a : conversationData.user_b
                    return (<UserDisplay targetId={targetId} onClick={() => router.push(`messages/${conversationData.id}?targetId=${targetId}`)} key={i}/>)
                })
            }

            </View>
            )}

        </TabPage>
    );
};

export default Messages;
