import { supabase } from "./supabase";

export const defaultIcon = require("assets/Images/default_avatar.jpg");

export const fetchProfileImage = async (id?: string) => {
    if (!id) return defaultIcon;

    const userAvatarPath = `/${id}/avatar.jpg`;
    const doesExist = await supabase.storage.from("avatars").exists(userAvatarPath);

    if (doesExist.error || !doesExist.data) return defaultIcon;

    const url = supabase.storage.from("avatars").getPublicUrl(userAvatarPath);
    return url.data.publicUrl + `?t=${Date.now()}`;
};

export const formatDate = (created_at: string) => {
  return new Date(created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};