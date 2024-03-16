# models.py
from pydantic import BaseModel, Field
from typing import List, Optional, Union
from pydantic.networks import HttpUrl

class AuthorSearch(BaseModel):
    name: str
    api_key: str = "77ac613dd7d7c3fb3f6d4c24ccce7a523d2f58833e7d67f357d409fbdfdcff03"

class AuthorInfo(BaseModel):
    author_id: str
    api_key: str = "77ac613dd7d7c3fb3f6d4c24ccce7a523d2f58833e7d67f357d409fbdfdcff03"

class Interest(BaseModel):
    title: str

class AuthorProfile(BaseModel):
    name: str
    email: Optional[str] = None
    author_id: str
    affiliations: Optional[str] = None
    cited_by: int
    interests: Optional[List[Interest]] = None

class CitationCount(BaseModel):
    value: int
    link: HttpUrl
    serpapi_link: HttpUrl
    cites_id: str

class Article(BaseModel):
    title: str
    link: HttpUrl
    citation_id: str
    authors: str
    publication: str
    cited_by: Optional[CitationCount]
    year: str

class CitationsMetric(BaseModel):
    all: int

class CitationTable(BaseModel):
    citations: Optional[CitationsMetric]
    h_index: Optional[CitationsMetric]
    i10_index: Optional[CitationsMetric]

class CitationGraphEntry(BaseModel):
    year: int
    citations: int

class PublicAccess(BaseModel):
    link: HttpUrl
    available: int
    not_available: int

class AuthorDetails(BaseModel):
    name: str
    affiliations: str
    email: str
    thumbnail: HttpUrl

class SearchResult(BaseModel):
    search_metadata: dict
    search_parameters: dict
    author: AuthorDetails
    articles: List[Article]
    cited_by: dict
    public_access: PublicAccess
    serpapi_pagination: dict

class ChatInput(BaseModel):
    text: str
    author_id: str
