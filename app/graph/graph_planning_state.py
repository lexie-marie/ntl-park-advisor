from typing import TypedDict, List

from langchain_core.documents import Document


class PlanningGraphState(TypedDict):
    destination: str
    season: str
    duration: str
    interests: str
    documents: List[Document] = []
    relevant_docs: List[Document] = []
    video_urls: List[str] = []
    answer: str
