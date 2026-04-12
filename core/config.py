from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # LLM (Switched from OpenAI to Groq)
    groq_api_key: str = ""
    # llama-3.3-70b-versatile: 12,000 TPM free tier (better for complex tool results)
    # llama-3.1-8b-instant: 6,000 TPM free tier (too small for multi-tool responses)
    groq_model: str = "llama-3.3-70b-versatile"

    # APIs (Truly Free / No Card Tiers)
    amadeus_client_id: str = ""
    amadeus_client_secret: str = ""
    
    # Legacy / Optional
    google_places_api_key: str = ""
    yelp_api_key: str = ""
    rapidapi_key: str = ""

    # App
    app_env: str = "development"
    log_level: str = "INFO"


@lru_cache
def get_settings() -> Settings:
    return Settings()