import React, { useEffect, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { Task } from "../models/Task.ts";

type EventComponentProps = {
  event: any;
  handleDeleteTask: (id: string) => void;
};

const getStatusColor = (status: string) => {
    switch (status) {
      case "Not Started":
        return "#f39c12";
      case "In Progress":
        return "#3498db";
      case "Completed":
        return "#2ecc71";
      default:
        return "#95a5a6";
    }
  };
const EventComponent: React.FC<EventComponentProps> = ({
  event,
  handleDeleteTask,
}) => {
  const [zohoId, setZohoId] = useState<any>(event.resource?.zohoId);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (zohoId) return;

    const timer = setTimeout(() => {
      setError(true);
    }, 40000);

    if (event.resource?.zohoId) {
      setZohoId(event.resource.zohoId);
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [event.resource?.zohoId, zohoId]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleDeleteTask(event.id);
  };

  return (
    <div className="event-card" onClick={() => console.log("Clicked event")}>
      <div className="event-header">
        <span className="event-title">{event.title}</span>
        <span className="event-delete" onClick={handleDelete}>
          <DeleteOutlined style={{ color: "#e74c3c" }} />
        </span>
      </div>

      <div className="event-meta">
        <div>
          <span
            className="event-tag"
            style={{
              backgroundColor: getStatusColor(event.resource?.status),
            }}
          >
            {event.resource?.status || "No status"}
          </span>

          {event.resource?.priority && (
            <span className="event-priority">{event.resource.priority}</span>
          )}
        </div>

        <div className="event-priority-2">
          <span>Id:</span>
          <strong>
            {zohoId ? (
              zohoId
            ) : error ? (
              "Lỗi"
            ) : (
              <div className="loader"></div>
            )}
          </strong>
        </div>
      </div>
    </div>
  );
};

export default EventComponent;
