import {
    ConversationEmptyState,
} from "@/components/ai-elements/conversation.tsx";
import {Source, Sources, SourcesContent, SourcesTrigger} from "@/components/ai-elements/sources.tsx";
import {Fragment} from "react";
import {Message, MessageContent} from "@/components/ai-elements/message.tsx";
import {Response} from "@/components/ai-elements/response.tsx";
import {Action, Actions} from "@/components/ai-elements/actions.tsx";
import {CopyIcon, RefreshCcwIcon} from "lucide-react";
import {Reasoning, ReasoningContent, ReasoningTrigger} from "@/components/ai-elements/reasoning.tsx";
import {Loader} from "@/components/ai-elements/loader.tsx";
import {useChat} from "@ai-sdk/react";
import chatPlayground from "@/chatPlayground.ts";

function AppConversation() {
    const {messages, status, regenerate, error} = useChat({
        chat: chatPlayground,
    });

    return <div className="h-full p-4">
        {messages.length === 0 ? <ConversationEmptyState/> : messages.map((message, msgIdx) => (
            <div key={message.id}>
                {message.role === 'assistant' && message.parts.filter((part) => part.type === 'source-url').length > 0 && (
                    <Sources>
                        <SourcesTrigger
                            count={
                                message.parts.filter(
                                    (part) => part.type === 'source-url',
                                ).length
                            }
                        />
                        {message.parts.filter((part) => part.type === 'source-url').map((part, i) => (
                            <SourcesContent key={`${message.id}-${i}`}>
                                <Source
                                    key={`${message.id}-${i}`}
                                    href={part.url}
                                    title={part.url}
                                />
                            </SourcesContent>
                        ))}
                    </Sources>
                )}
                {message.parts.map((part, i) => {
                    switch (part.type) {
                        case 'text':
                            return (
                                <Fragment key={`${message.id}-${i}`}>
                                    <Message from={message.role}>
                                        <MessageContent>
                                            <Response>
                                                {part.text}
                                            </Response>
                                        </MessageContent>
                                    </Message>
                                    {message.role === 'assistant' && msgIdx === messages.length - 1 && (
                                        <Actions className="mt-2">
                                            {status === 'ready' && <Action
                                              onClick={() => regenerate()}
                                              label="Retry"
                                            >
                                              <RefreshCcwIcon className="size-3"/>
                                            </Action>}
                                            <Action
                                                onClick={() =>
                                                    navigator.clipboard.writeText(part.text)
                                                }
                                                label="Copy"
                                            >
                                                <CopyIcon className="size-3"/>
                                            </Action>
                                        </Actions>
                                    )}
                                </Fragment>
                            );
                        case 'reasoning':
                            return (
                                <Reasoning
                                    key={`${message.id}-${i}`}
                                    className="w-full"
                                    isStreaming={status === 'streaming' && i === message.parts.length - 1 && message.id === messages.at(-1)?.id}
                                >
                                    <ReasoningTrigger/>
                                    <ReasoningContent>{part.text}</ReasoningContent>
                                </Reasoning>
                            );
                        default:
                            return null;
                    }
                })}
            </div>
        ))}
        {status === 'error' && <Fragment>
          <Message from='assistant'>
            <MessageContent
              className="group-[.is-assistant]:bg-destructive group-[.is-assistant]:text-primary-foreground">
                {error?.message || 'error'}
            </MessageContent>
          </Message>
          <Actions className="mt-2">
            <Action
              onClick={() => regenerate()}
              label="Retry"
            >
              <RefreshCcwIcon className="size-3"/>
            </Action>
          </Actions>
        </Fragment>}
        {status === 'submitted' && <Loader/>}
    </div>
}

export default AppConversation;