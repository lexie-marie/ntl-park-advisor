from operator import itemgetter
from typing import List

from dotenv import load_dotenv
from langchain_core.documents import Document
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableParallel

from app.llms.llms import groq_chat

prompt_template = """
# Context
=================
You are an expert National Park Ranger. You are knowledgeable about science and history.

# Start Analysis
=================
Given the following context:
{context}

Answer the question: {query}
"""

PROMPT = PromptTemplate(template=prompt_template, input_variables=["query", "context"])


def transform_transcripts(state: dict) -> list[Document]:
    print("transforming transcripts")
    transcript_documents = []
    for video in state["transcript_data"]:
        transcript_documents.append(Document(video.transcript))
    return transcript_documents


def chat_with_docs(state: dict) -> dict:
    print("chatting with docs")

    transcripts = transform_transcripts(state)

    chain = (RunnableParallel(
        context=itemgetter("context"),
        query=itemgetter("query")
    ) | PROMPT | groq_chat)
    answer = chain.invoke(
        {"query": state["query"],
         "context": state["relevant_docs"] + transcripts,
         })
    print(answer)
    return {
        **state,
        "answer": answer.content
    }
