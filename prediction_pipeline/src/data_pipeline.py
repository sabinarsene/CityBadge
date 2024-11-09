import os
import sys
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, AdaBoostRegressor
from sklearn.tree import DecisionTreeRegressor
from exception import CustomException
from logger import logging
from utils import save_object, load_object
from sklearn.metrics import r2_score

class DataPipeline:
    def __init__(self):
        self.artifacts_dir = "artifacts"
        self.train_data_path = os.path.join(self.artifacts_dir, "train.csv")
        self.test_data_path = os.path.join(self.artifacts_dir, "test.csv")
        self.raw_data_path = os.path.join(self.artifacts_dir, "data.csv")
        self.model_metadata_path = os.path.join(self.artifacts_dir, "model_metadata.csv")
        self.models = {
            "Random Forest": RandomForestRegressor(),
            "Decision Tree": DecisionTreeRegressor(),
            "Gradient Boosting": GradientBoostingRegressor(),
            "Linear Regression": LinearRegression(),
            "AdaBoost Regressor": AdaBoostRegressor(),
        }

    def initiate_data_ingestion(self, dataset_path):
        try:
            logging.info("Starting data ingestion process")
            df = pd.read_csv(dataset_path)
            os.makedirs(self.artifacts_dir, exist_ok=True)
            df.to_csv(self.raw_data_path, index=False)

            train_set, test_set = train_test_split(df, test_size=0.2, random_state=42)
            train_set.to_csv(self.train_data_path, index=False)
            test_set.to_csv(self.test_data_path, index=False)

            logging.info("Data ingestion completed")
            return train_set, test_set
        except Exception as e:
            raise CustomException(e, sys)

    def train_models(self, train_data, test_data):
        try:
            model_metadata = []

            for i, column in enumerate(train_data.columns, start=1):
                y_train = train_data[column].values.flatten()
                y_test = test_data[column].values.flatten()

                best_score = float('-inf')
                best_model = None
                best_model_name = ""

                for model_name, model in self.models.items():
                    try:
                        logging.info(f"Training {model_name} for {column}")
                        model.fit(np.arange(len(y_train)).reshape(-1, 1), y_train)
                        y_pred = model.predict(np.arange(len(y_train), len(y_train) + len(y_test)).reshape(-1, 1))
                        score = r2_score(y_test, y_pred)

                        if score > best_score:
                            best_score = score
                            best_model = model
                            best_model_name = model_name

                        logging.info(f"{model_name} scored {score:.4f} for {column}")

                    except Exception as model_error:
                        logging.warning(f"Failed to train {model_name} for {column}: {model_error}")
                        continue

                if best_model:
                    model_path = os.path.join(self.artifacts_dir, f"best_model_{i}.pkl")
                    save_object(model_path, best_model)
                    model_metadata.append({
                        'Dataset': f'spots_searches_dataset_{i}',
                        'Feature': column,
                        'Best Model': best_model_name,
                        'Score': best_score
                    })
                else:
                    logging.error(f"No successful model for {column}")

            pd.DataFrame(model_metadata).to_csv(self.model_metadata_path, index=False)
            logging.info("Model training completed and metadata saved")
            return model_metadata
        except Exception as e:
            raise CustomException(e, sys)

    def generate_prediction(self, test_data):
        try:
            predictions = {}

            for i, column in enumerate(test_data.columns, start=1):
                model_path = os.path.join(self.artifacts_dir, f"best_model_{i}.pkl")
                if os.path.exists(model_path):
                    best_model = load_object(model_path)
                    X_future = np.arange(len(test_data), len(test_data) + 12).reshape(-1, 1)
                    prediction = best_model.predict(X_future)
                    predictions[column] = prediction.tolist()
                    logging.info(f"Prediction for {column}: {prediction}")
                else:
                    logging.warning(f"No model found for {column}")

            logging.info("Predictions generated")
            return predictions
        except Exception as e:
            raise CustomException(e, sys)

if __name__ == "__main__":
    pipeline = DataPipeline()

    dataset_path = r"PATH"
    train_data, test_data = pipeline.initiate_data_ingestion(dataset_path)

    model_metadata = pipeline.train_models(train_data, test_data)
    print("Model training completed. Metadata:", model_metadata)

    predictions = pipeline.generate_prediction(test_data)
    print("Generated predictions for each feature:", predictions)