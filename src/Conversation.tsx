import {type ReactNode, useEffect} from "react";
import {useStickToBottom} from "@/lib/useStickBottomWindow.ts";
import {StickToBottom} from "use-stick-to-bottom";

function Conversation({ children }: { children: ReactNode }) {
    const instance = useStickToBottom({
        initial: 'smooth',
        resize: 'smooth'
    })

    const { scrollRef } = instance

    useEffect(() => {
        scrollRef(window)
    }, [scrollRef]);

    return <StickToBottom instance={instance}>
        {children}
    </StickToBottom>
}

export default Conversation;