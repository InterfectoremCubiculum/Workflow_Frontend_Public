import { useRef, useState, useEffect } from "react";
import { TimeSegmentType } from "../../../enums/TimeSegmentType";
import { Badge, Button } from "react-bootstrap";
import { EndWork, ResumeWork, StartBreak, StartWork, WidgetSync } from "../../../services/workLogService";
import "./WorkLogWidget.css";
import { ChevronDown, ChevronUp, Clock } from "react-bootstrap-icons";

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

  const handleEnd = async (state: TimeSegmentType) => {
    if (state === TimeSegmentType.Work) {
      await EndWork().then(() => {
        setStatus(null);
        setStartTime(null);
      });
    } else if (state === TimeSegmentType.Break) {
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
    <div className={`widget p-3 ${isMinimized ? "widget-minimized" : "rounded"}`}>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <Clock />
          <h6 className="m-0">
            <span>Status:</span>{" "}
            <Badge bg={
              status === TimeSegmentType.Work
                ? "success"
                : status === TimeSegmentType.Break
                ? "warning"
                : "secondary"
            }>
              {status === TimeSegmentType.Work
                ? "Working"
                : status === TimeSegmentType.Break
                ? "On Break"
                : "Offline"}
            </Badge>
          </h6>
        </div>
        <Button
          variant="link"
          size="sm"
          onClick={toggleMinimize}
          className="p-0 ms-2"
          style={{ width: "28px", height: "28px" }}
          aria-label={isMinimized ? "Expand widget" : "Minimize widget"}
        >
          {isMinimized ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </Button>
      </div>

      {!isMinimized && (
        <>
          {startTime && (
            <>
              <hr className="my-2" />
              <div className="small text-muted">
                <p className="mb-1">
                  <strong>Started:</strong> {formatTime(startTime)}
                </p>
                <p className="mb-1">
                  <strong>Elapsed:</strong> {formatElapsedTime(elapsedTime)}
                </p>
              </div>
            </>
          )}

          <div className="d-grid gap-2 mt-3">
            {status === null && (
              <Button onClick={handleStartWork} variant="primary" size="sm">
                Start Work
              </Button>
            )}
            {status === TimeSegmentType.Work && (
              <>
                <Button onClick={handleStartBreak} variant="warning" size="sm">
                  Take a Break
                </Button>
                <Button onClick={() => handleEnd(TimeSegmentType.Work)} variant="danger" size="sm">
                  End Work
                </Button>
              </>
            )}
            {status === TimeSegmentType.Break && (
              <>
                <Button onClick={() => handleEnd(TimeSegmentType.Break)} variant="success" size="sm">
                  Resume Work
                </Button>
                <Button onClick={() => handleEnd(TimeSegmentType.Work)} variant="danger" size="sm">
                  End Work
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
