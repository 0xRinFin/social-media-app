import * as ImagePicker from "expo-image-picker";
import {supabase as supabaseClient} from "@/app/utils/supabase";
import {toByteArray} from "base64-js";
import {useContext} from "react";
import {AuthContext} from "@/app/authentication/use-auth-context";

const EditProfile = () => {
    const {profile} = useContext(AuthContext);

    const uploadProfileImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            quality: 1,
            base64: true,
        });

        if (result.canceled || !result.assets.length) return;
        const chosenImage = result.assets[0];

        if (chosenImage.base64 == undefined) return;

        const { data, error } = await supabaseClient.storage
            .from('avatars')
            .upload(`/${profile.id}/avatar.jpg`, toByteArray(chosenImage.base64), { contentType:"image/jpg", upsert: true });

        if (error) console.error(error);
        else console.log('Upload success', data);
    };


}

export default EditProfile;