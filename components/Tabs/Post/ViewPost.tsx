import { useLocalSearchParams } from "expo-router";
import { useCallback, useRef, useState } from "react";
import TabPage, { TabProps } from "@/components/Tabs/TabPage";
import { ScrollView } from "react-native";
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

    const refresh = useCallback(() => {
        setRefreshCount(past => past + 1)
    }, [])
    
    const refreshPost: TabProps["onRefresh"] = async (setRefreshing) => {
        setRefreshing(true)
        refresh()
        setRefreshing(false)
    }

    return (
        <TabPage title={"Преглед на публикация"} titleVisible={false} onRefresh={refreshPost} scrollRef={scrollViewRef}>
            <Post key={`${post}-${refreshCount}`} postId={post} refresh={refresh} refreshCount={refreshCount} scrollViewRef={scrollViewRef} showComments={true}/>
        </TabPage>
    )
}

export default Viewpost;
