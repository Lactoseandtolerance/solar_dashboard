import azure.functions as func
import requests
import json
import os
from azure.storage.blob import BlobServiceClient
from datetime import datetime
import logging

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Processing GetSolarData request')
    try:
        owm_api_key = os.getenv('OPENWEATHERMAP_API_KEY')
        if not owm_api_key:
            logging.error('Missing OpenWeatherMap API key')
            return func.HttpResponse('Missing OpenWeatherMap API key', status_code=500)

        lat, lon = 33.7490, -84.3880
        owm_url = f'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={owm_api_key}&units=metric'
        nasa_url = f'https://power.larc.nasa.gov/api/temporal/daily/point?parameters=ALLSKY_SFC_SW_DWN,T2M&community=RE&longitude={lon}&latitude={lat}&start=20250413&end=20250414&format=JSON'

        logging.info(f'Fetching OpenWeatherMap data from {owm_url}')
        owm_response = requests.get(owm_url)
        owm_response.raise_for_status()
        owm_data = owm_response.json()

        logging.info(f'Fetching NASA POWER data from {nasa_url}')
        nasa_response = requests.get(nasa_url)
        nasa_response.raise_for_status()
        nasa_data = nasa_response.json()

        irradiance = owm_data.get('main', {}).get('temp', 0) * 20
        combined_data = {
            'mapData': [
                {'id': 1, 'lat': lat, 'lng': lon, 'irradiance': irradiance},
            ],
            'metrics': {
                'totalEnergy': nasa_data.get('properties', {}).get('parameter', {}).get('ALLSKY_SFC_SW_DWN', {}).get('20250414', 0) * 0.2778,
                'avgIrradiance': irradiance,
                'temperature': owm_data.get('main', {}).get('temp', 0),
            },
            'chartData': [
                {
                    'timestamp': datetime.utcnow().isoformat(),
                    'energy': nasa_data.get('properties', {}).get('parameter', {}).get('ALLSKY_SFC_SW_DWN', {}).get('20250414', 0) * 0.2778,
                    'temperature': owm_data.get('main', {}).get('temp', 0),
                },
            ],
        }

        connection_string = os.getenv('AZURE_STORAGE_CONNECTION_STRING')
        if connection_string:
            logging.info(f'Uploading data to Blob Storage')
            blob_service_client = BlobServiceClient.from_connection_string(connection_string)
            container_client = blob_service_client.get_container_client('solar-data')
            blob_name = f'solar_{datetime.utcnow().strftime("%Y%m%d_%H%M%S")}.json'
            blob_client = container_client.get_blob_client(blob_name)
            blob_client.upload_blob(json.dumps(combined_data), overwrite=True)
        else:
            logging.warning('No storage connection string provided')

        logging.info('Returning combined data')
        return func.HttpResponse(json.dumps(combined_data), mimetype='application/json')
    except Exception as e:
        logging.error(f'Error in GetSolarData: {str(e)}')
        return func.HttpResponse(f'Error: {str(e)}', status_code=500)
