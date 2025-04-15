import azure.functions as func
import requests
import json
import os
from azure.storage.blob import BlobServiceClient
from datetime import datetime, timedelta
import logging

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Processing GetSolarData request')
    try:
        owm_api_key = os.getenv('OPENWEATHERMAP_API_KEY')
        if not owm_api_key:
            logging.error('Missing OpenWeatherMap API key')
            return func.HttpResponse('Missing OpenWeatherMap API key', status_code=500)

        cities = [
            {"name": "Atlanta", "lat": 33.7490, "lng": -84.3880},
            {"name": "New York", "lat": 40.7128, "lng": -74.0060},
            {"name": "Los Angeles", "lat": 34.0522, "lng": -118.2437},
            {"name": "Chicago", "lat": 41.8781, "lng": -87.6298},
            {"name": "Houston", "lat": 29.7604, "lng": -95.3698},
            {"name": "Phoenix", "lat": 33.4484, "lng": -112.0740},
            {"name": "Philadelphia", "lat": 39.9526, "lng": -75.1652},
            {"name": "San Antonio", "lat": 29.4241, "lng": -98.4936},
            {"name": "San Diego", "lat": 32.7157, "lng": -117.1611},
            {"name": "Dallas", "lat": 32.7767, "lng": -96.7970},
            {"name": "Seattle", "lat": 47.6062, "lng": -122.3321},
            {"name": "Denver", "lat": 39.7392, "lng": -104.9903},
            {"name": "Miami", "lat": 25.7617, "lng": -80.1918},
            {"name": "Boston", "lat": 42.3601, "lng": -71.0589},
            {"name": "San Francisco", "lat": 37.7749, "lng": -122.4194},
            {"name": "Washington", "lat": 38.9072, "lng": -77.0369},
            {"name": "Austin", "lat": 30.2672, "lng": -97.7431},
            {"name": "Las Vegas", "lat": 36.1699, "lng": -115.1398},
            {"name": "Minneapolis", "lat": 44.9778, "lng": -93.2650},
            {"name": "Portland", "lat": 45.5152, "lng": -122.6784},
            {"name": "Sacramento", "lat": 38.5816, "lng": -121.4944},
            {"name": "Columbus", "lat": 39.9612, "lng": -82.9988},
            {"name": "Indianapolis", "lat": 39.7684, "lng": -86.1581},
            {"name": "Charlotte", "lat": 35.2271, "lng": -80.8431},
            {"name": "Nashville", "lat": 36.1627, "lng": -86.7816},
            {"name": "Detroit", "lat": 42.3314, "lng": -83.0458},
            {"name": "Oklahoma City", "lat": 35.4676, "lng": -97.5164},
            {"name": "Memphis", "lat": 35.1495, "lng": -90.0490},
            {"name": "Louisville", "lat": 38.2527, "lng": -85.7585},
            {"name": "Baltimore", "lat": 39.2904, "lng": -76.6122},
            {"name": "Milwaukee", "lat": 43.0389, "lng": -87.9065},
            {"name": "Albuquerque", "lat": 35.0844, "lng": -106.6504},
            {"name": "Tucson", "lat": 32.2226, "lng": -110.9747},
            {"name": "Fresno", "lat": 36.7378, "lng": -119.7871},
            {"name": "Mesa", "lat": 33.4152, "lng": -111.8315},
            {"name": "Kansas City", "lat": 39.0997, "lng": -94.5786},
            {"name": "Raleigh", "lat": 35.7796, "lng": -78.6382},
            {"name": "Omaha", "lat": 41.2565, "lng": -95.9345},
            {"name": "Tampa", "lat": 27.9506, "lng": -82.4572},
            {"name": "Cleveland", "lat": 41.4993, "lng": -81.6944},
            {"name": "St. Louis", "lat": 38.6270, "lng": -90.1994},
            {"name": "Pittsburgh", "lat": 40.4406, "lng": -79.9959},
            {"name": "Anchorage", "lat": 61.2181, "lng": -149.9003},
            {"name": "Honolulu", "lat": 21.3069, "lng": -157.8583},
            {"name": "Orlando", "lat": 28.5383, "lng": -81.3792},
            {"name": "Birmingham", "lat": 33.5207, "lng": -86.8025},
            {"name": "Salt Lake City", "lat": 40.7608, "lng": -111.8910},
            {"name": "Richmond", "lat": 37.5407, "lng": -77.4360},
            {"name": "Boise", "lat": 43.6150, "lng": -116.2023},
            {"name": "Des Moines", "lat": 41.6005, "lng": -93.6091}
        ]

        connection_string = os.getenv('AZURE_STORAGE_CONNECTION_STRING')
        blob_service_client = BlobServiceClient.from_connection_string(connection_string) if connection_string else None
        container_name = 'solar-data'
        today = datetime.utcnow().strftime('%Y%m%d')
        cached_blob_name = f'solar_{today}.json'

        # Check cache
        if blob_service_client:
            container_client = blob_service_client.get_container_client(container_name)
            try:
                blob_client = container_client.get_blob_client(cached_blob_name)
                cached_data = blob_client.download_blob().readall()
                cached_json = json.loads(cached_data.decode('utf-8'))
                logging.info('Serving cached data')
                headers = {
                    "Access-Control-Allow-Origin": "http://localhost:3000",
                    "Access-Control-Allow-Credentials": "true"
                }
                return func.HttpResponse(
                    json.dumps(cached_json),
                    mimetype='application/json',
                    headers=headers
                )
            except Exception as e:
                logging.info(f'No valid cache found: {str(e)}')

        # Fetch new data
        map_data = []
        metrics = {'totalEnergy': 0, 'avgIrradiance': 0, 'temperature': 0}
        chart_data = []
        total_irradiance = 0
        total_temp = 0
        total_energy_sum = 0
        count = 0

        for city in cities[:50]:
            try:
                owm_url = f'https://api.openweathermap.org/data/2.5/weather?lat={city["lat"]}&lon={city["lng"]}&appid={owm_api_key}&units=metric'
                owm_response = requests.get(owm_url)
                owm_response.raise_for_status()
                owm_data = owm_response.json()

                nasa_url = f'https://power.larc.nasa.gov/api/temporal/daily/point?parameters=ALLSKY_SFC_SW_DWN,T2M&community=RE&longitude={city["lng"]}&latitude={city["lat"]}&start=20250413&end=20250414&format=JSON'
                nasa_response = requests.get(nasa_url)
                nasa_response.raise_for_status()
                nasa_data = nasa_response.json()

                irradiance = owm_data.get('main', {}).get('temp', 0) * 20
                total_energy_raw = nasa_data.get('properties', {}).get('parameter', {}).get('ALLSKY_SFC_SW_DWN', {}).get('20250414', 0)
                total_energy = abs(total_energy_raw) * 0.2778

                map_data.append({
                    'id': len(map_data) + 1,
                    'lat': city['lat'],
                    'lng': city['lng'],
                    'irradiance': irradiance
                })

                total_irradiance += irradiance
                total_temp += owm_data.get('main', {}).get('temp', 0)
                total_energy_sum += total_energy
                count += 1

                chart_data.append({
                    'timestamp': datetime.utcnow().isoformat(),
                    'energy': total_energy,
                    'temperature': owm_data.get('main', {}).get('temp', 0),
                    'city': city['name']
                })

            except Exception as e:
                logging.error(f'Error fetching data for {city["name"]}: {str(e)}')
                continue

        if count > 0:
            metrics = {
                'totalEnergy': total_energy_sum / count,
                'avgIrradiance': total_irradiance / count,
                'temperature': total_temp / count
            }

        combined_data = {
            'mapData': map_data,
            'metrics': metrics,
            'chartData': chart_data
        }

        # Cache data
        if blob_service_client:
            blob_client = container_client.get_blob_client(cached_blob_name)
            blob_client.upload_blob(json.dumps(combined_data), overwrite=True)
            logging.info(f'Cached data to {cached_blob_name}')

        headers = {
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Credentials": "true"
        }
        return func.HttpResponse(
            json.dumps(combined_data),
            mimetype='application/json',
            headers=headers
        )
    except Exception as e:
        logging.error(f'Error in GetSolarData: {str(e)}')
        headers = {
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Credentials": "true"
        }
        return func.HttpResponse(
            f'Error: {str(e)}',
            status_code=500,
            headers=headers
        )