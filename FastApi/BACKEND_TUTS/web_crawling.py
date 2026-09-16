# import requests
# from bs4 import BeautifulSoup

# Web crawling using basic Python

# url = "http://example.com"

# response = requests.get(url)

# Convert HTML into a BeautifulSoup object
# soup = BeautifulSoup(response.text, "html.parser")

# Get the page title
# print(soup.title)

# Get only the title text
# print(soup.title.text)

from fastapi import FastAPI
import requests
from bs4 import BeautifulSoup

app = FastAPI()

@app.get("/get_news")
def get_news():
    url = "https://indianexpress.com/"

    response = requests.get(url)

    soup = BeautifulSoup(response.text,"html.parser")

    title=[]

    for item in soup.find_all("a" , class_="topblockNews__sidebarLink"):
        title.append(item.text)

    return{
        "news" : title[:10]
    }
