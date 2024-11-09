import os
import sys
import pandas as pd
from exception import CustomException
from logger import logging
from dataclasses import dataclass

@dataclass
class DataTransformationConfig:
    transformed_train_dir: str = os.path.join("artifacts", "transformed_train")
    transformed_test_dir: str = os.path.join("artifacts", "transformed_test")
    separate_datasets_dir: str = os.path.join("artifacts", "separate_datasets")

class DataTransformation:
    def __init__(self):
        self.config = DataTransformationConfig()

    def initiate_data_transformation(self, train_path, test_path):
        try:
            logging.info("Starting data transformation process")
            train_df = pd.read_csv(train_path)
            test_df = pd.read_csv(test_path)

            os.makedirs(self.config.transformed_train_dir, exist_ok=True)
            os.makedirs(self.config.transformed_test_dir, exist_ok=True)
            os.makedirs(self.config.separate_datasets_dir, exist_ok=True)

            for i, column in enumerate(train_df.columns, start=1):
                train_transformed = pd.DataFrame(train_df[column])
                test_transformed = pd.DataFrame(test_df[column])
                combined_dataset = pd.concat([train_transformed, test_transformed])

                combined_file_path = os.path.join(self.config.separate_datasets_dir, f"spots_searches_dataset_{i}.csv")
                combined_dataset.to_csv(combined_file_path, index=False)
                logging.info(f"Saved transformed data as spots_searches_dataset_{i}")
            logging.info("Data transformation completed and all files saved")
            return train_transformed, test_transformed

        except Exception as e:
            raise CustomException(e, sys)