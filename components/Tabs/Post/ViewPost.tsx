import {Link, useLocalSearchParams, useRouter} from "expo-router";
import { supabase } from "@/app/utils/supabase";
import {useCallback, useContext, useEffect, useRef, useState} from "react";
import TabPage, { TabProps } from "@/components/Tabs/TabPage";
import {ActivityIndicator, Alert, FlatList, Keyboard, LayoutRectangle, Pressable, Text, View} from "react-native";
import { Image } from "expo-image";
import { fetchProfileImage } from "app/utils/postUtils";
import ImageView from "react-native-image-viewing" 
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import PostCreator from "./PostCreator";
import SigninTextField from "@/components/Signin/SignInTextField";
import PostComment, { commentData } from "./PostComment";
import IconButton from "@/components/IconButton";
import { apiCall } from "@/app/utils/apiUtils";
import { AuthContext } from "@/app/authentication/use-auth-context";
import { ScrollView } from "react-native-reanimated/lib/typescript/Animated";
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import HeartAnimation from "./HeartAnimation";
import PostImage from "./PostImage";
import Post from "./Post";

export type PostInfo = {
    id: string,
    user_id: string,

    content: string,
    image_url: string,

    created_at: string,
}


const Viewpost = () => {
    const {post} = useLocalSearchParams<{ post: string }>();

    const [refreshCount, setRefreshCount] = useState(0)
    const scrollViewRef = useRef<ScrollView>(null)

    const refresh = () => {
        setRefreshCount(past => past + 1)
    }
    
    const refreshPost: TabProps["onRefresh"] = async (setRefreshing) => {
        setRefreshing(true)
        refresh()
        setRefreshing(false)
    }

    useCallback(refresh, [refreshCount])

    return (
        <TabPage title={"Преглед на публикация"} titleVisible={false} onRefresh={refreshPost} scrollRef={scrollViewRef}>
            <Post postId={post} refresh={refresh} scrollViewRef={scrollViewRef} showComments={true}/>
        </TabPage>
    )
}

export default Viewpost;
