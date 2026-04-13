import { Router, Request, Response } from 'express';
import {supabase} from "../../utils/supabase";
import {checkAuthorization} from "@server/utils/authorization";
import { randomUUID } from 'node:crypto';

const newmessage = async (req: Request, res: Response) => {
    const { conversationId, content } = req.body;
    const { authorization : authorizationToken } = req.headers;

    if (!authorizationToken) return res.status(400).json({__isAuthError: true, code: "invalid_request"})

    // check for authorization \\
    const {success, data} = await checkAuthorization(authorizationToken, res);
    if (!success || data == null) return


    if (conversationId == undefined) return
    if (content == undefined) return

    // check if conversation exists \\
    const {data: conversationData, success: doesExist } = await supabase.from("conversations").select("*").eq("id", conversationId).single()
    if (!doesExist || conversationData == null || conversationData == undefined)
        return res.status(400).json({code: "invalid_request"})

    // new message \\
    const messageId = randomUUID()
    await supabase.from("messages").upsert({
        id: messageId,
        conversation_id: conversationId,
        sender_id: data.user.id,
        content: content
    })

    res.status(201).json({code: "success"})
}

export default newmessage;