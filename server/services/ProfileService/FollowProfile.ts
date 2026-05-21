import { Router, Request, Response } from 'express';
import {supabase} from "@server/utils/supabase";
import {checkAuthorization} from "@server/utils/authorization";
import { randomUUID } from 'node:crypto';

const followPOST = async (req: Request, res: Response) => {
    const { handle } = req.body;
    const { authorization : authorizationToken } = req.headers;

    if (!authorizationToken) return res.status(400).json({__isAuthError: true, code: "invalid_request"})

    // check for authorization \\
    const {success, data} = await checkAuthorization(authorizationToken, res);
    if (!success || data == null) return

    // get ids \\
    const {data : followingData, error} = await supabase.from("profiles").select("*").eq("handle", handle).single()
    if (error) return res.status(400).json({__isAuthError: false, code: "invalid_request"})

    const follower_id = data.user.id
    const following_id = followingData.id

    // if follow exists, remove it \\
    const {data: isFollowingData} = await supabase.from("follows").select("*").eq("following_id", following_id).eq("follower_id", follower_id).single()
    if (isFollowingData != null)
    {
        await supabase.from("follows").delete().eq("following_id", following_id).eq("follower_id", follower_id)
        return res.status(200).json({__isAuthError: false, code: "success"})
    }

    // new follow \\
    await supabase.from("follows").upsert({ follower_id, following_id })
    if (error)
        return res.status(400).json({__isAuthError: false, code: "invalid_request"})

    // check if conversation exists \\
    const { data: userAConversation } = await supabase.from("conversations").select("*").eq("user_a", follower_id).eq("user_b", following_id)
    const { data: userBConversation } = await supabase.from("conversations").select("*").eq("user_b", follower_id).eq("user_a", following_id)

    if (userAConversation?.length === 0 && userBConversation?.length === 0)
    {
        // new conversation \\
        const convoId = randomUUID()
        await supabase.from("conversations").upsert({
            id: convoId,
            
            user_a: follower_id,
            user_b: following_id,
        })
    }

    return res.status(200).json({__isAuthError: false, code: "success"})
}

export default followPOST;