import threading
from typing import Dict

class SecurityMetrics:
    """
    Singleton class to track real-time security metrics across the application.
    """
    _instance = None
    _init_lock = threading.Lock()

    def __new__(cls):
        with cls._init_lock:
            if cls._instance is None:
                cls._instance = super(SecurityMetrics, cls).__new__(cls)
                cls._instance._initialize()
            return cls._instance

    def _initialize(self):
        """Initialize all counters to 0."""
        self._counters = {
            "prompt_injections_blocked": 0,
            "spam_blocked": 0,
            "duplicates_detected": 0,
            "failed_logins": 0,
            "otp_abuse_attempts": 0,
            "rate_limit_violations": 0,
            "security_incidents_today": 0,
            "total_grievances_processed": 0,
            "total_grievances_blocked": 0
        }
        self._counter_lock = threading.Lock()

    def increment(self, counter_name: str) -> None:
        """Thread-safe increment of a specific counter."""
        if counter_name in self._counters:
            with self._counter_lock:
                self._counters[counter_name] += 1

    def get_stats(self) -> Dict[str, int]:
        """Return a copy of the current statistics."""
        with self._counter_lock:
            return self._counters.copy()

    def reset_daily(self) -> None:
        """Reset the daily security incidents counter."""
        with self._counter_lock:
            self._counters["security_incidents_today"] = 0

# Global instance to be imported by other modules
metrics = SecurityMetrics()
