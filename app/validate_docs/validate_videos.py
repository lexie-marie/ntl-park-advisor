from operator import itemgetter

from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableParallel

from app.llms.llms import groq_chat

prompt_template = """
Given the query: {query}
And the video transcript: {transcript}

Given your knowledge of every National Park in the United States. Is this video relevant to the query?
Answer only Yes or No.
"""

PROMPT = PromptTemplate(template=prompt_template, input_variables=["query", "transcript"])


def validate_videos(state: dict) -> dict:
    transcript_vids = state["transcript_data"]
    query = state["query"]
    relevant_vids = []

    for vid_data in transcript_vids:
        chain = (RunnableParallel(
            transcript=itemgetter("transcript"),
            query=itemgetter("query")
        ) | PROMPT | groq_chat)
        relevancy = chain.invoke({"query": query, "transcript": vid_data["transcript"]})
        if "yes" in relevancy.content.lower():
            relevant_vids.append(vid_data)
    # print("relevent vids start", relevant_vids, "relevant vids end")
    return {
        **state,
        "relevant_videos": relevant_vids
    }
