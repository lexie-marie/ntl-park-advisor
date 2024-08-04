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
    print("transforming transcripts")
    transcript_documents = []
    for video in state["transcript_data"]:
        transcript_documents.append(Document(video['transcript']))
    return transcript_documents


def transform_chat_history(state: dict) -> List[object]:
    history = []
    for message in state["chat_history"]:
        if message["isUser"]:
            history.append("Human:" + message["message"])
        else:
            history.append("AI:" + message["message"])

    return history


def chat_with_docs(state: dict) -> dict:
    print("chatting with docs")

    chat_history_formatted = transform_chat_history(state["chat_history"])

    standalone_question = RunnableParallel(
        question=RunnableParallel(
            question=itemgetter("query"),
            chat_history=lambda x: get_buffer_string(x["chat_history"])
        ) | condense_question_prompt | groq_chat | StrOutputParser()
    )
    transcripts = transform_transcripts(state)

    chain = (standalone_question |
             RunnableParallel(
                 context=itemgetter("context"),
                 query=itemgetter("question"),
                 chat_history=itemgetter("chat_history")
             ) | PROMPT | groq_chat)

    # final_chain = RunnableWithMessageHistory(
    #     runnable=standalone_question | chain,
    #     input_messages_key="question",
    #     history_messages_key="chat_history",
    #     output_messages_key="answer",
    #     get_session_history=
    # )

    answer = chain.invoke(
        {"query": state["query"],
         "context": state["relevant_docs"] + transcripts,
         "chat_history": state["chat_history"]
         })
    print(answer)
    return {
        **state,
        "answer": answer.content
    }
