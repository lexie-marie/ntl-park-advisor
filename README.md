# ntl-park-advisor

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