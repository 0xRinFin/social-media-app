import { useEffect } from "react";
import { useRouter, usePathname } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../../authentication/use-auth-context";

const Index = () => {
    const router = useRouter();
    const { profile } = useContext(AuthContext);
    const pathname = usePathname();

    const localProfile = `/profile/${profile.handle}`

    useEffect(() => {
        if (profile?.handle && pathname !== localProfile) {
            router.replace(localProfile);
        }
    }, [profile?.handle]);

    return null;
};

export default Index;