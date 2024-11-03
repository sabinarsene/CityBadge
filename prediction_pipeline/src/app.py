import sys
sys.path.append('./src')
from flask import Flask, render_template
import base64
from io import BytesIO
import matplotlib.pyplot as plt
import pandas as pd
from data_pipeline import DataPipeline

app = Flask(__name__)
pipeline = DataPipeline()

@app.route('/')
def index():
    dataset_path = r"D:\CityBadge\prediction_pipeline\dataset\spots_searches_dataset.csv"
    _, test_data = pipeline.initiate_data_ingestion(dataset_path)
    predictions = pipeline.generate_prediction(test_data)

    images = []
    for column, values in predictions.items():
        x = pd.date_range(start="2024-11-02", periods=12, freq="W")

        plt.figure(figsize=(10, 5))
        plt.plot(x, values, marker='o', label=column)
        plt.title(f'Prediction Plot for {column}')
        plt.xlabel('Date')
        plt.ylabel('Value')
        plt.grid(True)
        plt.legend()

        buf = BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        image_base64 = base64.b64encode(buf.read()).decode('utf-8')
        images.append(image_base64)
        plt.close()

    return render_template('index.html', images=images)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5005, debug=True)
