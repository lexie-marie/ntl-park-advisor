import React, {ChangeEvent, SyntheticEvent, useState} from "react";
import {fetchEventSource} from "@microsoft/fetch-event-source";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {BeatLoader} from "react-spinners";
import {VideoJS} from "./videoJS.tsx";

type Season = "spring" | "summer" | "fall" | "winter";

export default function Plan() {
    const [destination, setDestination] = useState<string | null>(null)
    const [season, setSeason] = useState<Season | null>()
    const [duration, setDuration] = useState<string>("")
    const [interests, setInterests] = useState<string>("")
    const [answer, setAnswer] = useState<string>("")
    const [videoUrls, setVideoUrls] = useState<string[]>([])
    const [showSpinner, setShowSpinner] = useState<boolean>(false)

    const onDestinationSelect = (event: React.SyntheticEvent<HTMLSelectElement>) => {
        setDestination(event.currentTarget.value)
    }
    const onSeasonSelect = (event: React.SyntheticEvent<HTMLSelectElement>) => {
        setSeason(event.currentTarget.value as Season)
    }
    const onFormSubmit = async () => {
        setAnswer("")
        setVideoUrls([])
        setShowSpinner(true)
        await fetchEventSource(`${import.meta.env.VITE_API_URL}/planning/stream`, {
            method: 'POST',
            openWhenHidden: true,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                input: {
                    destination: destination,
                    season: season,
                    duration: duration,
                    interests: interests,
                }
            }),
            onmessage(event) {
                if (event.event === "data") {
                    const parsed_data = JSON.parse(event.data)
                    if ('chat_with_docs' in parsed_data) {
                        const chat_results = parsed_data['chat_with_docs']
                        setAnswer(chat_results['answer'])
                        setVideoUrls(chat_results['video_urls'])
                        setShowSpinner(false)
                    }
                }
            }
        })
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
            className="p-6 bg-gray-50 text-medium text-gray-500 rounded-lg w-full container">
            <h3 className="text-lg font-bold text-gray-700 mb-2">Planning Your Trip</h3>
            <form className="max-w-sm mx-auto">
                <label htmlFor="parks" className="mb-2 text-left flex-col flex item">Where would you like to go?</label>
                <select id="parks"
                        onChange={(event: SyntheticEvent<HTMLSelectElement>) => onDestinationSelect(event)}
                        className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option value={"default"} defaultValue={"default"}>Select a National Park</option>
                    <option value="Rocky Mountain National Park">Rocky Mountain National Park</option>
                    <option value="Glacier National Park">Glacier National Park
                    </option>
                </select>
                <div className="p-2"/>
                <label htmlFor="season" className="mb-2 text-left flex-col flex">What time of year?</label>
                <select id="season"
                        onChange={(event: SyntheticEvent<HTMLSelectElement>) => onSeasonSelect(event)}
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
                          className="form-textarea border rounded-lg text-darker-green outline-sage-green bg-stone-100 resize-none w-full focus:outline-none h-auto mr-2 p-2"
                          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setDuration(event.target.value)}></textarea>
                <div className="p-2"/>

                <label htmlFor="interests" className="mb-2 text-left flex-col flex">What are you interested in?</label>
                <textarea id="interests"
                          className="form-textarea border rounded-lg text-darker-green outline-sage-green bg-stone-100 resize-none w-full focus:outline-none h-auto mr-2 p-2"
                          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setInterests(event.target.value)}></textarea>
                <div className="p-2"/>
                <button
                    onClick={onFormSubmit}
                    className="bg-stone-200 text-forest-green outline-sage-green rounded-lg text-center p-2 hover:outline-sage-green w-3/12">
                    Submit
                </button>
            </form>
            {showSpinner && <div className="mt-2"><BeatLoader/></div>}
            {answer && <div className="p-10 my-3 rounded-lg bg-stone-200">
                <div>
                    <h1 className="text-xl text-darker-green mb-1">Your Trip Itinerary</h1>
                    <Markdown remarkPlugins={[remarkGfm]} className="text-left">{answer}</Markdown>
                </div>
                <hr className="my-2"/>
                <div className="">
                    <h1 className="text-xl text-darker-green mb-1">Videos to learn more:</h1>
                    {videoUrls.map((url, index) => (
                        <div className="mb-1" key={index}>
                            <VideoJS {...getPlayerMetadata(url)} />
                        </div>
                    ))}
                </div>
            </div>
            }
        </div>
    )
}