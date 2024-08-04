import {useState} from "react";
// import {fetchEventSource} from "@microsoft/fetch-event-source";
type Season = "spring" | "summer" | "fall" | "winter";

export default function Plan() {
    const [, setDestination] = useState<string | null>(null)
    const [,setSeason] = useState<Season | null>()
    const [, setDuration] = useState<number | null>()
    const [, setInterests] = useState<string>("")
    const onDestinationSelect = (event: React.SyntheticEvent<HTMLSelectElement>) => {
        setDestination(event.currentTarget.value)
    }
    const onSeasonSelect = (event: React.SyntheticEvent<HTMLSelectElement>) => {
        setSeason(event.currentTarget.value as Season)
    }
    const onDurationSelect = (event: React.SyntheticEvent<HTMLSelectElement>) => {
        setDuration(parseInt(event.currentTarget.value))
    }

    // const handleSendMessage = async (message: string) => {
    //     setInputValue("")
    //
    //     // setMessage(prevMessages => [...prevMessages, {message, isUser: true}]);
    //     await fetchEventSource(`${"http://localhost:8000"}/rag/stream`, {
    //         method: 'POST',
    //         openWhenHidden: true,
    //         headers: {"Content-Type": "application/json"},
    //         body: JSON.stringify({
    //             input: {
    //                 destination: destination,
    //                 season: season,
    //                 duration: duration,
    //                 interests: interests,
    //             },
    //             // config: {
    //             //     configurable: {
    //             //         sessionId: session_id_ref.current
    //             //     }
    //             // }
    //         }),
    //         onmessage(event) {
    //             console.log(event)
    //             // if (event.event === "data") {
    //             //     handleReceiveMessage(event.data);
    //             // }
    //         }
    //     })
    // }

    const onFormSubmit = () => {

    }

    return (
        <div
            className="p-6 bg-gray-50 text-medium text-gray-500 rounded-lg w-full">
            <h3 className="text-lg font-bold text-gray-700 mb-2">Planning Your Trip</h3>
            <form className="max-w-sm mx-auto">
                <label htmlFor="parks" className="mb-2 text-left flex-col flex">Where would you like to go?</label>
                <select id="parks"
                        onSelect={(event: React.SyntheticEvent<HTMLSelectElement>) => onDestinationSelect(event)}
                        className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option value={"default"} defaultValue={"default"}>Select a National Park</option>
                    <option value="RMNP">Rocky Mountain National Park</option>
                    <option value="GNP">Glacier National Park
                    </option>
                </select>
                <div className="p-2"/>
                <label htmlFor="season" className="mb-2 text-left flex-col flex">What time of year?</label>
                <select id="season"
                        onSelect={(event: React.SyntheticEvent<HTMLSelectElement>) => onSeasonSelect(event)}
                        className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option value={"default"} defaultValue={"default"}>Choose a season</option>
                    <option value="spring">Spring</option>
                    <option value="summer">Summer</option>
                    <option value="fall">Fall</option>
                    <option value="winter">Winter</option>
                </select>
                <div className="p-2"/>

                <label htmlFor="duration" className="mb-2 text-left flex-col flex">How long?</label>
                <select id="duration"
                        onSelect={(event: React.SyntheticEvent<HTMLSelectElement>) => onDurationSelect(event)}
                        className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option value={"default"} defaultValue={"default"}>Select trip duration (days)</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8+">8+</option>
                </select>
                <div className="p-2"/>

                <label htmlFor="interests" className="mb-2 text-left flex-col flex">What are you interested in?</label>
                <textarea id="interests" className="form-textarea border rounded-lg text-darker-green outline-sage-green bg-stone-100 resize-none w-12/12 focus:outline-none h-auto mr-2 p-2"
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setInterests(event.target.value)}></textarea>
                <div className="p-2"/>
                <button onClick={onFormSubmit} >Submit</button>
            </form>

        </div>
    )
}