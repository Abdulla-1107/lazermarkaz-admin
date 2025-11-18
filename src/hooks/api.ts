import axios from "axios";

const api = axios.create({
  baseURL: "https://api.lazermarkaz.uz",
});

export default api;
