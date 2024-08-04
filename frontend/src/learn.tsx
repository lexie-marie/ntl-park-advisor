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
        await fetchEventSource(`${"http://localhost:8000"}/rag/stream`, {
            method: 'POST',
            openWhenHidden: true,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                input: {
                    query: message,
                },
                // config: {
                //     configurable: {
                //         sessionId: session_id_ref.current
                //     }
                // }
            }),
            onmessage(event) {
                console.log(event)
                if (event.event === "data") {
                    const parsed_data = JSON.parse(event.data)
                    if('chat_with_docs' in parsed_data){
                        const chat_results = parsed_data['chat_with_docs']
                        const answer = chat_results['answer']
                        const video_urls = chat_results['urls']
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
            <h3 className="text-lg font-bold text-gray-700 mb-2">Learn about the National Parks</h3>
            <div className="border-b border-gray-600 p-4 overflow-auto">
                {messages.map((message, index) => (
                    <div key={index}
                         className={`p-2 my-3 rounded-lg text-white ${message.isUser ? "bg-gray-800" : "bg-gray-900"}`}>
                        <Markdown className={`${message.isUser ? "text-right" : "text-left"}`}>{message.message}</Markdown>

                        {!message.isUser && (
                            <div className="text-xs">
                                <hr className="border-b mt-5 mb-5"/>
                                {message.sources?.map((source, index) => (
                                    <div>
                                        {/*<a target="_blank"*/}
                                        {/*   download*/}
                                        {/*   href={`${process.env.REACT_APP_BACKEND_URL}/rag/static/${encodeURI(formatSource(source))}`}*/}
                                        {/*   rel="noreferrer"*/}
                                        {/*>{formatSource(source)}</a>*/}
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
                    className="form-textarea border rounded-lg text-darker-green outline-sage-green bg-stone-200 resize-none w-11/12 focus:outline-none h-auto mr-2 p-2"
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