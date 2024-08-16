import React, {useState} from "react";
import {fetchEventSource} from "@microsoft/fetch-event-source";
import {BeatLoader} from "react-spinners";
import Markdown from "react-markdown";
import {VideoJS} from "./videoJS.tsx";

interface VideoData {
video_id: string;
video_url: string;
transcript: string;
}
interface Message {
    message: string;
    isUser: boolean;
    video_sources?: string[];
}

export default function Learn() {

    const [inputValue, setInputValue] = useState<string>("")
    const [messages, setMessages] = useState<Message[]>([])
    const [showSpinner, setShowSpinner] = useState<boolean>(false)
    const [sources, setSources] = useState<string[]>([])

    function handleReceiveMessage(answer: string, video_urls: VideoData[], source_urls: string[]) {
        const urls = video_urls.map(video => video.video_url)
        setMessages(prevMessages => [...prevMessages, {message: answer, isUser: false, video_sources: urls}]);
        setSources(source_urls)
        setShowSpinner(false)
    }

    const handleSendMessage = async (message: string) => {
        setInputValue("")
        setShowSpinner(true)
        setMessages(prevMessages => [...prevMessages, {message, isUser: true}]);
        await fetchEventSource(`${import.meta.env.VITE_API_URL}/rag/stream`, {
            method: 'POST',
            openWhenHidden: true,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                input: {
                    query: message,
                    chat_history: messages
                },
            }),
            onmessage(event) {
                if (event.event === "data") {
                    const parsed_data = JSON.parse(event.data)
                    if ('chat_with_docs' in parsed_data) {
                        const chat_results = parsed_data['chat_with_docs']
                        const answer = chat_results['answer']
                        const source_urls = chat_results['sources']
                        const video_urls = chat_results['relevant_videos']
                        handleReceiveMessage(answer, video_urls, source_urls);
                    }
                }
            }
        })
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            handleSendMessage(inputValue.trim())
        }
    }

    const getPlayerMetadata = (source: string) => {
        return {
            "fill": true,
            "fluid": true,
            "autoplay": false,
            "controls": true,
            "preload": "metadata",
            "sources": [{
                "src": source,
                "type": "application/x-mpegURL"
            }]
        };
    }

    return (
        <div
            className="p-6 bg-gray-50 text-medium text-gray-500 rounded-lg w-full min-w-full h-full">
            <h3 className="text-lg font-bold text-darker-green mb-2">Learn about the National Parks</h3>
            <div className="border-b border-stone-400 p-4 overflow-auto max-h-96">
                {messages.map((message, index) => (
                    <div key={index}
                         className={`p-2 my-3 rounded-lg ${message.isUser ? "text-gray-500" : "text-white bg-stone-400"}`}>
                        <Markdown
                            className={`${message.isUser ? "text-right" : "text-left"}`}>{message.message}</Markdown>

                        {!message.isUser && (
                            <>
                            {!!message.video_sources && <>
                                <div className="text-lg text-darker-green my-4">Videos for you:</div>
                                <div className="text-xs">
                                    {message.video_sources?.map((source, index) => (
                                        <div key={index}>
                                            {
                                                <VideoJS {...getPlayerMetadata(source)} />
                                            }
                                        </div>
                                    ))}
                                </div>
                            </>}
                                <div className="text-xs">
                                    {sources.map((source, index) => (
                                        <div key={index}>
                                            <a target="_blank"
                                               download
                                               href={`${encodeURI(source)}`}
                                               rel="noopener noreferrer">
                                                {source}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
            {showSpinner && <div className="mt-2"><BeatLoader/></div>}
            <div className="p-2 flex items-end">
                <textarea
                    placeholder="Enter your search about the National Parks..."
                    className="form-textarea  rounded-lg text-darker-green outline-sage-green bg-stone-200 resize-none w-11/12 focus:outline-none h-auto mr-2 p-2"
                    onKeyUp={handleKeyPress}
                    onChange={(e) => setInputValue(e.target.value)}
                    value={inputValue}
                ></textarea>
                <button
                    onClick={() => {
                        handleSendMessage(inputValue)
                    }}
                    className="bg-stone-200 text-forest-green outline-sage-green rounded-lg text-center p-2 hover:outline-sage-green w-1/12">
                    Search
                </button>
            </div>
        </div>
    )
}