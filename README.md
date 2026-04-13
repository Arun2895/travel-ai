# TravelGuide AI  
### Autonomous AI Travel Planning Agent

TravelGuide AI is an AI-powered tool that helps users discover hotels, restaurants and places to visit based on their preferences
and generates personalized travel itineraries that fit within their budget.

## 🚀 Overview

TravelGuide AI operates as an **Autonomous Planning Agent** that:
- Understands user intent conversationally
- Fetches real-world data dynamically
- Synthesizes structured travel itineraries
- Presents results in a clean, interactive UI

## 🛠️ Tech Stack

### Core Frameworks

| Layer       | Technology |
|------------|------------|
| Frontend   | React 18 (TypeScript), Vite, Tailwind CSS |
| Backend    | FastAPI (Python 3.10+) |
| AI Engine  | LangChain Agent Framework |
| LLM        | Llama 3 |
| Inference  | Groq Cloud (LPU-powered) |

### APIs & Data Systems

| Service        | Purpose |
|---------------|--------|
| MCP (Model Context Protocol) | Tool orchestration |
| OpenStreetMap (OSM) | Geographic dataset |
| Overpass API | Filtered geospatial queries |
| Nominatim | Geocoding (forward & reverse) |
| IP-API | IP → Location mapping |

### Deployment & Tooling

| Tool        | Purpose |
|------------|--------|
| Uvicorn     | ASGI server |
| PostCSS     | CSS transformations |
| dotenv (.env) | Environment configuration |

---

## ⚡ Key Highlights

- 🔥 **Sub-second AI responses** via Groq LPU inference  
- 🌍 **Real-time travel data**, not static datasets  
- 🧠 **Agent-based reasoning**, not prompt chaining  
- 📍 **Geo-aware planning** using live coordinates  
- 🎯 **Personalized itineraries** based on user intent  

### ✅ Output Includes:
- Daily itinerary (Morning/Afternoon/Evening)
- Hotels within budget
- Nearby attractions (10km radius)
- Food recommendations (local cuisine)

---

## 🔧 Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/your-username/travelguide-ai.git
cd travelguide-ai
