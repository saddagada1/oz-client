import { AxiosError } from "axios";
import { ApiError } from "./types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const checkIfApiError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const apiError = error as AxiosError<ApiError>;
    if (!!apiError.response) {
      return apiError.response.data;
    } else {
      return error.status;
    }
  }
};

export const handleApiError = (error: unknown, options?: { fatal?: boolean }) => {
  if (!!error && (error as { message: string }).message === "canceled") return;
  const apiError = checkIfApiError(error);
  if (!!apiError && !options?.fatal) {
    if (typeof apiError === "number") {
      switch (apiError) {
        case 403:
          console.log("please login before proceeding");
      }
    } else {
      console.error(`${apiError.subject}: ${apiError.message}`);
    }
  } else {
    console.error("something went wrong. please refresh and try again.");
  }
};

export const isTokenExpired = (token: string) => {
  const arrayToken = token.split(".");
  const tokenPayload = JSON.parse(atob(arrayToken[1]));
  return Math.floor(new Date().getTime() / 1000) >= tokenPayload?.exp - 300;
};

export const getRelativeTime = (time: string | Date) => {
  return dayjs(time).fromNow();
};

export const greeting = (): string => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "good morning";
  } else if (hour < 18) {
    return "good afternoon";
  } else {
    return "good evening";
  }
};
