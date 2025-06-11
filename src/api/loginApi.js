import axios from "axios";

const loginApi = axios.create({
  baseURL: "http://localhost:5100/api/Login",
});

export default loginApi;
