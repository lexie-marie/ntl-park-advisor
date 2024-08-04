from langgraph.constants import END
from langgraph.graph import StateGraph

from app.graph.graph_planning_state import PlanningGraphState
from app.retrievers.doc_store.planning_get_docs_from_vectorstore import get_planning_docs_from_vector_store
from app.validate_docs.validate_planning_docs import validate_planning_docs

workflow = StateGraph(PlanningGraphState)

workflow.add_node("get_docs_from_vector_store", get_planning_docs_from_vector_store)
workflow.add_node("validate_planning_docs", validate_planning_docs)
# workflow.add_node("get_videos", get_videos_from_twelve)
# workflow.add_node("chat_with_docs", chat_with_docs)

workflow.add_edge("get_docs_from_vector_store", "validate_planning_docs")
workflow.add_edge("validate_planning_docs", END)
# workflow.add_edge("get_videos", "chat_with_docs")
# workflow.add_edge("chat_with_docs", END)

workflow.set_entry_point("get_docs_from_vector_store")
planning_graph = workflow.compile()

planning_graph.invoke({"destination": "Rocky Mountain National Park",
                       "season": "summer",
                       "duration": "two weeks",
                       "interests": "wildlife"})
