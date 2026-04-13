import {Text, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TabPage from "@/components/Tabs/TabPage";
import {WrappedButton} from "@/components/WrappedButton";
import { baseButtonStyle } from '../profile/editprofile';

const Messages = () => {
    const createConversation = () => {
        
    }

    return (
        <TabPage title={"Messages"} className={"items-center justify-center flex gap-3 h-full"}>
            <WrappedButton title='create conversation' isActive={true} isAnimated={true} onClick={() => {}} extraClassName={baseButtonStyle}/>
        </TabPage>
    );
};

export default Messages;
