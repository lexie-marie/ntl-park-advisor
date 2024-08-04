from operator import itemgetter

from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableParallel

from app.llms.llms import groq_chat

prompt_template = """
query: I'm planning a national parks trip to {destination} during the {season}.
The trip will be {duration} long and I'm interested in {interests}.

Given the document: {doc}

Is this document relevant to the query? Answer only Yes or No.
"""

PROMPT = PromptTemplate(
    template=prompt_template,
    input_variables=["destination", "season", "duration", "interests", "doc"])


def validate_planning_docs(state: dict) -> dict:
    print("validating docs")
    docs = state["documents"]
    relevant_docs = []

    for doc in docs:
        chain = (RunnableParallel(
            doc=itemgetter("doc"),
            destination=itemgetter("destination"),
            season=itemgetter("season"),
            duration=itemgetter("duration"),
            interests=itemgetter("interests")
        ) | PROMPT | groq_chat)

        relevancy = chain.invoke({
            "destination": state["destination"],
            "season": state["season"],
            "duration": state["duration"],
            "interests": state["interests"],
            "doc": doc
        })
        if "yes" in relevancy.content.lower():
            print(f"Document {doc} is relevant {relevancy.content}")
            relevant_docs.append(doc)

    return {
        **state,
        "relevant_docs": relevant_docs
    }

