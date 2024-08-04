from typing import TypedDict, List

from langchain_core.documents import Document


class LeaningGraphState(TypedDict):
    query: str
    documents: List[Document] = []
    relevant_docs: List[Document] = []
    video_urls: List[str] = [],
    transcript_data: List[object] = [],
    answer: str
