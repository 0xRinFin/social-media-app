import {Link, useLocalSearchParams, useRouter} from "expo-router";
import { supabase } from "@/app/utils/supabase";
import {Ref, useContext, useEffect, useRef, useState} from "react";
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

export type PostInfo = {
    id: string,
    user_id: string,

    content: string,
    image_url: string,

    created_at: string,
}


const Post = (props: {postId: string, showComments: boolean, refresh: () => void, scrollViewRef?: React.RefObject<ScrollView | null>} ) => {
    const router = useRouter()
    const {session, profile, fetchProfile} = useContext(AuthContext)

    const [postData, setPostData] = useState<any>();
    const post = props.postId

    const [postImage, setPostImage] = useState<string>("");
    const [postDescription, setPostDescription] = useState<string>("");
    const [postProfile, setPostProfile] = useState<string>("");
    const [postDate, setPostDate] = useState("")
    const [postComments, setPostComments] = useState<any>([]);

    const [ownsPost, setOwnsPost] = useState(false);

    const [postIsLiked, setPostIsLiked] = useState(false)
    const [waitingLike, setWaitingLike] = useState(false)

    const [postProfileData, setPostProfileData] = useState<any>();
    const [profileImageUri, setProfileImageUri] = useState("")
    const [profileHandle, setProfileHandle] = useState("")
    const [profileDisplay, setProfileDisplay] = useState("")

    const [isLoading, setIsLoading] = useState(true)
    const [modalVisible, setModalVisible] = useState(false)

    const [commentText, setCommentText] = useState("")

    const [commentSectionLayout, setCommentSectionLayout] = useState<LayoutRectangle>()

    const [heartVisible, setHeartVisible] = useState(false)

    const requestDeletePost = async () => {
        let confirmed = await (new Promise((resolve) => {
            Alert.alert(
                "Confirm",
                "Are you sure you want to permanently delete this post?",
                [
                    { text: "Cancel", style: "cancel", onPress:() => resolve(false) },
                    { text: "OK", style: "default", onPress:() => resolve(true) },
                ]
            );
         }));

    
         if (!confirmed) return

         const body = await apiCall({
            method: "DELETE",
            controller: "PostController",
            route: "deletePost",
            session: session,
            body: {postId: post}
        })
        if (body == undefined || body.code != "success")
            return

        Alert.alert("Deleted post", "Successfully deleted this post!")
        fetchProfile()
        router.back()
    }

    const requestPostLike = async () => {
        if (post == undefined) return
        
         const body = await apiCall({
            method: "POST",
            controller: "PostController",
            route: "likePost",
            session: session,
            body: {postId: post}
        })
        
        if (body != undefined && body.code == "success")
            fetchLiked()
    }

    // gesture setup \\
    const singleTap = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => {
        runOnJS(setModalVisible)(true);
    });

    
    const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
        runOnJS(setWaitingLike)(true)
        runOnJS(requestPostLike)()
        runOnJS(setHeartVisible)(true);
    });
    
    const gesture = Gesture.Exclusive(doubleTap, singleTap);

    // the rest \\
    const fetchPostData = async () => {
        if (post == undefined) return;

        const {data} = await supabase.from("posts").select("*").eq("id", post).single()

        if (data == undefined) return
        setPostData(data)
    }

    const fetchProfileData = async () => {
        if (post == undefined) return;
        if (postData == undefined) return;

        const {data} = await supabase.from("profiles").select("*").eq("id", postProfile).single()
        if (data == undefined) return

        setPostProfileData(data)
    }

    const fetchComments = async () => {
        if (post == undefined) return;
        if (postData == undefined) return;

        const {data} = await supabase.from("comments").select("*").eq("post_id", post).order("created_at", {ascending:false})
        setPostComments(data)
    }

    const fetchLiked = async () => {
        if (post == undefined) return;
        if (postData == undefined) return;
        if (profile == undefined) return

        const {success} = await supabase.from("post_likes").select("*").eq("post_id", post).eq("user_id", profile.id).single()
        setPostIsLiked(success)
        setWaitingLike(false)
    }

    const renderPostData = async () => {
        if (post == undefined) return;
        if (postData == undefined) return;

        setPostImage(postData.image_url)
        setPostDescription(postData.content)
        setPostProfile(postData.user_id)
        setPostDate(postData.created_at)
    }

    const renderProfileData = async () => {
        if (postProfileData == undefined) return;
        if (profile == undefined) return

        const imageUri = await fetchProfileImage(postProfile)

        setProfileImageUri(imageUri)
        setProfileDisplay(postProfileData.display_name)
        setProfileHandle(postProfileData.handle)

        setOwnsPost(postProfileData.id == profile.id)

        setIsLoading(false)
    }

    const requestSendComment = async () => {
        if (commentText == "") return
        if (post == undefined) return
        if (session == undefined) return

        const body = await apiCall({
            method: "POST",
            controller: "PostController",
            route: "comment",
            session: session,
            body: {
                content: commentText,
                postId: post
            }
        })

        setCommentText("")
        Keyboard.dismiss()
        if (body.code && body.code == "success")
            props.refresh()
    }

    useEffect(() => {
        renderProfileData()
    }, [postProfileData])

    useEffect(() => {
        fetchProfileData();
    }, [postProfile])

    useEffect(() => {
        renderPostData();
        fetchComments();
        fetchLiked()
    }, [postData])

    useEffect(() => {
        fetchPostData()
        console.log("meow?")
    }, [fetchPostData, post])

    if (isLoading) {
        return (
          <TabPage title={"View Post"} titleVisible={true}>
            <View className="w-full h-[70vh] items-center justify-center">
                <ActivityIndicator size="large" color="#ffb900" className={`absolute`} />
            </View>
          </TabPage>
        )
    }

    return (
        <GestureHandlerRootView>
            <View className="items-center p-4  w-full flex gap-4">
                <PostCreator displayName={profileDisplay} handle={profileHandle} imageUrl={profileImageUri} postDate={postDate}/>

                <Text className="color-white w-full text-left text-2xl">{postDescription}</Text>
                <GestureDetector gesture={gesture}>
                    <View className="w-full h-[400px]">
                        <PostImage source={postImage}/>

                        <HeartAnimation visible={heartVisible} onComplete={() => setHeartVisible(false)} />
                    </View>
                </GestureDetector>

                <ImageView
                    visible={modalVisible}
                    images={[
                        {
                            uri: postImage
                        }
                    ]}
                    imageIndex={0}
                    onRequestClose={() => setModalVisible(false)}
                    
                />

                <View className="flex flex-row w-full p-2 justify-between">
                    <View className="flex flex-row gap-4">
                        <Pressable onPress={requestPostLike}>
                            {
                                (waitingLike) ? (<ActivityIndicator size="large" color="#ffb900" />) 
                                : (<FontAwesome6 iconStyle={postIsLiked ? "solid" : "regular"} name={"heart"} size={40} color={"#ffb900"}  />)
                            }
                        </Pressable>

                        <Pressable onPress={() => {
                            if (props.scrollViewRef == undefined) return

                            const scrollView = props.scrollViewRef.current
                            if (scrollView == null) return

                            scrollView.scrollTo({
                                y: commentSectionLayout?.y,
                                animated: true
                            })

                        }}>
                            <FontAwesome6 iconStyle="regular" name={"comment"} size={40} color={"#ffb900"}  />
                        </Pressable>
                    </View>

                    <View>
                        <Pressable onPress={requestDeletePost}>
                        {
                        ownsPost ? (<FontAwesome6 iconStyle="solid" name={"trash-can"} size={40} color={"#ffb900"}  />) 
                        : ("") 
                        }
                        </Pressable>
                    </View>
                    
                </View>
                
                {props.showComments && (
                        <View className="w-full border-t border-neutral-600 p-2 pt-4 mb-48 flex gap-4" onLayout={event => setCommentSectionLayout(event.nativeEvent.layout)}>
                    
                        <Text className="text-white text-2xl">{postComments.length} Comments</Text>
                        <View className="flex flex-row w-full items-center justify-between gap-4">
                            <SigninTextField title="" placeholder="Wrie down a comment?" className="grow" onChangeText={setCommentText} value={commentText}/>
                            <IconButton name="paper-plane" size={30} style={"solid"} onPress={requestSendComment} color={"#ffb900"}/>
                        </View>

                        {
                            postComments.map((commentData: commentData, i: number) => (<PostComment key={i} commentData={commentData}/>))
                        }

                    </View>
                )}
                
            </View>
        </GestureHandlerRootView>
        
    )
}

export default Post;
