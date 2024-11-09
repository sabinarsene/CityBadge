import os
import sys
import numpy as np
import pandas as pd
from dataclasses import dataclass
from exception import CustomException
from logger import logging
from utils import save_object, evaluate_models
from sklearn.metrics import mean_squared_error
from prophet import Prophet
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.holtwinters import ExponentialSmoothing
from pmdarima import auto_arima

@dataclass
class ModelTrainerConfig:
    trained_model_path: str = os.path.join("artifacts", "best_model.pkl")

class ModelTrainer:
    def __init__(self):
        self.model_trainer_config = ModelTrainerConfig()

    def initiate_model_trainer(self, train_data, test_data):
        try:
            logging.info("Splitting training and test data")
            X_train, y_train = train_data.iloc[:, :-1], train_data.iloc[:, -1]
            X_test, y_test = test_data.iloc[:, :-1], test_data.iloc[:, -1]

            models = {
                "ARIMA": ARIMA(endog=y_train, order=(5, 1, 0)),
                "SARIMA": auto_arima,
                "HoltWinters": ExponentialSmoothing(y_train, trend="add", seasonal="add", seasonal_periods=12)
            }

            logging.info("Fitting ARIMA model")
            arima_model = models["ARIMA"].fit()
            models["ARIMA"] = arima_model

            logging.info("Fitting Prophet model")
            prophet_model = Prophet()
            prophet_train_df = pd.DataFrame({
                'ds': pd.date_range(start='2024-01-01', periods=len(y_train), freq='W'),
                'y': y_train
            })
            prophet_model.fit(prophet_train_df)

            params = {
                "Prophet": {},
                "ARIMA": {"order": [(5, 1, 0), (2, 1, 2)]},
                "SARIMA": {"seasonal": [True, False]},
                "HoltWinters": {"trend": ["add", "mul"], "seasonal": ["add", "mul"]}
            }

            model_report = evaluate_models(X_train, y_train, X_test, y_test, models, params)
            best_model_name = max(model_report, key=model_report.get)
            best_model_score = model_report[best_model_name]

            logging.info(f"Best model found: {best_model_name} with R2 score: {best_model_score}")

            best_model = models[best_model_name]

            save_object(
                file_path=self.model_trainer_config.trained_model_path,
                obj=best_model
            )

            return best_model_name, best_model_score

        except Exception as e:
            raise CustomException(e, sys)