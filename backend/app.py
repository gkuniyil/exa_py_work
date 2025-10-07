import logging
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from exa_py import Exa
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure the logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get API key from environment variables
EXA_API_KEY = os.getenv("EXA_API_KEY")
if not EXA_API_KEY:
    logger.error("EXA_API_KEY environment variable is not set")
    # Don't raise error immediately, let the app start but log the error
else:
    logger.info("Exa API key loaded successfully")

# Initialize Exa only if API key is available
if EXA_API_KEY:
    exa = Exa(api_key=EXA_API_KEY)
else:
    exa = None

app = FastAPI()

# CORS settings - allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"Hello": "Welcome to the Semantic Search API"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.get("/search")
async def search_exa(q: str, domain: str = None, num_results: int = 10, focus: str = None):
    try:
        # Check if Exa client is initialized
        if not exa:
            raise HTTPException(status_code=500, detail="Exa API client not initialized. Check API key.")
        
        # Combine query and focus if focus is provided
        combined_query = f"{q} {focus}" if focus else q
        
        logger.info(f"Searching for: {combined_query}, domain: {domain}, results: {num_results}")
        
        search_kwargs = {
            "query": combined_query,
            "num_results": num_results
        }
        
        if domain:
            search_kwargs["include_domains"] = [domain]
        
        # Try the search with basic parameters first
        search_response = exa.search(**search_kwargs)
        
        # Process results
        results = []
        for result in search_response.results:
            results.append({
                "title": result.title or "No title available",
                "url": result.url,
                "text": getattr(result, 'text', None) or "No preview text available"
            })
        
        logger.info(f"Search completed. Found {len(results)} results.")
        return {"results": results}
        
    except Exception as e:
        logger.error(f"Error during search: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Search error: {str(e)}")

@app.get("/summarize")
async def summarize_url(url: str):
    try:
        if not exa:
            raise HTTPException(status_code=500, detail="Exa API client not initialized. Check API key.")
            
        if not url:
            raise HTTPException(status_code=400, detail="URL parameter is required.")

        logger.info(f"Summarizing URL: {url}")
        
        # Get the contents of the page
        contents = exa.get_contents([url])
        
        if not contents or not contents[0].text:
            return {"summary": "Could not retrieve content for summarization."}
        
        # Summarize the contents
        summary_response = exa.summarize_contents(contents, num_sentences=3)

        if summary_response and summary_response[0].text:
            return {"summary": summary_response[0].text}
        else:
            return {"summary": "Could not generate a summary for this content."}

    except Exception as e:
        logger.error(f"Error during summarization: {e}")
        raise HTTPException(status_code=500, detail=f"Summarization error: {str(e)}")

# Test endpoint to check Exa API connection
@app.get("/test-exa")
async def test_exa():
    try:
        if not exa:
            return {"status": "error", "message": "Exa API client not initialized"}
        
        test_response = exa.search("test", num_results=1)
        return {
            "status": "success", 
            "message": "Exa API is working",
            "results_count": len(test_response.results)
        }
    except Exception as e:
        return {"status": "error", "message": f"Exa API test failed: {str(e)}"}