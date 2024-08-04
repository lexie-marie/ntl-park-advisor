from typing import TypedDict, List

from langchain_core.documents import Document
from twelvelabs.models import SearchData

from app.retrievers.get_videos_from_twelve import VideoTranscript


class GraphState(TypedDict):
    query: str
    documents: List[Document] = []
    relevant_docs: List[Document] = []
    videos: List[SearchData] = [],
    video_urls: List[str] = [],
    transcript_data: List[VideoTranscript] =[]
    answer: str
