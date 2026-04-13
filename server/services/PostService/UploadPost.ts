import { Router, Request, Response } from 'express';
import {supabase} from "../../utils/supabase";
import {checkAuthorization} from "@server/utils/authorization";

import {randomUUID} from "node:crypto";

const uploadpostPOST = async (req: Request, res: Response) => {
    console.log("meow")
    const { description, image } = req.body;
    const { authorization : authorizationToken } = req.headers;

    if (!authorizationToken) return res.status(400).json({__isAuthError: true, code: "invalid_request"})

    // check for authorization \\
    const {success, data} = await checkAuthorization(authorizationToken, res);
    if (!success || data == null) return

    // generate post id \\
    const uuid = randomUUID()

    // upload image \\
    const imagePath = `${data.user.id}/${uuid}.jpg`
    if (image != undefined) {
        const buffer = Buffer.from(image, 'base64');
        await supabase.storage.from("images").upload(imagePath, buffer,  { contentType:"image/jpg", upsert: true })
    }

    // create post \\
    const {data: imageUrl} = supabase.storage.from("images").getPublicUrl(imagePath)
    const {success: postSuccess} = await supabase.from("posts").insert({id: uuid,  user_id: data.user.id, content: description, image_url: imageUrl.publicUrl }).single()
    if (!postSuccess) return res.status(400).json({__isAuthError: false, code: "invalid_request"})

    res.status(200).json({code: "success", uuid: uuid})
}

export default uploadpostPOST;