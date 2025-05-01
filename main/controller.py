from typing import List

from educationService import SheduleService
from models import TimeTable
sheduleService = SheduleService()

schedules: List[TimeTable] = sheduleService.get_all_schedules()