import { Router, Request, Response } from 'express';
import {supabase} from "../../utils/supabase";
import {checkAuthorization} from "@server/utils/authorization";

import {randomUUID} from "node:crypto";

const likepostPOST = async (req: Request, res: Response) => {
    const { postId } = req.body;
    const { authorization : authorizationToken } = req.headers;

    if (!authorizationToken) return res.status(400).json({__isAuthError: true, code: "invalid_request"})

    // check for authorization \\
    const {success, data} = await checkAuthorization(authorizationToken, res);
    if (!success || data == null) return


    if (postId == undefined) return


    // remove if like exists \\
    const {success: likeExists} = await supabase.from("post_likes").select("*").eq("post_id", postId).eq("user_id", data.user.id).single()
    if (likeExists)
    {
        await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", data.user.id)
        return res.status(200).json({code: "success"})
    }

    const {data: likeData} = await supabase.from("post_likes").upsert({
        post_id: postId,
        user_id: data.user.id,
    }).single()

    res.status(200).json({code: "success"})
}

export default likepostPOST;