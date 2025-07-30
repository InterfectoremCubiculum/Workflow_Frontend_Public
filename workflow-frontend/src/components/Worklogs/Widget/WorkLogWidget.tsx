import { useRef, useState, useEffect } from "react";
import { TimeSegmentType } from "../../../enums/TimeSegmentType";
import { Button } from "react-bootstrap";
import { EndWork, ResumeWork, StartBreak, StartWork, WidgetSync } from "../../../services/workLogService";
import "./WorkLogWidget.css";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";

interface TimeTrackerWidgetProps {
  signalRStatus: (TimeSegmentType | null);
  timeStamp: Date | null;
}
export default function TimeTrackerWidget({signalRStatus, timeStamp} : TimeTrackerWidgetProps) {
  const [status, setStatus] = useState<TimeSegmentType | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (date: Date) => date?.toLocaleTimeString();

  const formatElapsedTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  useEffect(() => {
    setStatus(signalRStatus);
    if (signalRStatus) {
      setStartTime(timeStamp ? new Date(timeStamp) : null);
    }
    else {
      setStartTime(null);
      setElapsedTime(0);
    }
  }, [signalRStatus, timeStamp ]);

  useEffect(() => {
    WidgetSync().then((data) => {
      if (data) {
        setStatus(data.timeSegmentType);
        setStartTime(new Date(data.startTime+ "Z"));
        setElapsedTime(data.durationInSeconds);
      }
    })
  }, []);

  useEffect(() => {
    if (startTime !== null) {
      intervalRef.current = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedTime(diff);
      }, 1000);
    } else {
      setElapsedTime(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [startTime]);

  const handleStartWork = async () => {
    await StartWork().then(() => {
      setStatus(TimeSegmentType.Work);
      setStartTime(new Date());
    });
  };

  const handleStartBreak = async () => {
    await StartBreak().then(() => {
      setStatus(TimeSegmentType.Break);
      setStartTime(new Date());
    });
  };

  const handleEnd = async () => {
    if (status === TimeSegmentType.Work) {
      await EndWork().then(() => {
        setStatus(null);
        setStartTime(null);
      });
    } else if (status === TimeSegmentType.Break) {
      await ResumeWork().then(() => {
        setStatus(TimeSegmentType.Work);
        setStartTime(new Date());
      });
    }
  };

  const toggleMinimize = () => {
    setIsMinimized((prev) => !prev);
  };

  return (
    <div
      className="widget p-3 border rounded"
      style={{ width: isMinimized ? "130px" : "auto" }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="m-0">
          Status:{" "}
          <span
            style={{
              color:
                status === TimeSegmentType.Work
                  ? "green"
                  : status === TimeSegmentType.Break
                  ? "orange"
                  : "gray",
            }}
          >
            {status === TimeSegmentType.Work
              ? "Working"
              : status === TimeSegmentType.Break
              ? "On the Break"
              : "Offline"}
          </span>
        </h5>
        <Button
          className="ms-1 p-0 d-flex align-items-center justify-content-center"
          variant="link"
          size="sm"
          onClick={toggleMinimize}
          aria-label={isMinimized ? "Rozwiń widget" : "Zminimalizuj widget"}
          style={{ width: "28px", height: "28px" }}
        >
          {isMinimized ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </Button>
      </div>

      {!isMinimized && (
        <>
          {startTime && (
            <>
              <p className="mb-1">
                Start: <strong>{formatTime(startTime)}</strong>
              </p>
              <p className="mb-1">
                Time elapsed: <strong>{formatElapsedTime(elapsedTime)}</strong>
              </p>
            </>
          )}

          <div className="d-flex flex-column gap-2 mt-3">
            {status === null && (
              <Button onClick={handleStartWork} variant="primary">
                Start a Work
              </Button>
            )}
            {status === TimeSegmentType.Work && (
              <>
                <Button onClick={handleStartBreak} variant="warning">
                  Take a Break
                </Button>
                <Button onClick={handleEnd} variant="danger">
                  End a Work
                </Button>
              </>
            )}
            {status === TimeSegmentType.Break && (
              <Button onClick={handleEnd} variant="success">
                Go back to work
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
