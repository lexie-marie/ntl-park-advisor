import os
from typing import Literal, List, Tuple, Any

from dotenv import load_dotenv
from openai import BaseModel
from twelvelabs import TwelveLabs
from twelvelabs.models import SearchData

from app.utils.consts import TL_INDEX_ID


def get_videos_from_twelve(state: dict) -> dict:
    load_dotenv()
    client = TwelveLabs(api_key=os.getenv("TL_API_KEY"))

    search_results = client.search.query(
        index_id=TL_INDEX_ID,
        query_text=state["query"],
        options=["visual"]
    )

    print(search_results.data.root[0:9])

    return {
        **state,
        "videos": search_results.data.root[0:9]
    }


query = "Tell me about pollinators in Glacier."
get_videos_from_twelve({"query": query})
