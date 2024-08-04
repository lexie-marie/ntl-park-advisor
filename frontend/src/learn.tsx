import {useState} from "react";
import {fetchEventSource} from "@microsoft/fetch-event-source";

export default function Learn() {

    const [inputValue, setInputValue] = useState<string>("")
    // const [message, setMessage] = useState<string>("")
    const handleSendMessage = async (message: string) => {
        setInputValue("")

        // setMessage(prevMessages => [...prevMessages, {message, isUser: true}]);
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
                // if (event.event === "data") {
                //     handleReceiveMessage(event.data);
                // }
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
            className="p-6 bg-gray-50 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full min-w-full h-full">
            <h3 className="text-lg font-bold text-gray-700 dark:text-white mb-2">Learn about the National Parks</h3>
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