from langgraph.constants import END
from langgraph.graph import StateGraph

from app.chat.chat import chat_with_docs
from app.graph.graph_state import GraphState
from app.retrievers.doc_store.get_docs_from_vectorstore import get_docs_from_vector_store
from app.validate_docs.validate_docs import validate_docs

workflow = StateGraph(GraphState)

workflow.add_node("get_docs_from_vector_store", get_docs_from_vector_store)
workflow.add_node("validate_docs", validate_docs)
workflow.add_node("chat_with_docs", chat_with_docs)

workflow.add_edge("get_docs_from_vector_store", "validate_docs")
workflow.add_edge("validate_docs", "chat_with_docs")
workflow.add_edge("chat_with_docs", END)

workflow.set_entry_point("get_docs_from_vector_store")
graph = workflow.compile()

# graph.invoke({"query": "what kind of hikes are at rocky mountain national park?"})
