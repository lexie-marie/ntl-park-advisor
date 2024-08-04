from operator import itemgetter

from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableParallel

from app.retrievers.vectorstore import vectorstore


prompt_template = """
I'm planning a national parks trip to {destination} during the {season}.
The trip will be {duration} long and I'm interested in {interests}.
"""

PROMPT = PromptTemplate(template=prompt_template, input_variables=["destination", "season", "duration", "interests"])

def get_planning_docs_from_vector_store(state: dict) -> dict:
    print("getting docs")
    prompt_chain = (RunnableParallel(
        destination=itemgetter("destination"),
        season=itemgetter("season"),
        duration=itemgetter("duration"),
        interests=itemgetter("interests")
    ) | PROMPT)
    prompt = prompt_chain.invoke({
        "destination": state["destination"],
        "season": state["season"],
        "duration": state["duration"],
        "interests": state["interests"]
    })
    print(prompt)
    docs = vectorstore.search(prompt.text, k=5, search_type="mmr")
    return {
        **state,
        "documents": docs
    }
