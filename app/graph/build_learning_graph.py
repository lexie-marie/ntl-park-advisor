from langgraph.constants import END
from langgraph.graph import StateGraph

from app.chat.chat import chat_with_docs
from app.graph.ask_internet_decision import decide_to_ask_internet
from app.graph.graph_learning_state import LeaningGraphState
from app.retrievers.ask_the_internet import ask_the_internet
from app.retrievers.doc_store.learning_get_docs_from_vectorstore import get_learning_docs_from_vector_store
from app.retrievers.get_videos_from_twelve import get_videos_from_twelve
from app.validate_docs.validate_learning_docs import validate_learning_docs

workflow = StateGraph(LeaningGraphState)

workflow.add_node("get_docs_from_vector_store", get_learning_docs_from_vector_store)
workflow.add_node("validate_docs", validate_learning_docs)
workflow.add_node("get_videos", get_videos_from_twelve)
workflow.add_node("chat_with_docs", chat_with_docs)
workflow.add_node("ask_the_internet", ask_the_internet)

workflow.add_edge("get_docs_from_vector_store", "validate_docs")
workflow.add_conditional_edges("validate_docs",
                               decide_to_ask_internet,
                               {
                                   "get_videos": "get_videos",
                                   "ask_the_internet": "ask_the_internet",
                               })
workflow.add_edge("ask_the_internet", "get_videos")
workflow.add_edge("get_videos", "chat_with_docs")
workflow.add_edge("chat_with_docs", END)

workflow.set_entry_point("get_docs_from_vector_store")
learning_graph = workflow.compile()
