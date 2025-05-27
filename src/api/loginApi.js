import axios from "axios";

const loginApi = axios.create({
  baseURL: "http://localhost:5106/api/Login",
});

export default loginApi;
