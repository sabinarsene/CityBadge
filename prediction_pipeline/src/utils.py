import os
import sys
import numpy as np
import pandas as pd
# import dill
import pickle
from exception import CustomException
from sklearn.metrics import r2_score
from sklearn.model_selection import GridSearchCV
from exception import CustomException
from logger import logging

def save_object(file_path, obj):
    try:
        dir_path = os.path.dirname(file_path)

        os.makedirs(dir_path, exist_ok=True)

        with open(file_path, "wb") as file_obj:
            pickle.dump(obj, file_obj)

    except Exception as e:
        raise CustomException(e, sys)

def evaluate_models(X_train, y_train, X_test, y_test, models, param):
    try:
        report = {}
        for model_name, model in models.items():
            try:
                logging.info(f"Evaluating model: {model_name}")

                if hasattr(model, 'fit') and hasattr(model, 'predict'):
                    # Fit model and predict
                    model.fit(X_train, y_train)
                    y_pred = model.predict(X_test)

                    # Calculate score
                    score = r2_score(y_test, y_pred)
                    report[model_name] = score
                    logging.info(f"{model_name} scored {score:.4f}")

                else:
                    logging.warning(f"Model {model_name} does not have a fit/predict method.")
                    
            except Exception as model_error:
                logging.error(f"Failed to evaluate {model_name}: {model_error}")
                continue  # Continue with the next model

        if not report:
            raise CustomException("No models were successfully evaluated.", sys)

        return report

    except Exception as e:
        raise CustomException(e, sys)

def load_object(file_path):
    try:
        with open(file_path, "rb") as file_obj:
            return pickle.load(file_obj)

    except Exception as e:
        raise CustomException(e, sys)