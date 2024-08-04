import os

from dotenv import load_dotenv
from pydantic import BaseModel
from twelvelabs import TwelveLabs

from app.utils.consts import TL_INDEX_ID


class VideoTranscript(BaseModel):
    video_id: str
    video_url: str
    transcript: str


def get_videos_from_twelve(state: dict) -> dict:
    load_dotenv()
    client = TwelveLabs(api_key=os.getenv("TL_API_KEY"))

    search_results = client.search.query(
        index_id=TL_INDEX_ID,
        query_text=state["query"],
        options=["visual"]
    )

    filtered_search = []
    unique_vids_id = []
    for clips in search_results.data.root:
        if clips.video_id not in unique_vids_id:
            unique_vids_id.append(clips.video_id)
            filtered_search.append(clips)

    transcript_data = []
    urls = []
    for id in unique_vids_id[0:4]:
        script = client.index.video.transcription(
            index_id=TL_INDEX_ID,
            id=id
        )
        url = client.index.video.retrieve(index_id=TL_INDEX_ID, id=id)
        urls.append(url)
        transcript_data.append(VideoTranscript(video_id=id, video_url=url.hls.video_url, transcript=script))

    return {
        **state,
        "videos": filtered_search[0:4],
        "video_urls": urls,
        "transcript_data": transcript_data
    }


# query = "Tell me about pollinators in Glacier."
# get_videos_from_twelve({"query": query})
