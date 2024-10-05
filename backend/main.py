from fastapi import FastAPI

app = FastAPI()

# Define a simple route
@app.get("/")
def read_root():
    return {"Hello": "World"}

# Another route for example
@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}
