from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return { "message": "Audio Genre Classification Project Norbert Balucha - FastAPI" }

