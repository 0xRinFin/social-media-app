import {useLocalSearchParams} from "expo-router";
import { supabase } from "@/app/utils/supabase";
import {useEffect, useState} from "react";
import TabPage from "@/components/Tabs/TabPage";
import {Text} from "react-native";

const Viewpost = () => {
    const {post} = useLocalSearchParams<{ post: string }>();

    const [postData, setPostData] = useState<any>();

    const [postImage, setPostImage] = useState<string>("");
    const [postDescription, setPostDescription] = useState<string>("");
    const [postProfile, setPostProfile] = useState<string>("");

    const fetchPostData = async () => {
        if (post == undefined) return;

        const {data} = await supabase.from("posts").select("*").eq("id", post)
        console.log(data)

        if (data == undefined) return
        setPostData(data)
    }

    const renderPostData = async () => {
        if (post == undefined) return;
        if (postData == undefined) return;

        setPostImage(postData.image_url)
        setPostDescription(postData.content)
        setPostProfile(postData.user_id)
    }

    useEffect(() => {
        renderPostData();
    }, [postData])

    useEffect(() => {
        fetchPostData()
    }, [fetchPostData, post])

    return (
        <TabPage title={"View Post"} titleVisible={true}>
            <Text>rawr</Text>
            <Text>{postDescription}</Text>
        </TabPage>
    )
}

export default Viewpost;