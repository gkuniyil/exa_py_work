from exa_py import Exa

exa = Exa('81fc2a40-4765-457c-ad64-d72aabe787a5') # api key 

query = input('Search here: ')

response = exa.search( 
  query, 
  num_results= 5, 
  start_published_date="2024-01-01", 
  include_domains=["https://www.tiktok.com"], 
  use_autoprompt=True #rewrite query to be more precise 
)
if not getattr(response, "results", []):
    print("No results found.")
else:
    for result in response.results:
      print(f"Title: {result.title}")
      print(f"URL:   {result.url}\n")


  