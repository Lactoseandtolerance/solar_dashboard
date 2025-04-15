import azure.functions as func
import requests
import json
import os
from azure.storage.blob import BlobServiceClient
from datetime import datetime

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        # Get API key from environment
        owm_api_key = os.getenv("OPENWEATHERMAP_API_KEY")
        if not owm_api_key:
            return func.HttpResponse("Missing API key", status_code=500)

        # Parameters (e.g., Atlanta, GA)
        lat, lon = 33.7490, -84.3880
        owm_url = f"https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&appid={owm_api_key}&units=metric"
        nasa_url = f"https://power.larc.nasa.gov/api/temporal/daily/point?parameters=ALLSKY_SFC_SW_DWN&community=RE&longitude={lon}&latitude={lat}&start=20250414&end=20250414&format=JSON"

        # Fetch OpenWeatherMap data
        owm_response = requests.get(owm_url)
        owm_response.raise_for_status()
        owm_data = owm_response.json()

        # Fetch NASA POWER data
        nasa_response = requests.get(nasa_url)
        nasa_response.raise_for_status()
        nasa_data = nasa_response.json()

        # Combine data
        combined_data = {
            "mapData": [
                {
                    "id": 1,
                    "lat": lat,
                    "lng": lon,
                    "irradiance": owm_data.get("current", {}).get("uvi", 0) * 40,  # UVI to W/m² approximation
                }
            ],
            "metrics": {
                "totalEnergy": nasa_data.get("properties", {}).get("parameter", {}).get("ALLSKY_SFC_SW_DWN", {}).get("20250414", 0) * 0.2778,  # kWh/m²
                "avgIrradiance": owm_data.get("current", {}).get("uvi", 0) * 40,
            },
            "chartData": [
                {
                    "timestamp": owm_data.get("current", {}).get("dt", 0),
                    "energy": nasa_data.get("properties", {}).get("parameter", {}).get("ALLSKY_SFC_SW_DWN", {}).get("20250414", 0) * 0.2778,
                }
            ],
        }

        # Store in Blob Storage
        blob_service_client = BlobServiceClient.from_connection_string(os.getenv("AZURE_STORAGE_CONNECTION_STRING"))
        container_client = blob_service_client.get_container_client("solar-data")
        blob_name = f"solar_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.json"
        blob_client = container_client.get_blob_client(blob_name)
        blob_client.upload_blob(json.dumps(combined_data), overwrite=True)

        return func.HttpResponse(json.dumps(combined_data), mimetype="application/json")
    except Exception as e:
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)