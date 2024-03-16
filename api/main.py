from fastapi import FastAPI
from pymongo import MongoClient
from serpapi import GoogleSearch
from model import AuthorSearch, AuthorProfile, AuthorInfo, ChatInput
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import openai
Api_key = "<Enter your chatgpt api key>"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
client = MongoClient("mongodb+srv://root:root@autinfo.ywzootn.mongodb.net")
db = client["authors"]
collection1 = db["auth_inf"]
details_collection = db["author_details"]

def convert_text_to_json(text: str):
    lines = text.strip().split('\n')
    author_info = {}
    poi = ('a)', 'b)', 'c)', 'd)', 'e)', 'f)', 'g)', 'h)', 'i)', 'j)', 'k)', 'l)', 
           'm)', 'n)', 'o)', 'p)', 'q)', 'r)', 's)', 't)', 'u)', 'v)', 'w)', 'x)', 
           'y)', 'z)')
    for line in lines:
        if line.startswith('1)'):
            author_info['name'] = line.split('1)')[1].strip().rstrip('.')
        elif line.startswith('2)'):
            author_info['position'] = line.split('2)')[1].split('.')[1].strip() + '.'
        elif line.startswith('3)'):
            author_info['top_articles'] = []
            article_index = lines.index(line) + 1
            while article_index < len(lines) and lines[article_index].strip().startswith(poi):
                author_info['top_articles'].append(lines[article_index].strip().split(')', 1)[1].strip().strip("'"))
                article_index += 1
        elif line.startswith('4)'):
            author_info['interests'] = []
            interest_index = lines.index(line) + 1
            while interest_index < len(lines) and lines[interest_index].strip().startswith(poi):
                author_info['interests'].append(lines[interest_index].strip().split(')', 1)[1].strip())
                interest_index += 1
        elif line.startswith('5)'):
            author_info['summary'] = line.split(')')[1].strip()

    return author_info


def gpt_usage(text):
    RAW_TEXT = text
    RAW_TEXT = f'"Answer the below question based on the given information.\\n\\n{RAW_TEXT}\\n\\nQuestion: 1) Give me author name (Just give name) 2) give me the author description (about 90 words) 3) give me top 5 articles for the author in the format a) b) c) d) e) 4) give me top interests of the author at max 3 in format (a), b), c)) 5) Explain about 80 words for the What is this professor best for"'
    client = openai.OpenAI(api_key=Api_key)


    try:
        completion = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": f"{RAW_TEXT}"}
        ]
        )

        text = completion.choices[0].message.content
        return text
    except Exception as e:
        text = str(e)
        print(text)
        
def gpt_usage_chat(author: str, question: str):
    RAW_TEXT = f'"Answer the below question based on the given information.\\n\\n{author}\\n\\nQuestion: {question}"'

    client = openai.OpenAI(api_key=Api_key)
    try:
        completion = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": f"{RAW_TEXT}"}
            ]
        )
        text = completion.choices[0].message.content
        return text
    except Exception as e:
        text = str(e)
        print(text)

@app.post("/reqChat")
async def req_chat(chat: ChatInput):
    author_details_doc = details_collection.find_one({"search_term": chat.author_id}, {"_id": 0})
    return gpt_usage_chat(chat.text, author_details_doc)


@app.post("/search/", response_model=List[AuthorProfile])
async def search_author(author_search: AuthorSearch):
    # Attempt to find existing authors matching the search term in their names
    existing_authors = list(collection1.find({"name": {"$regex": author_search.name, "$options": "i"}}, {"_id": 0}))

    if existing_authors:
        print("Using existing search results")
        # Extract the results directly without additional wrapping
        return [AuthorProfile(
            name=author["name"],
            email=author.get("email"),
            author_id=author.get("author_id"),
            affiliations=author.get("affiliations"),
            cited_by=author.get("cited_by"),
            Interest=author.get("interests"),
        ) for author in existing_authors]
    else:
        params = {
            "engine": "google_scholar_profiles",
            "mauthors": author_search.name,
            "api_key": author_search.api_key
        }
        search = GoogleSearch(params)
        results = search.get_dict()
        profiles = results.get("profiles", [])
        
        # Save each profile individually with the author's name as the key
        for profile in profiles:
            collection1.update_one(
                {"name": profile.get("name")},
                {"$setOnInsert": profile},
                upsert=True
            )
        
        # Prepare simplified profiles for response
        simplified_profiles = [AuthorProfile(
            name=profile.get("name"),
            email=profile.get("email"),
            author_id=profile.get("author_id"),
            affiliations=profile.get("affiliations"),
            cited_by=profile.get("cited_by"),
            Interest=profile.get("interests"),
        ) for profile in profiles]
        
        return simplified_profiles


@app.post("/author/details/")
async def get_author_details(author_detail: AuthorInfo):
    author_details_doc = details_collection.find_one({"search_term": author_detail.author_id}, {"_id": 0})
    if author_details_doc:
        return author_details_doc
    else:
        print("Fetching author details")
        params = {
            "engine": "google_scholar_author",
            "author_id": author_detail.author_id,
            "api_key": author_detail.api_key
        }
        print(params)
        search = GoogleSearch(params)
        results = search.get_dict()
        extracted_data = {
        "author": results.get("author", ""),
        "articles": results.get("articles", ""),
        "cited_by_graph": results.get("cited_by", {}).get("graph", ""),
        "public_access_link": results.get("public_access", {}).get("link", "")
        }
        text = gpt_usage(extracted_data)
        text = convert_text_to_json(text)
        insertion_data = {
            "search_term": author_detail.author_id, 
            "results": text, 
            "cited_by_graph": results["cited_by"]["graph"], 
            "google_scholar_url": results.get("search_metadata", {}).get("google_scholar_author_url", "")
            }
        
        details_collection.insert_one({"search_term": author_detail.author_id, 
            "results": text, 
            "cited_by_graph": results["cited_by"]["graph"], 
            "google_scholar_url": results.get("search_metadata", {}).get("google_scholar_author_url", "")})
        
        return insertion_data
    
    
@app.get("/searches/", response_model=List[dict])
async def get_searches():
    searches = list(collection1.find({}, {"_id": 0}))
    return searches
