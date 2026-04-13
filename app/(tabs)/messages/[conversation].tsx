import {ActivityIndicator, ScrollView, Text, View} from 'react-native';
import TabPage from "@/components/Tabs/TabPage";
import UserDisplay from '@/components/UserDisplay';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuthContext } from '@/app/authentication/use-auth-context';
import { supabase } from '@/app/utils/supabase';
import SigninTextField from '@/components/Signin/SignInTextField';
import IconButton from '@/components/IconButton';
import { apiCall } from '@/app/utils/apiUtils';
import Message, { MessageData } from '@/components/Tabs/Messages/Message';
import { fetchProfileImage } from '@/app/utils/postUtils';


// for the sake of simplicity, userA here will always be the local user.
const Conversation = () => {
    const params = useLocalSearchParams<{conversation:string, targetId: string}>()
    const {profile, session} = useAuthContext()

    const [userA, setUserA] = useState<string>("")
    const [userB, setUserB] = useState<string>("")

    const [userAData, setUserAData] = useState<any>(undefined)
    const [userBData, setUserBData] = useState<any>(undefined)

    const [userAAvatar, setUserAAvatar] = useState<string>("")
    const [userBAvatar, setUserBAvatar] = useState<string>("")

    const [messageArray, setMessageArray] = useState<any>([])
    const [message, setMessage] = useState<string>("")
    
    const [isSendLoading, setIsSendLoading] = useState(false)

    const resolveParameters = () => {
        if (profile == undefined) return
        if (params.targetId == undefined) return
    
        setUserA(profile.id)
        setUserB(params.targetId)
    }

    const fetchUserData = async () => {
        if (userB == "") return

        const { data, error } = await supabase.from("profiles").select("*").eq("id", userB).single();
        if (error)
            return

        setUserAData(profile)
        setUserBData(data)
    }

    const fetchUserAvatars = async () => {
        if (userB == "") return

        let userBImage = await fetchProfileImage(userB)
        setUserBAvatar(userBImage)

        let userAImage = await fetchProfileImage(userA)
        setUserAAvatar(userAImage)
    }

    const fetchMessages = async () => {
        if (params.conversation == undefined) return

        const { data, error } = await supabase.from("messages").select("*").eq("conversation_id", params.conversation).order('created_at', { ascending: true });;
        if (error) return

        setMessageArray(data)
    }

    const requestSendMessage = async () => {
        setIsSendLoading(true)

        await apiCall({
            method:"POST",
            controller:"MessageController",
            route:"newmessage",
            body: {
                content: message,
                conversationId: params.conversation
            },

            session: session
        }) 

        setMessage("")
        setIsSendLoading(false)
    }

    // real time messages \\
    useEffect(() => {
        const channel = supabase
        .channel(`messages:${params.conversation}`)
        .on(
        'postgres_changes',
        {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${params.conversation}`,
        },
        (payload) => {
            const newMessage = payload.new;
            setMessageArray((prev: []) => [...prev, newMessage]);
        }
        )
        .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [params.conversation]);

    useEffect(() => {
        fetchUserData()
        fetchUserAvatars()
        fetchMessages()
    }, [userB])

    useEffect(resolveParameters, [params.targetId])

    return (
            <TabPage scrollDisabled={true} title={"Conversation"} titleVisible={false} className={"items-center flex gap-3 h-full"}>
                <UserDisplay targetId={userB}/>

                <View className="grow w-full items-center px-4">
                    <ScrollView className='w-full' contentContainerClassName="h-[60vh] items-center justify-end gap-4 flex">
                        <Text className="text-lg text-white mt-[20vh]">Your legendary conversation begins!</Text>

                        {
                            messageArray.map((messageData: MessageData, i: number) => {
                                if (userAData == undefined) return
                                if (userBData == undefined) return

                                const isSelf = messageData.sender_id == profile.id
                                
                                return (
                                    <Message
                                        isSelf={isSelf}
                                        userData={isSelf ? userAData : userBData}
                                        avatar_url={isSelf ? userAAvatar : userBAvatar}
                                        messageData={messageData}
                                        key={i}
                                    />
                                )
                            })
                        }
                    </ScrollView>


                    <View className="w-screen mb-20 flex flex-row gap-2 p-2 items-center">
                        <SigninTextField className='grow'  title='' placeholder='What do you want to send?' onSubmitEditing={requestSendMessage} onChangeText={setMessage} value={message}/>
                        <View>
                            <IconButton loading={isSendLoading} name="paper-plane" size={30} style={"solid"} onPress={requestSendMessage} color={"#ffb900"}/>
                        </View>
                    </View>
                </View>
        </TabPage>

    );
};

export default Conversation;
