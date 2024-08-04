import React, {ChangeEvent, SyntheticEvent, useState} from "react";
import {fetchEventSource} from "@microsoft/fetch-event-source";
// import {fetchEventSource} from "@microsoft/fetch-event-source";
type Season = "spring" | "summer" | "fall" | "winter";

export default function Plan() {
    const [destination, setDestination] = useState<string | null>(null)
    const [season,setSeason] = useState<Season | null>()
    const [duration, setDuration] = useState<string>()
    const [interests, setInterests] = useState<string>("")
    const onDestinationSelect = (event: React.SyntheticEvent<HTMLSelectElement>) => {
        setDestination(event.currentTarget.value)
    }
    const onSeasonSelect = (event: React.SyntheticEvent<HTMLSelectElement>) => {
        setSeason(event.currentTarget.value as Season)
    }
    const handleSendMessage = async (message: string) => {
        // setMessage(prevMessages => [...prevMessages, {message, isUser: true}]);
        await fetchEventSource(`${import.meta.env.VITE_API_URL}/rag/stream`, {
            method: 'POST',
            openWhenHidden: true,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                input: {
                    destination: destination,
                    season: season,
                    duration: duration,
                    interests: interests,
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

    const onFormSubmit = () => {
        // todo: do something
    }

    return (
        <div
            className="p-6 bg-gray-50 text-medium text-gray-500 rounded-lg w-full container">
            <h3 className="text-lg font-bold text-gray-700 mb-2">Planning Your Trip</h3>
            <form className="max-w-sm mx-auto">
                <label htmlFor="parks" className="mb-2 text-left flex-col flex item">Where would you like to go?</label>
                <select id="parks"
                        onSelect={(event: SyntheticEvent<HTMLSelectElement>) => onDestinationSelect(event)}
                        className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option value={"default"} defaultValue={"default"}>Select a National Park</option>
                    <option value="RMNP">Rocky Mountain National Park</option>
                    <option value="GNP">Glacier National Park
                    </option>
                </select>
                <div className="p-2"/>
                <label htmlFor="season" className="mb-2 text-left flex-col flex">What time of year?</label>
                <select id="season"
                        onSelect={(event: SyntheticEvent<HTMLSelectElement>) => onSeasonSelect(event)}
                        className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option value={"default"} defaultValue={"default"}>Choose a season</option>
                    <option value="spring">Spring</option>
                    <option value="summer">Summer</option>
                    <option value="fall">Fall</option>
                    <option value="winter">Winter</option>
                </select>
                <div className="p-2"/>

                <label htmlFor="duration" className="mb-2 text-left flex-col flex">How many days?</label>
                <textarea id="duration"
                          className="form-textarea border rounded-lg text-darker-green outline-sage-green bg-stone-100 resize-none w-12/12 focus:outline-none h-auto mr-2 p-2"
                          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setDuration(event.target.value)}></textarea>
                <div className="p-2"/>

                <label htmlFor="interests" className="mb-2 text-left flex-col flex">What are you interested in?</label>
                <textarea id="interests"
                          className="form-textarea border rounded-lg text-darker-green outline-sage-green bg-stone-100 resize-none w-12/12 focus:outline-none h-auto mr-2 p-2"
                          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setInterests(event.target.value)}></textarea>
                <div className="p-2"/>
                <button
                    onClick={onFormSubmit}
                    className="bg-stone-200 text-forest-green outline-sage-green rounded-lg text-center p-2 hover:outline-sage-green w-3/12">
                    Submit
                </button>
            </form>

        </div>
    )
}