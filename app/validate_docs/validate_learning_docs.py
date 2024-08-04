from operator import itemgetter

from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableParallel

from app.llms.llms import groq_chat

prompt_template = """
Given the query: {query}
And the document: {doc}

Is this document relevant to the query? Answer only Yes or No.
"""

PROMPT = PromptTemplate(template=prompt_template, input_variables=["query", "doc"])


def validate_learning_docs(state: dict) -> dict:
    docs = state["documents"]
    query = state["query"]
    relevant_docs = []

    for doc in docs:
        chain = (RunnableParallel(
            doc=itemgetter("doc"),
            query=itemgetter("query")
        ) | PROMPT | groq_chat)
        relevancy = chain.invoke({"query": query, "doc": doc})
        if "yes" in relevancy.content.lower():
            relevant_docs.append(doc)

    return {
        **state,
        "relevant_docs": relevant_docs
    }