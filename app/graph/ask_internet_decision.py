

def decide_to_ask_internet(state: dict) -> str:
    print("asking internet")
    num_original_docs = 5 # we set k to 5
    filtered_docs = state["relevant_docs"]

    # if half are relevant, continue, else ask the internet
    if len(filtered_docs)/num_original_docs >= .5:
        return "get_videos"
    else:
        return "ask_the_internet"
