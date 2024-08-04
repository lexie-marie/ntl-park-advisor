from langchain_community.document_loaders import PlaywrightURLLoader
from langchain_community.document_transformers import Html2TextTransformer
from langchain_experimental.text_splitter import SemanticChunker

from app.load_data.webpages import webpages
from app.retrievers.vectorstore import embeddings, vectorstore


def load_web_pages():
    print("scraping web pages")
    loader = PlaywrightURLLoader(urls=webpages, remove_selectors=["header", "footer"])
    docs = loader.load()

    html2text = Html2TextTransformer()
    docs_transformed = html2text.transform_documents(docs, ignore_links=False, ignore_images=False, bodywidth=0)

    text_splitter = SemanticChunker(embeddings=embeddings)
    chunks = text_splitter.split_documents(docs_transformed)

    print("load to vector store")
    load_docs_to_pinecone(chunks)
    print("done")


def load_docs_to_pinecone(docs):
    i = 0
    while i < len(docs):
        docs_to_load = docs[i: i + 49]
        vectorstore.add_documents(docs_to_load, async_req=False, pool_threads=1)
        i += 50


load_web_pages()
