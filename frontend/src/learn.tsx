import {useState} from "react";
import {fetchEventSource} from "@microsoft/fetch-event-source";
import {BeatLoader} from "react-spinners";
import Markdown from "react-markdown";

interface Message {
    message: string;
    isUser: boolean;
    sources?: string[];
}

export default function Learn() {

    const [inputValue, setInputValue] = useState<string>("")
    const [messages, setMessages] = useState<Message[]>([])
    const [showSpinner, setShowSpinner] = useState<boolean>(false)

    function handleReceiveMessage(answer: string, video_urls: string[]) {
        setMessages(prevMessages => [...prevMessages, {message: answer, isUser: false, sources: video_urls}]);
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
                    chat_history:messages
                },
            }),
            onmessage(event) {
                if (event.event === "data") {
                    const parsed_data = JSON.parse(event.data)
                    if('chat_with_docs' in parsed_data){
                        const chat_results = parsed_data['chat_with_docs']
                        const answer = chat_results['answer']
                        const video_urls = chat_results['video_urls']
                        handleReceiveMessage(answer, video_urls);
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

    return (
        <div
            className="p-6 bg-gray-50 text-medium text-gray-500 rounded-lg w-full min-w-full h-full">
            <h3 className="text-lg font-bold text-darker-green mb-2">Learn about the National Parks</h3>
            <div className="border-b border-stone-400 p-4 overflow-auto max-h-96">
                {messages.map((message, index) => (
                    <div key={index}
                         className={`p-2 my-3 rounded-lg ${message.isUser ? "text-gray-500" : "text-white bg-stone-400"}`}>
                        <Markdown className={`${message.isUser ? "text-right" : "text-left"}`}>{message.message}</Markdown>

                        {!message.isUser && (
                            <div className="text-xs">
                                {message.sources?.map((source, _) => (
                                    <div>
                                        <video width="352" height="198" controls>
                                            <source src={source} type="application/x-mpegURL" />
                                        </video>
                                    </div>
                                ))}
                            </div>
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