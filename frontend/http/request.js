import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../store/store";
import { tokenExpired } from "../store/authSlice";

// need to change the backend corresponding to the env
const api = axios.create({
  // deploy server URL
  baseURL: "http://20.2.19.2:9000",
  // local testing
  // baseURL: 'http://10.68.73.189:3000'

  // cyw local ip
  //   baseURL: "http://192.168.31.143:9000",
});

api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    config.headers["token"] = token;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // token expired
    if (response.data.status == 7) {
      AsyncStorage.removeItem("token");
      store.dispatch(tokenExpired());
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
