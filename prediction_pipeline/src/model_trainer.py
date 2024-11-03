import os
import sys
import pandas as pd
from dataclasses import dataclass
from exception import CustomException
from logger import logging
from utils import save_object, evaluate_models
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, AdaBoostRegressor
from sklearn.tree import DecisionTreeRegressor

@dataclass
class ModelTrainerConfig:
    trained_model_path: str = os.path.join("artifacts", "best_model_{i}.pkl")
    model_metadata_path: str = os.path.join("artifacts", "model_metadata.csv")

class ModelTrainer:
    def __init__(self):
        self.model_trainer_config = ModelTrainerConfig()

    def initiate_model_trainer(self, train_data_dict, test_data_dict):
        try:
            model_metadata = []

            for i, (feature_name, train_data) in enumerate(train_data_dict.items(), start=1):
                logging.info(f"Training regression models for {feature_name}")

                y_train = train_data.values.flatten()
                y_test = test_data_dict[feature_name].values.flatten()

                models = {
                    "Random Forest": RandomForestRegressor(),
                    "Decision Tree": DecisionTreeRegressor(),
                    "Gradient Boosting": GradientBoostingRegressor(),
                    "Linear Regression": LinearRegression(),
                    "AdaBoost Regressor": AdaBoostRegressor(),
                }

                model_report = evaluate_models(
                    X_train=None, y_train=y_train, X_test=None, y_test=y_test, models=models, param={}
                )
                best_model_name = max(model_report, key=model_report.get)
                best_model_score = model_report[best_model_name]

                logging.info(f"Best model for {feature_name}: {best_model_name} with score: {best_model_score}")

                best_model = models[best_model_name]
                model_path = self.model_trainer_config.trained_model_path.format(i=i)
                save_object(file_path=model_path, obj=best_model)

                model_metadata.append({
                    'Dataset': f'spots_searches_dataset_{i}',
                    'Feature': feature_name,
                    'Best Model': best_model_name,
                    'Score': best_model_score
                })

            pd.DataFrame(model_metadata).to_csv(self.model_trainer_config.model_metadata_path, index=False)
            return model_metadata

        except Exception as e:
            raise CustomException(e, sys)
