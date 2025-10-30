import logging
import sys
from pythonjsonlogger import jsonlogger


class CustomJsonFormatter(jsonlogger.JsonFormatter):
    def add_fields(self, log_record, record, message_dict):
        super().add_fields(log_record, record, message_dict)
        log_record['level'] = record.levelname
        log_record['logger'] = record.name


def setup_logging():
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    # Remove existing handlers
    for handler in logger.handlers[:]:
        logger.removeHandler(handler)

    # Console handler with JSON formatting
    console_handler = logging.StreamHandler(sys.stdout)
    formatter = CustomJsonFormatter(
        '%(asctime)s %(levelname)s %(name)s %(message)s')
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    # File handler for development
    try:
        file_handler = logging.FileHandler('logs/app.log')
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    except Exception as e:
        print(f"Could not set up file logging: {e}")

    return logger
