import { useEffect } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const ActivityTracker = ({ userId }) => {
  useEffect(() => {
    if (!userId) return;

   

    let startTime = Date.now();

    const sendActivity = async () => {
      const now = Date.now();
      const minutesSpent = Math.round((now - startTime) / 60000);
      if (minutesSpent < 1) return;

      try {
        await axios.post(`${apiUrl}api/v1/userDashbord/activity`, {
          userId,
          minutesSpent,
        });
     
        startTime = Date.now(); // reset
      } catch (err) {
        console.error("Activity log failed", err);
      }
    };

    const interval = setInterval(sendActivity, 60 * 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        sendActivity();
      }
    };

    window.addEventListener("beforeunload", sendActivity);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      sendActivity();
      clearInterval(interval);
      window.removeEventListener("beforeunload", sendActivity);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [userId]);

  return null;
};

export default ActivityTracker;
