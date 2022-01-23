import axios from "axios";

export const NOTIFY = "NOTIFY";

export const notify = (data: object): { type: string; payload: Promise<any>; } => {
  const request = axios.post("/notification", data).then(res => res.data);
  return {
    type: "NOTIFY",
    payload: request
  };
}