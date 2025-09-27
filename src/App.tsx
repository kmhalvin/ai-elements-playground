'use client';

import AppConversation from "@/AppConversation.tsx";
import AppPrompt from "@/AppPrompt.tsx";
import {useStickToBottomContext} from "use-stick-to-bottom";

const ChatBotDemo = () => {
    const {contentRef} = useStickToBottomContext()

    return (
        <div className="flex flex-col size-full justify-between min-h-screen" ref={contentRef}>
            <AppConversation/>
            <AppPrompt/>
        </div>
    );
};

export default ChatBotDemo;