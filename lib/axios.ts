import axios, { type AxiosError, type AxiosResponse } from "axios";
import { Credentials, LoginRequest, SignupRequest, type QueuedRequest } from "./types";
import { store } from "./redux/store";
import { handleApiError, isTokenExpired } from "./utils";
import { router } from "expo-router";
import { setAuthState } from "./redux/slices/auth";
import { deleteCredentials } from "./secureStorage";

export const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;
let requestQueue: QueuedRequest[] = [];

const processRequestQueue = ({ error, token }: { error: unknown; token: string | null }) => {
  requestQueue.map((request) => {
    if (!token) {
      request.reject(error);
    } else {
      request.resolve(token);
    }
  });
  requestQueue = [];
};

client.interceptors.request.use(
  async (config) => {
    if (config.url?.includes("open") || config.url?.includes("auth")) return config;
    const controller = new AbortController();
    const { auth } = store.getState();
    if (!auth.credentials) {
      console.log("no auth");
      if (auth.status !== "loading") {
        router.replace("/login");
      }
      controller.abort();
      return {
        ...config,
        signal: controller.signal,
      };
    }
    if (isTokenExpired(auth.credentials.accessToken)) {
      if (isRefreshing) {
        try {
          const token = await new Promise((resolve, reject) =>
            requestQueue.push({ resolve, reject })
          );
          config.headers.Authorization = `Bearer ${token as string}`;
          return config;
        } catch (error) {
          controller.abort();
          return {
            ...config,
            signal: controller.signal,
          };
        }
      }
      isRefreshing = true;
      console.log("refreshing auth");
      try {
        const response = await refreshToken(auth.credentials.refreshToken);
        console.log("refreshed auth");
        const credentials = response.data;
        store.dispatch(
          setAuthState({
            status: "authenticated",
            credentials: {
              accessToken: credentials.accessToken,
              refreshToken: credentials.refreshToken,
              user: credentials.user,
            },
          })
        );
        config.headers.Authorization = `Bearer ${credentials.accessToken}`;
        processRequestQueue({ error: null, token: credentials.accessToken });
        isRefreshing = false;
        return config;
      } catch (error) {
        handleApiError(error);
        processRequestQueue({ error: error, token: null });
        await deleteCredentials();
        isRefreshing = false;
        controller.abort();
        return {
          ...config,
          signal: controller.signal,
        };
      }
    }
    console.log("vaild auth");
    config.headers.Authorization = `Bearer ${auth.credentials.accessToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError | Error) => {
    const { auth } = store.getState();
    if (axios.isAxiosError(error)) {
      const originalRequest = error.config;
      if (!originalRequest) {
        return Promise.reject(error);
      }
      const { status } = (error.response as AxiosResponse) ?? {};
      if (status === 403) {
        console.log("auth error");
        if (!auth.credentials) {
          if (auth.status !== "loading") {
            router.replace("/login");
          }
          return Promise.reject(error);
        }
        if (isRefreshing) {
          try {
            const token = await new Promise((resolve, reject) =>
              requestQueue.push({ resolve, reject })
            );
            originalRequest.headers.Authorization = `Bearer ${token as string}`;
            return client(originalRequest);
          } catch (error) {
            return Promise.reject(error);
          }
        }
        isRefreshing = true;
        try {
          const response = await refreshToken(auth.credentials.refreshToken);
          console.log("refreshed auth");
          const credentials = response.data;
          store.dispatch(
            setAuthState({
              status: "authenticated",
              credentials: {
                accessToken: credentials.accessToken,
                refreshToken: credentials.refreshToken,
                user: credentials.user,
              },
            })
          );
          originalRequest.headers.Authorization = `Bearer ${credentials.accessToken}`;
          processRequestQueue({
            error: null,
            token: credentials.accessToken,
          });
          isRefreshing = false;
          return client(originalRequest);
        } catch (error) {
          handleApiError(error);
          processRequestQueue({ error: error, token: null });
          isRefreshing = false;
          return Promise.reject(error);
        }
      }
    }
    return Promise.reject(error);
  }
);

export const signup = (signupRequest: SignupRequest) => {
  return client<Credentials>({
    url: `/auth/signup`,
    method: "POST",
    data: signupRequest,
  });
};

export const login = (loginRequest: LoginRequest) => {
  return client<Credentials>({
    url: `/auth/login`,
    method: "POST",
    data: loginRequest,
  });
};

export const validate = () => {
  return client<{ status: string }>({
    url: `/validate`,
    method: "GET",
  });
};

export const refreshToken = (token: string) => {
  return client<Credentials>({
    url: `/auth/refresh`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const searchByImage = (image: string) => {
  return client<{}>({
    url: `/searchByImage`,
    method: "POST",
    data: { image },
  });
};
