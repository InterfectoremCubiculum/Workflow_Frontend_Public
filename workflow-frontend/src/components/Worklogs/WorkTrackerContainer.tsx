import { useState } from "react";
import TimeTrackerWidget from "./Widget/WorkLogWidget";
import type { TimeSegmentType } from "../../enums/TimeSegmentType";
import { useSignalREvents } from "../../hub/UseSignalREvents";

const WorkTrackerContainer: React.FC = () => {
  const [timeStamps, setTimeStamps] = useState<Date | null>(null);
  const [status, setStatus] = useState<TimeSegmentType | null>(null);

  useSignalREvents({
    workStateChanged: (data) => {
      setStatus(data.state);
      setTimeStamps(new Date(data.timestamp));
    },
  });

  return (
    <TimeTrackerWidget signalRStatus={status} timeStamp={timeStamps} />
  );
};

export default WorkTrackerContainer;
