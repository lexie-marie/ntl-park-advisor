from operator import itemgetter

from langchain_core.documents import Document
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableParallel

from app.llms.llms import groq_chat

prompt_template = """
# Context
=================
You are an expert at planning National Park trips. 
You are knowledgeable about all the things to consider when planning a trip to a National Park

# Instructions
=================
Create an itinerary for a National Park trip to {destination} during the {season}.
The trip will be {duration} long and the traveler is interested in {interests}.
Give information about the weather so the traveler can pack accordingly.
Give information about if the traveler needs to make reservations for entry to the park.
Additionally, create a markdown table with the following columns:
- Day
- Activity
- Time
- Location
Be sure to create a detailed itinerary that includes all the activities and locations the traveler should visit each day.

# Start Analysis
=================
Given the following context:
{context}

Create an itinerary:
"""

PROMPT = PromptTemplate(template=prompt_template, input_variables=["destination", "season", "duration", "interests", "context"])


# def transform_transcripts(state: dict) -> list[Document]:
#     print("transforming transcripts")
#     transcript_documents = []
#     for video in state["transcript_data"]:
#         transcript_documents.append(Document(video['transcript']))
#     return transcript_documents


def chat_with_planning_docs(state: dict) -> dict:
    print("chatting with docs")

    # transcripts = transform_transcripts(state)

    chain = (RunnableParallel(
        context=itemgetter("context"),
        destination=itemgetter("destination"),
        season=itemgetter("season"),
        duration=itemgetter("duration"),
        interests=itemgetter("interests")
    ) | PROMPT | groq_chat)
    answer = chain.invoke(
        {"destination": state["destination"],
         "season": state["season"],
         "duration": state["duration"],
         "interests": state["interests"],
         "context": state["relevant_docs"] # + transcripts,
         })
    print(answer)
    return {
        **state,
        "answer": answer.content
    }
