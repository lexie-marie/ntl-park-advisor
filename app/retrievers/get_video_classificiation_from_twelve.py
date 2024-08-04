import os

from dotenv import load_dotenv
from pydantic import BaseModel
from twelvelabs import TwelveLabs

from app.utils.consts import TL_INDEX_ID


class VideoTranscript(BaseModel):
    video_id: str
    video_url: str
    transcript: str


classification = [
    {
        "name": "Rocky Mountain National Park",
        "prompts": [
            "Things to do in Rocky Mountain National Park",
            "Learn about Rocky Mountain National Park",
            "Prepare for a trip to Rocky Mountain National Park",
            "RMNP",
            "Colorado"
        ]
    },
    {
        "name": "Glacier National Park",
        "prompts": [
            "Things to do in Glacier National Park",
            "Wildlife at Glacier National Park",
            "Ecology of Glacier National Park",
            "Glacier Science",
            "Montana"
        ]
    }
]


def get_classified_videos_from_twelve(state: dict) -> dict:
    print("getting videos")
    load_dotenv()
    client = TwelveLabs(api_key=os.getenv("TL_API_KEY"))

    classified_result = client.classify.index(
        index_id=TL_INDEX_ID,
        options=["visual"],
        classes=classification,
    )

    filtered_search = []
    unique_vids_id = []
    for clips in classified_result.data.root:
        if clips.video_id not in unique_vids_id:
            unique_vids_id.append(clips.video_id)
            filtered_search.append(clips)

    urls = []
    for id in unique_vids_id[0:4]:
        url = client.index.video.retrieve(index_id=TL_INDEX_ID, id=id)
        urls.append(url)

    return {
        **state,
        "video_urls": [url.hls.video_url for url in urls],
    }


# query = "Tell me about pollinators in Glacier."
# print("final output =", get_videos_from_twelve({"query": query}))
