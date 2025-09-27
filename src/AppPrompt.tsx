import {
    PromptInput,
    PromptInputActionAddAttachments,
    PromptInputActionMenu,
    PromptInputActionMenuContent,
    PromptInputActionMenuTrigger,
    PromptInputAttachment,
    PromptInputAttachments,
    PromptInputBody,
    PromptInputButton, type PromptInputMessage,
    PromptInputModelSelect,
    PromptInputModelSelectContent,
    PromptInputModelSelectItem,
    PromptInputModelSelectTrigger,
    PromptInputModelSelectValue, PromptInputSubmit,
    PromptInputTextarea,
    PromptInputToolbar,
    PromptInputTools
} from "@/components/ai-elements/prompt-input.tsx";
import {GlobeIcon} from "lucide-react";
import {useEffect, useState} from "react";
import {useChat} from "@ai-sdk/react";
import chatPlayground from "@/chatPlayground.ts";
import {Context, ContextContent, ContextContentHeader, ContextTrigger} from "@/components/ai-elements/context.tsx";
import {ConversationScrollButton} from "@/components/ai-elements/conversation.tsx";

const models = [
    {
        name: 'GPT 4o',
        value: 'openai/gpt-4o',
    },
    {
        name: 'Deepseek R1',
        value: 'deepseek/deepseek-r1',
    },
];

function AppPrompt() {
    const [input, setInput] = useState('');
    const [model, setModel] = useState<string>(models[0].value);
    const [webSearch, setWebSearch] = useState(false);
    const {messages, sendMessage, status} = useChat({
        chat: chatPlayground,
    });

    const [context, setContext] = useState({
        window: 132000,
        used: 0,
    })
    useEffect(() => {
        if (status === 'ready') {
            const usedContextWindow = messages.filter(m => m.role === 'assistant')
                .map(m => m.parts.filter(p => p.type === 'data-token')[0].data.used)
                .reduce((p, c) => p + c, 0)
            setContext({
                used: usedContextWindow,
                window: 132000
            })
        }
    }, [status, messages])

    const handleSubmit = (message: PromptInputMessage) => {
        const hasText = Boolean(message.text);
        const hasAttachments = Boolean(message.files?.length);

        if (status === 'streaming' || status === 'submitted' || !(hasText || hasAttachments)) {
            return;
        }

        sendMessage(
            {
                text: message.text || 'Sent with attachments',
                files: message.files
            },
            {
                body: {
                    model: model,
                    webSearch: webSearch,
                },
            },
        );
        setInput('');
    };

    return <div className="sticky bottom-0 w-full py-2">
        <ConversationScrollButton className='relative'/>
        <PromptInput onSubmit={handleSubmit} globalDrop multiple className='max-w-4xl mx-auto'>
            <PromptInputBody>
                <PromptInputAttachments>
                    {(attachment) => <PromptInputAttachment data={attachment}/>}
                </PromptInputAttachments>
                <PromptInputTextarea
                    onChange={(e) => setInput(e.target.value)}
                    value={input}
                />
            </PromptInputBody>
            <PromptInputToolbar>
                <PromptInputTools>
                    <PromptInputActionMenu>
                        <PromptInputActionMenuTrigger/>
                        <PromptInputActionMenuContent>
                            <PromptInputActionAddAttachments/>
                        </PromptInputActionMenuContent>
                    </PromptInputActionMenu>
                    <PromptInputButton
                        variant={webSearch ? 'default' : 'ghost'}
                        onClick={() => setWebSearch(!webSearch)}
                    >
                        <GlobeIcon size={16}/>
                        <span>Search</span>
                    </PromptInputButton>
                    <PromptInputModelSelect
                        onValueChange={(value) => {
                            setModel(value);
                        }}
                        value={model}
                    >
                        <PromptInputModelSelectTrigger>
                            <PromptInputModelSelectValue/>
                        </PromptInputModelSelectTrigger>
                        <PromptInputModelSelectContent>
                            {models.map((model) => (
                                <PromptInputModelSelectItem key={model.value} value={model.value}>
                                    {model.name}
                                </PromptInputModelSelectItem>
                            ))}
                        </PromptInputModelSelectContent>
                    </PromptInputModelSelect>
                    <Context maxTokens={context.window} usedTokens={context.used}>
                        <ContextTrigger/>
                        <ContextContent>
                            <ContextContentHeader/>
                        </ContextContent>
                    </Context>
                </PromptInputTools>
                <PromptInputSubmit disabled={!input && !status} status={status}/>
            </PromptInputToolbar>
        </PromptInput>
    </div>
}

export default AppPrompt