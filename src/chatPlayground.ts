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
    },
    {
        getWeather: {
            input: string
            output: {
                temperature: number
                condition: string
                rainProbability: number
            }
        }
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
                await sendEvent(c, {type: "reasoning-delta", id: "reason-id-123", delta: " answer"})
                await sendEvent(c, {type: "reasoning-delta", id: "reason-id-123", delta: " the"})
                await sendEvent(c, {type: "reasoning-delta", id: "reason-id-123", delta: " user"})
                await sendEvent(c, {type: "reasoning-delta", id: "reason-id-123", delta: "."})
                await sendEvent(c, {type: "reasoning-end", id: "reason-id-123"})

                await sendEvent(c, {
                    type: "source-url",
                    sourceId: "https://github.com/kmhalvin",
                    url: "https://github.com/kmhalvin"
                })

                await sendEvent(c, {type: "text-start", id: "txt-id-123"})
                switch (msg) {
                    case "do mermaid": {
                        await sendEvent(c, {
                            type: "source-url",
                            sourceId: "https://github.com/rudolfolah/mermaid-diagram-examples/blob/main/diagrams/cause-and-effect.md",
                            url: "https://github.com/rudolfolah/mermaid-diagram-examples/blob/main/diagrams/cause-and-effect.md"
                        })
                        for (const m of mermaid) {
                            await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: m})
                        }
                        break;
                    }
                    case "weather": {
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "ok"})
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: ","})
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: " i'll"})
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: " report"})
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: " the"})
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: " weather"})
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "."})
                        await sendEvent(c, {type: "text-end", id: "txt-id-123"})

                        await sendEvent(c, {type: "tool-input-start", toolCallId: "tool-id-123", toolName: "getWeather"})
                        await sendEvent(c, {type: "tool-input-delta", inputTextDelta: "B", toolCallId: "tool-id-123"})
                        await sendEvent(c, {type: "tool-input-delta", inputTextDelta: "end", toolCallId: "tool-id-123"})
                        await sendEvent(c, {type: "tool-input-delta", inputTextDelta: ".", toolCallId: "tool-id-123"})
                        await sendEvent(c, {type: "tool-input-delta", inputTextDelta: " Hil", toolCallId: "tool-id-123"})
                        await sendEvent(c, {type: "tool-input-delta", inputTextDelta: "ir", toolCallId: "tool-id-123"})
                        await sendEvent(c, {type: "tool-input-delta", inputTextDelta: ",", toolCallId: "tool-id-123"})
                        await sendEvent(c, {
                            type: "tool-input-delta",
                            toolCallId: "tool-id-123",
                            inputTextDelta: " Kecamatan"
                        })
                        await sendEvent(c, {type: "tool-input-delta", inputTextDelta: " Tan", toolCallId: "tool-id-123"})
                        await sendEvent(c, {type: "tool-input-delta", inputTextDelta: "ah", toolCallId: "tool-id-123"})
                        await sendEvent(c, {type: "tool-input-delta", inputTextDelta: " Ab", toolCallId: "tool-id-123"})
                        await sendEvent(c, {type: "tool-input-delta", inputTextDelta: "ang", toolCallId: "tool-id-123"})
                        await sendEvent(c, {type: "tool-input-delta", inputTextDelta: ",", toolCallId: "tool-id-123"})
                        await sendEvent(c, {type: "tool-input-delta", inputTextDelta: " Kota", toolCallId: "tool-id-123"})
                        await sendEvent(c, {
                            type: "tool-input-delta",
                            toolCallId: "tool-id-123",
                            inputTextDelta: " Jakarta"
                        })
                        await sendEvent(c, {type: "tool-input-delta", inputTextDelta: " P", toolCallId: "tool-id-123"})
                        await sendEvent(c, {type: "tool-input-delta", inputTextDelta: "usat", toolCallId: "tool-id-123"})
                        await sendEvent(c, {type: "tool-input-delta", inputTextDelta: ",", toolCallId: "tool-id-123"})
                        await sendEvent(c, {type: "tool-input-delta", inputTextDelta: " Da", toolCallId: "tool-id-123"})
                        await sendEvent(c, {type: "tool-input-delta", inputTextDelta: "erah", toolCallId: "tool-id-123"})
                        await sendEvent(c, {type: "tool-input-delta", inputTextDelta: " Kh", toolCallId: "tool-id-123"})
                        await sendEvent(c, {type: "tool-input-delta", inputTextDelta: "usus", toolCallId: "tool-id-123"})
                        await sendEvent(c, {type: "tool-input-delta", inputTextDelta: " Ib", toolCallId: "tool-id-123"})
                        await sendEvent(c, {type: "tool-input-delta", inputTextDelta: "uk", toolCallId: "tool-id-123"})
                        await sendEvent(c, {type: "tool-input-delta", inputTextDelta: "ota", toolCallId: "tool-id-123"})
                        await sendEvent(c, {
                            type: "tool-input-delta", inputTextDelta: " Jakarta", toolCallId: "tool-id-123"
                        })
                        await sendEvent(c, {
                            type: "tool-input-available",
                            toolName: "getWeather",
                            input: "Bend. Hilir, Kecamatan Tanah Abang, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta",
                            toolCallId: "tool-id-123"
                        })
                        await new Promise(resolve => setTimeout(resolve, 3000))
                        await sendEvent(c, {
                            type: "tool-output-available", toolCallId: "tool-id-123",
                            output: {
                                temperature: 29.2,
                                condition: "Cloudy",
                                rainProbability: 16
                            }
                        })
                        await new Promise(resolve => setTimeout(resolve, 1000))

                        await sendEvent(c, {type: "text-start", id: "txt-id-123"})
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "have"})
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: " a"})
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: " good"})
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: " day"})
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "!"})
                        break;
                    }
                    default: {
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
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "try"})
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: " these"})
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: " commands"})
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: ":"})
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "\n"})
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "-"})
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: " \""})
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "**"})
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "do"})
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: " mer"})
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "maid"})
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "**"})
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "\""})
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "\n"})
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "-"})
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: " \""})
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "**"})
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "weather"})
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "**"})
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "\""})
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "\n"})
                        await sendEvent(c, {type: "text-delta", id: "txt-id-123", delta: "-"})
                        break;
                    }
                }
                await sendEvent(c, {type: "text-end", id: "txt-id-123"})

                await sendEvent(c, {type: "finish-step"})

                await sendEvent(c, {type: "finish"})

                await sendEvent(c, {type: "data-token", data: {window: 132000, used: 8000}})

                await sendEvent(c, "[DONE]") // terminate sse
            }
        });

        return new HttpResponse(stream, {
            headers: {
                "Content-Type": "text/event-stream",
            }
        });
    })
;

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
