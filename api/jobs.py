import requests
from traceback import print_tb
from schedule import Scheduler
import threading
import time
import datetime
from . import models
from . import serializers
from .helpers import email_interaction


def updateOnEmail(pk):
    inr = models.ProductInteractions.objects.get(pk=pk)
    inr.isEmail = True
    inr.save()


def evaluateInteractions():
    current_time = datetime.datetime.now()
    time_window = datetime.timedelta(minutes=5)
    minutes_ago = current_time - time_window
    recent_interactions = models.ProductInteractions.objects.filter(
        timestamp__lt=minutes_ago, isCancelled=False, isEmail=False
    )

    for interaction in recent_interactions:
        serializer = serializers.ViewProductInteractionsSerializer(interaction)
        s_data = serializer.data
        email_interaction(s_data["product"], s_data["user"], s_data["action"])
        updateOnEmail(interaction.pk)


def run_continuously(self, interval=1):
    cease_continuous_run = threading.Event()

    class ScheduleThread(threading.Thread):
        @classmethod
        def run(cls):
            while not cease_continuous_run.is_set():
                self.run_pending()
                time.sleep(interval)

    continuous_thread = ScheduleThread()
    continuous_thread.setDaemon(True)
    continuous_thread.start()
    return cease_continuous_run


Scheduler.run_continuously = run_continuously


def start_scheduler():
    scheduler = Scheduler()
    scheduler.every(4).minutes.do(evaluateInteractions)  # Run every 1 minute
    # scheduler.every().second.do(evaluateInteractions)
    scheduler.run_continuously()
