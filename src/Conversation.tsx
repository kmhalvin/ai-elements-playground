import {type ReactNode, useImperativeHandle} from "react";
import {useStickToBottom} from "@/lib/useStickBottomWindow.ts";
import {StickToBottom} from "use-stick-to-bottom";

function Conversation({ children }: { children: ReactNode }) {
    const instance = useStickToBottom({
        initial: 'smooth',
        resize: 'smooth'
    })

    const { scrollRef } = instance

    useImperativeHandle(scrollRef, () => window, [])

    return <StickToBottom instance={instance}>
        {children}
    </StickToBottom>
}

export default Conversation;