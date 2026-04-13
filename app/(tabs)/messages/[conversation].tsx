import UserDisplay from '@/components/UserDisplay';
import SigninTextField from '@/components/Signin/SignInTextField';
import IconButton from '@/components/IconButton';
import Message, { MessageData } from '@/components/Tabs/Messages/Message';
import { useAuthContext } from '@/app/authentication/use-auth-context';
import { supabase } from '@/app/utils/supabase';
import { apiCall } from '@/app/utils/apiUtils';
import { fetchProfileImage } from '@/app/utils/postUtils';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Conversation = () => {
    const params = useLocalSearchParams<{ conversation: string; targetId: string }>()
    const { profile, session } = useAuthContext()
    const insets = useSafeAreaInsets()

    const messageScrollRef = useRef<ScrollView | null>(null)

    const [userA, setUserA] = useState("")
    const [userB, setUserB] = useState("")

    const [userAData, setUserAData] = useState<any>(undefined)
    const [userBData, setUserBData] = useState<any>(undefined)

    const [userAAvatar, setUserAAvatar] = useState("")
    const [userBAvatar, setUserBAvatar] = useState("")

    const [messageArray, setMessageArray] = useState<any[]>([])
    const [message, setMessage] = useState("")
    const [isSendLoading, setIsSendLoading] = useState(false)
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

    const resolveParameters = () => {
        if (!profile?.id) return
        if (!params.targetId) return

        setUserA(profile.id)
        setUserB(params.targetId)
    }

    const fetchUserData = async () => {
        if (!userB) return
        if (!profile) return

        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userB)
            .single();

        if (error) return

        setUserAData(profile)
        setUserBData(data)
    }

    const fetchUserAvatars = async () => {
        if (!userA || !userB) return

        const targetAvatar = await fetchProfileImage(userB)
        const ownAvatar = await fetchProfileImage(userA)

        setUserBAvatar(targetAvatar)
        setUserAAvatar(ownAvatar)
    }

    const fetchMessages = async () => {
        if (!params.conversation) return

        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("conversation_id", params.conversation)
            .order("created_at", { ascending: true });

        if (error || !data) return
        setMessageArray(data)
    }

    const requestSendMessage = async () => {
        if (isSendLoading) return
        if (!message.trim()) return
        if (!params.conversation) return

        setIsSendLoading(true)

        await apiCall({
            method: "POST",
            controller: "MessageController",
            route: "newmessage",
            body: {
                content: message,
                conversationId: params.conversation,
            },
            session,
        })

        setMessage("")
        setIsSendLoading(false)
    }

    useEffect(resolveParameters, [profile?.id, params.targetId])

    useEffect(() => {
        fetchMessages()
    }, [params.conversation])

    useEffect(() => {
        fetchUserData()
        fetchUserAvatars()
    }, [userA, userB])

    useEffect(() => {
        if (!params.conversation) return

        const channel = supabase
            .channel(`messages:${params.conversation}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `conversation_id=eq.${params.conversation}`,
                },
                (payload) => {
                    const newMessage = payload.new;
                    setMessageArray((prev) => [...prev, newMessage]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [params.conversation])

    useEffect(() => {
        if (!messageScrollRef.current) return
        messageScrollRef.current.scrollToEnd({ animated: true })
    }, [messageArray.length])

    useEffect(() => {
        const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow"
        const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide"

        const showSubscription = Keyboard.addListener(showEvent, () => setIsKeyboardVisible(true))
        const hideSubscription = Keyboard.addListener(hideEvent, () => setIsKeyboardVisible(false))

        return () => {
            showSubscription.remove()
            hideSubscription.remove()
        }
    }, [])

    const topSpacing = insets.top + 10
    const closedBottomSpacing = insets.bottom + 68
    const composerBottomSpacing = isKeyboardVisible ? 6 : closedBottomSpacing

    return (
        <View style={{ flex: 1, backgroundColor: "black" }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <View style={{ flex: 1, paddingTop: topSpacing, paddingHorizontal: 16 }}>
                    <UserDisplay targetId={userB} />

                    <View style={{ flex: 1, marginTop: 12 }}>
                        <ScrollView
                            ref={messageScrollRef}
                            style={{ flex: 1 }}
                            contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end", paddingBottom: 8 }}
                            keyboardShouldPersistTaps="handled"
                            keyboardDismissMode="interactive"
                            showsVerticalScrollIndicator={false}
                        >
                            <Text className="text-lg text-white mt-16 self-center">Your legendary conversation begins!</Text>

                            {messageArray.map((messageData: MessageData, i: number) => {
                                const isSelf = messageData.sender_id === profile?.id
                                const ownData = userAData || profile || {
                                    id: userA,
                                    display_name: "You",
                                    handle: "you",
                                    description: "",
                                }
                                const targetData = userBData || {
                                    id: userB,
                                    display_name: "User",
                                    handle: "user",
                                    description: "",
                                }

                                return (
                                    <View key={i} style={{ marginBottom: 14 }}>
                                        <Message
                                            isSelf={isSelf}
                                            userData={isSelf ? ownData : targetData}
                                            avatar_url={isSelf ? userAAvatar : userBAvatar}
                                            messageData={messageData}
                                        />
                                    </View>
                                )
                            })}
                        </ScrollView>

                        <View
                            style={{
                                marginBottom: composerBottomSpacing,
                                flexDirection: "row",
                                alignItems: "center",
                                columnGap: 8,
                                paddingVertical: 8,
                            }}
                        >
                            <SigninTextField
                                className="grow"
                                title=""
                                placeholder="What do you want to send?"
                                onSubmitEditing={requestSendMessage}
                                onChangeText={setMessage}
                                value={message}
                            />
                            <View>
                                <IconButton
                                    loading={isSendLoading}
                                    name="paper-plane"
                                    size={30}
                                    style="solid"
                                    onPress={requestSendMessage}
                                    color="#ffb900"
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

export default Conversation;
