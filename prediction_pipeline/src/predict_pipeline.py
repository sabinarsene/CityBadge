import os
import sys
import numpy as np
import pandas as pd
from utils import load_object
from exception import CustomException
from logger import logging

def generate_single_prediction(best_model, data):
    try:
        X_future = np.array([[len(data)]])
        prediction = best_model.predict(X_future)[0]
        return prediction
    except Exception as e:
        logging.error(f"An error occurred during prediction: {e}")
        raise CustomException(f"Error during prediction: {e}", sys)

def run_prediction():
    try:
        for i in range(1, 6):
            data_path = f"artifacts/separate_datasets/spots_searches_dataset_{i}.csv"
            print(f"Loading dataset: {data_path}")
            data = pd.read_csv(data_path)

            if data.empty:
                raise CustomException(f"Dataset {data_path} is empty. Cannot make predictions.", sys)

            model_path = f"artifacts/best_model_{i}.pkl"
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model file not found: {model_path}")
            
            best_model = load_object(model_path)

            dataset_predictions = []
            for feature in data.columns:
                single_prediction = generate_single_prediction(best_model, data[[feature]])
                dataset_predictions.append(single_prediction)

            print(f"Dataset {i} predictions: {dataset_predictions}")

    except Exception as e:
        raise CustomException(e, sys)

if __name__ == "__main__":
    run_prediction()