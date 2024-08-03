from operator import itemgetter

from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableParallel
from pydantic import BaseModel, Field

from app.llms.llms import groq_chat

system = "You are a helpful assistant."
human = "Given the query: {query}"

prompt_template = """
Given the query: {query}
And the document: {doc}

Is this document relevant to the query? Answer only Yes or No.
"""

PROMPT = PromptTemplate(template=prompt_template, input_variables=["query", "doc"])


class DocRelevancy(BaseModel):
    """Is a document relevant to a query?"""

    relevancy: str = Field(
        description="Document relevancy, 'Yes', 'No'",
    )


def validate_docs(state: dict) -> dict:
    print("validating docs")
    docs = state["documents"]
    query = state["query"]
    relevant_docs = []

    for doc in docs:
        chain = (RunnableParallel(
            doc=itemgetter("doc"),
            query=itemgetter("query")
        ) | PROMPT | groq_chat.with_structured_output(DocRelevancy))
        relevancy = chain.invoke({"query": query, "doc": doc})
        if relevancy.relevancy == "Yes":
            relevant_docs.append(doc)

    return {
        **state,
        "relevant_docs": relevant_docs
    }
