# ntl-park-advisor
We created an application during the [AI Tinkerers Denver Multimodal Hackathon](https://denver-boulder.aitinkerers.org/p/ai-tinkerers-denver-multimodal-hackathon)
The application helps people both research and plan their National Park trips. 
We use RAG to create two different RAG pipelines depending on if the user wants to learn about a Park or plan a trip to a National Park.

## Tech used:
- [Pinecone](https://www.pinecone.io/) data store to search for park information. 
- [TwelveLabs](https://www.twelvelabs.io/) was used for searching videos, ripping transcripts, and classifying the video content.
- Since we only uploaded data to pinecone for a couple parks, we search the internet using [Tavily](https://tavily.com/) for content when there are not enough documents.
- [Langgraph](https://langchain-ai.github.io/langgraph/) is used for the workflow.
- We use [Groq](https://groq.com/) for our llm and the fast inference speed.

## Creators:
**About Lexie:** Lexie is a full-stack software engineer with a background in Applied Mathematics. She is a Consultant with Focused Labs concentrating on building scalable web applications while incorporating CI/CD and observability platforms for continued success. Her passion for AI is newly forming, but she’s excited to keep learning new AI technologies and applications. [LinkedIn](https://www.linkedin.com/in/lexie-marinelli/)

**About Sarah:** Sarah is a seasoned full-stack software engineer specializing in AI. She’s passionate about using RAG and loves to try new frameworks. Currently, she’s working as a Senior Software Consultant with Focused Labs on RAG data pipelines to extract structured data, perform searches, and identify speakers from transcripts.
[LinkedIn](https://www.linkedin.com/in/sarah-kainec/)

## Front end
Front end will need a .env file with the following variables in the `.\frontend` directory:
```
VITE_API_URL = "http://localhost:8000"
```

cd into the `frontend` directory and run the following commands:
```
npm i
```
Then you can run the following command to start the front end:
```
npm run dev
```

## Back end
## Installation

Install the LangChain CLI if you haven't yet

```bash
pip install -U langchain-cli
```

Navigate to the root directory and set up you virtual environment:


```bash
python3 -m venv .venv  
source .venv/bin/activate
poetry install
```

Create a .env file in the root directory with the following variables:
```
PINECONE_API_KEY=<pinecone key>
OPENAI_API_KEY=<openai key>
TL_API_KEY=<twelve labs key>
GROQ_API_KEY=<groq key>
TAVILY_API_KEY=<tavily api key>
```
We can send our .env if  you are trying to run the project locally.

Run the following command to start the backend:
```bash
langchain serve
```