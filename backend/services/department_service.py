"""
Department lookup and load balancing service.
"""

from utils.file_utils import read_json_file

DEPARTMENT_DB_PATH = "data/mock_departments.json"


def get_all_departments():
    """
    Returns all department records.
    """

    return read_json_file(
        DEPARTMENT_DB_PATH
    )


def get_overloaded_departments():
    """
    Returns overloaded departments.
    """

    departments = get_all_departments()

    overloaded = []

    for department in departments:

        if (
            department["open_tickets"] >=
            department["max_capacity"]
        ):

            overloaded.append(department)

    return overloaded