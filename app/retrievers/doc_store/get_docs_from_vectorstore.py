from app.retrievers.vectorstore import vectorstore


def get_docs_from_vector_store(state: dict) -> dict:
    print("getting docs")
    docs = vectorstore.search(state["query"], k=5, search_type="mmr")
    return {
        **state,
        "documents": docs
    }

# print(get_docs_from_vector_store("what kind of wildlife is at rocky mountain national park?"))
