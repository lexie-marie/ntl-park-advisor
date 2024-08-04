from dotenv import load_dotenv
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_core.documents import Document


def ask_the_internet(state: dict) -> dict:
    load_dotenv()
    question = state["query"]
    documents = state["relevant_docs"]

    print(f"Asking the internet: {question}\n")

    web_docs = TavilySearchResults(k=5).invoke({"query": question})
    web_results = [Document(page_content=d["content"], metadata={"source": d["url"]}) for d in web_docs]

    all_docs = documents + web_results

    return {
        **state,
        "relevant_documents": all_docs,
    }
