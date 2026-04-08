import {Text, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TabPage from "../../components/Tabs/TabPage";
import {WrappedButton} from "../../components/WrappedButton";

const Messages = () => {
    return (
        <TabPage title={"Messages"} className={"items-center justify-center flex gap-3 h-full"}>
        </TabPage>
    );
};

export default Messages;
