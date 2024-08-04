from operator import itemgetter
from typing import List

from langchain_core.documents import Document
from langchain_core.messages import get_buffer_string
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableParallel, RunnablePassthrough, RunnableWithMessageHistory

from app.llms.llms import groq_chat

_template = """Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its orignal language,

Chat history: 
{chat_history}
Follow Up Input: {question}
Standalone Question:"""

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
condense_question_prompt = PromptTemplate.from_template(_template)


def transform_transcripts(state: dict) -> list[Document]:
    transcript_documents = []
    for video in state["transcript_data"]:
        transcript_documents.append(Document(video['transcript']))
    return transcript_documents


def transform_chat_history(state: dict) -> str:
    history = ""
    for message in state["chat_history"]:
        if message["isUser"]:
            history = history + "Human: " + message["message"]+"\n"
        else:
            history = history + "AI: " + message["message"]+"\n"
    return history


def chat_with_docs(state: dict) -> dict:
    chat_history_formatted = transform_chat_history(state)

    standalone_question = RunnableParallel(
        question=RunnableParallel(
            question=itemgetter("query"),
            chat_history=itemgetter("chat_history")
        ) | condense_question_prompt | groq_chat | StrOutputParser()
    )
    transcripts = transform_transcripts(state)

    chain = (standalone_question |
             RunnableParallel(
                 context=RunnablePassthrough(),
                 query=RunnablePassthrough(),
                 chat_history=RunnablePassthrough()
             ) | PROMPT | groq_chat)

    answer = chain.invoke(
        {"query": state["query"],
         "context": state["relevant_docs"] + transcripts,
         "chat_history": chat_history_formatted
         })
    return {
        **state,
        "answer": answer.content
    }
