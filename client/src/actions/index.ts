import axios from "axios";

export const LOGIN_USER = "LOGIN_USER";
export const REGISTER_USER = "REGISTER_USER";

export function loginUser(data: object): { type: string; payload: Promise<any>; } {
  const request = axios.post("/signin", data).then(res => res.data);
  return {
    type: "LOGIN_USER",
    payload: request
  };
}
export function signupUser(data: object): { type: string; payload: Promise<any>; } {
  const request = axios.post("/signup", data).then(res => res.data);
  return {
    type: "REGISTER_USER",
    payload: request
  };
}