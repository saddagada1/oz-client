import { useEffect } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { Preloader } from "@/components/navigation/preloader";
import { useRouter } from "expo-router";
import { setAuthState } from "@/lib/redux/slices/auth";
import { deleteCredentials, getCredentials, setCredentials } from "@/lib/secureStorage";
import { refreshToken } from "@/lib/axios";
import { isTokenExpired } from "@/lib/utils";

export default function Index() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      let credentials = await getCredentials();
      console.log(credentials);
      if (!credentials) {
        dispatch(setAuthState({ status: "unauthenticated", credentials: null }));
        router.replace("/login");
      } else {
        try {
          if (isTokenExpired(credentials.accessToken)) {
            credentials = (await refreshToken(credentials.refreshToken)).data;
            await setCredentials(credentials);
          }
          console.log("initial auth valid");
          dispatch(setAuthState({ status: "authenticated", credentials }));
          router.replace("/vision");
        } catch (error) {
          console.log("no initial auth");
          await deleteCredentials();
          router.replace("/login");
        }
      }
    };

    init();
  }, []);

  return <Preloader />;
}
