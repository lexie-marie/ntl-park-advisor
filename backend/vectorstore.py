import os

from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
from langchain_pinecone import PineconeVectorStore

from backend.consts import EMBEDDING_MODEL

load_dotenv()

embeddings = OpenAIEmbeddings(
    model=EMBEDDING_MODEL,
    openai_api_key=os.getenv("OPENAI_API_KEY"),
)

vectorstore = PineconeVectorStore(
    index_name="ntlparkadvisor",
    embedding=embeddings,
    pinecone_api_key=os.getenv("PINECONE_API_KEY"),
)