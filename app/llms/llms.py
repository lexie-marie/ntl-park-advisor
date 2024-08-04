from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()
groq_chat = ChatGroq(temperature=0, model_name="llama-3.1-8b-instant")
