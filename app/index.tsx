import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Preloader } from "@/components/navigation/preloader";
import { useRouter } from "expo-router";
import { setAuthState } from "@/lib/redux/slices/auth";
import { getCredentials } from "@/lib/secureStorage";
import { useQuery } from "@tanstack/react-query";
import { validate } from "@/lib/axios";

export default function Index() {
  const { credentials } = useAppSelector((store) => store.auth);
  const {
    data: auth,
    isFetching: validatingAuth,
    isPending: awaitingCredentials,
  } = useQuery({ queryKey: ["validate"], queryFn: validate, enabled: !!credentials });
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (awaitingCredentials || validatingAuth) return;

    if (auth?.data.status === "ok") {
      router.replace("/vision");
    } else {
      router.replace("/login");
    }
  }, [auth, awaitingCredentials, validatingAuth]);

  useEffect(() => {
    const init = async () => {
      const credentials = await getCredentials();
      console.log(credentials);
      if (!credentials) {
        dispatch(setAuthState({ status: "unauthenticated", credentials: null }));
        router.replace("/login");
      } else {
        dispatch(setAuthState({ status: "authenticated", credentials }));
      }
    };

    init();
  }, []);

  return <Preloader />;
}
