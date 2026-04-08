import { Router, Request, Response } from 'express';
import {supabase} from "../utils/supabase";

const signupPOST = async (req: Request, res: Response) => {
    const { email, password, handle, display_name } = req.body;
    const { data: userData, error: signUpError } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });

    console.log(JSON.stringify(signUpError));
    if (signUpError !== null) return res.status(500).json(signUpError);
    if (userData === null) return res.status(500).json({});

    // create PROFILE \\
    const userId = userData.user?.id
    const { error: profileError } = await supabase
        .from("profiles")
        .insert({
            id: userId,
            handle: handle,
            display_name: display_name,
            created_at: new Date().toISOString()
        });

    if (profileError) return res.status(500).json(profileError);
    res.status(201).json({
        success: true,
    })
}

export default signupPOST;