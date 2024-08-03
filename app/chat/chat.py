from operator import itemgetter

from dotenv import load_dotenv
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


def chat_with_docs(state: dict) -> dict:
    print("chatting with docs")

    chain = (RunnableParallel(
        context=itemgetter("context"),
        query=itemgetter("query")
    ) | PROMPT | groq_chat)
    answer = chain.invoke({"query": state["query"], "context": state["relevant_docs"]})

    print(answer)
    return {
        **state,
        "answer": answer.content
    }
