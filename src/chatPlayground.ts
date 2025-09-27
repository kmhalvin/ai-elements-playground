import {
    DefaultChatTransport, type UIMessage,
    uiMessageChunkSchema,
} from "ai";
import {Chat} from "@ai-sdk/react";
import {http, HttpResponse} from "msw";
import {z} from 'zod';
import mermaid from '@/assets/mermaid.json'

const encoder = new TextEncoder();

export type AppUIMessage = UIMessage<
    never, // metadata type
    {
        token: {
            window: number;
            used: number;
        };
    }
>;

const stubSSE = http.post('http://example.com/stream', d => {
    async function sendEvent(controller: ReadableStreamDefaultController, data: z.infer<typeof uiMessageChunkSchema> | "[DONE]") {
        await new Promise(resolve => setTimeout(resolve, 80))
        controller.enqueue(encoder.encode(`event:app\ndata:${typeof data === 'string' ? data : JSON.stringify(data)}\n\n`));
        if (data === "[DONE]") controller.close();
    }

    const req = new Response(d.request.body)

    const stream = new ReadableStream({
        async start(c) {
            const request = await req.json()
            if (request.messages[request.messages.length - 1].role !== "user") {
                await sendEvent(c, "[DONE]") // terminate sse
                return;
            }

            const msg: string = request.messages[request.messages.length - 1].parts.filter((p: {
                type: 'text'
            }) => p.type === 'text')[0]?.text
            if (!msg) {
                await sendEvent(c, "[DONE]") // terminate sse
                return;
            }

            await sendEvent(c, {type: "start"})

            await sendEvent(c, {type: "start-step"})

            await sendEvent(c, {type: "reasoning-start", id: "reason-id-123"})
            await sendEvent(c, {type: "reasoning-delta", id: "reason-id-123", delta: "the"})
            await sendEvent(c, {type: "reasoning-delta", id: "reason-id-123", delta: " **"})
            await sendEvent(c, {type: "reasoning-delta", id: "reason-id-123", delta: "owner"})
            await sendEvent(c, {type: "reasoning-delta", id: "reason-id-123", delta: "**"})
            await sendEvent(c, {type: "reasoning-delta", id: "reason-id-123", delta: " wants"})
            await sendEvent(c, {type: "reasoning-delta", id: "reason-id-123", delta: " me"})
            await sendEvent(c, {type: "reasoning-delta", id: "reason-id-123", delta: " to"})
            await sendEvent(c, {type: "reasoning-delta", id: "reason-id-123", delta: " greet"})
            await sendEvent(c, {type: "reasoning-delta", id: "reason-id-123", delta: " the"})
            await sendEvent(c, {type: "reasoning-delta", id: "reason-id-123", delta: " user"})
            await sendEvent(c, {type: "reasoning-delta", id: "reason-id-123", delta: "."})
            await sendEvent(c, {type: "reasoning-end", id: "reason-id-123"})

            await sendEvent(c, {
                type: "source-url",
                sourceId: "https://github.com/kmhalvin",
                url: "https://github.com/kmhalvin"
            })

            if (msg.includes("mermaid")) {
                await sendEvent(c, {type: "text-start", id: "txt-id-123"})
                for (const m of mermaid) {
                    await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: m})
                }
                await sendEvent(c, {type: "text-end", id: "txt-id-123"})
            } else {
                await sendEvent(c, {type: "text-start", id: "txt-id-123"})
                await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "#"})
                await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: " 👋"})
                await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "\n\n"})
                await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "**"})
                await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "hello"})
                await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "!"})
                await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "**"})
                await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: ","})
                await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: " this"})
                await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: " is"})
                await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: " ai"})
                await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: " sdk"})
                await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: " playground"})
                await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "!"})
                await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "\n\n"})
                await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "say"})
                await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: " **"})
                await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "mer"})
                await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "maid"})
                await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "**"})
                await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "."})
                await sendEvent(c, {type: "text-end", id: "txt-id-123"})
            }

            await sendEvent(c, {type: "finish-step"})

            await sendEvent(c, {type: "finish"})

            await sendEvent(c, {type: "data-token", data: {window: 132000, used: 8000}})

            await sendEvent(c, "[DONE]") // terminate sse
        },
    });

    return new HttpResponse(stream, {
        headers: {
            "Content-Type": "text/event-stream",
        }
    });
});

// let refreshCount = 0
const chatPlayground = new Chat<AppUIMessage>({
    transport: new DefaultChatTransport({
        api: "http://example.com/stream",
        async fetch(url, i) {
            // if (refreshCount++ < 2) {
            //     await new Promise(resolve => setTimeout(resolve, 1000));
            //     throw new Error("Failed to fetch")
            // }
            const response = (await stubSSE.run({request: new Request(url, i), requestId: "id"}))?.response;
            if (!response)
                throw new Error("response: " + response)
            return response
        }
    })
})

export default chatPlayground
