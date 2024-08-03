from typing import TypedDict, List
from xml.dom.minidom import Document


class GraphState(TypedDict):
    query: str
    documents: List[Document]
    relevant_docs: List[Document]
    answer: str
