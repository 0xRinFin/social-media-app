import {Link, useLocalSearchParams, useRouter} from "expo-router";
import { supabase } from "@/app/utils/supabase";
import {useContext, useEffect, useRef, useState} from "react";
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
import { apiFetch } from "@/app/utils/apiFetch";
import { AuthContext } from "@/app/authentication/use-auth-context";
import { ScrollView } from "react-native-reanimated/lib/typescript/Animated";
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import HeartAnimation from "./HeartAnimation";
import PostImage from "./PostImage";


const Viewpost = () => {
    const router = useRouter()
    const {post} = useLocalSearchParams<{ post: string }>();
    const {session, profile, fetchProfile} = useContext(AuthContext)

    const [postData, setPostData] = useState<any>();

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
    const [refreshCount, setRefreshCount] = useState(0)

    const [commentSectionLayout, setCommentSectionLayout] = useState<LayoutRectangle>()
    const scrollViewRef = useRef<ScrollView>(null)

    const [heartVisible, setHeartVisible] = useState(false)

    const refresh = () => {
        setRefreshCount(past => past + 1)
    }
    
    const refreshPost: TabProps["onRefresh"] = async (setRefreshing) => {
        setRefreshing(true)
        refresh()
        setRefreshing(false)
    }

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

         const res = await apiFetch("/api/PostController/deletePost", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': session.access_token
            },

            body: JSON.stringify({postId: post})
        })

        const body = await res.json()
        if (body == undefined || body.code != "success")
            return

        Alert.alert("Deleted post", "Successfully deleted this post!")
        fetchProfile()
        router.back()
    }

    const requestPostLike = async () => {
        if (post == undefined) return
        
         const res = await apiFetch("/api/PostController/likePost", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': session.access_token
            },

            body: JSON.stringify({postId: post})
        })

        const body = await res.json()
        if (body != undefined && body.code == "success")
            refresh()
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

        const res = await apiFetch("/api/PostController/comment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': session.access_token
            },

            body: JSON.stringify({
                content: commentText,
                postId: post
            })
        })

        setCommentText("")
        Keyboard.dismiss()
        

        const body = await res.json();
        if (body.code && body.code == "success")
            refresh()
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
    }, [fetchPostData, post, refreshCount])

    if (isLoading) {
        return (
          <TabPage title={"View Post"} titleVisible={true}>
            <View className="w-full h-[70%] items-center justify-center">
                <ActivityIndicator size="large" color="#ffb900" className={`absolute`} />
            </View>
          </TabPage>
        )
    }

    return (
        <GestureHandlerRootView>
            <TabPage title={"View Post"} titleVisible={false} onRefresh={refreshPost} scrollRef={scrollViewRef}>
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

                                const scrollView = scrollViewRef.current
                                if (scrollView == null) return

                                scrollView.scrollTo({
                                    y: commentSectionLayout?.y,
                                    animated: true
                                })

                            }}>
                                <FontAwesome6 iconStyle="regular" name={"comment"} size={40} color={"#ffb900"}  />
                            </Pressable>
                        </View>
        {/* 
                        <Pressable>
                            <FontAwesome6 iconStyle="" name={"share-from-square"} size={40} color={"#ffb900"}  />
                        </Pressable> */}

                        <View>
                            <Pressable onPress={requestDeletePost}>
                          {
                            ownsPost ? (<FontAwesome6 iconStyle="solid" name={"trash-can"} size={40} color={"#ffb900"}  />) 
                            : ("") 
                          }
                          </Pressable>
                        </View>
                        
                    </View>

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
                </View>
            </TabPage>
        </GestureHandlerRootView>
        
    )
}

export default Viewpost;
