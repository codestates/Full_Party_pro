import axios from "axios";

// action types
export const NOTIFY = "NOTIFY";

// actions creator functions
export function notify(data: object): { type: string; payload: Promise<any>; } {
  const request = axios.post("/notification", data)
    .then(res => res.data);
  return {
    type: "NOTIFY",
    payload: request
  }; 
}