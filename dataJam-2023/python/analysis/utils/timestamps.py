from datetime import datetime


def convert_str_timestamp_to_timestamp(
    timestamp_str: str, timestamp_format: str = "%Y-%m-%dT%H:%M:%S.%fZ"
) -> int:
    timestamp = datetime.timestamp(datetime.strptime(timestamp_str, timestamp_format))

    return timestamp
