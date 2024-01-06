import { useEffect } from "react";
import { useAuth } from "@packages/contexts/auth";
import { useSearchParams } from "react-router-dom";

const ssoDomain: string = `${import.meta.env.VITE_ACC_BASE_URL}`;
const redirectUri: string = `${import.meta.env.VITE_DOMAIN}/login`;
const client_id: string = `${import.meta.env.VITE_SOLUTION_CODE}`;
const client_secret: string = `${import.meta.env.VITE_SOLUTION_SECRET}`;

export const LoginSsoPage = () => {
  const { login, logout } = useAuth();
  const [searchParams, _] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");

    if (code) {
      console.log("found auth code", code);
      let params = new URLSearchParams();
      params.append("client_id", client_id);
      params.append("client_secret", client_secret);
      params.append("grant_type", "authorization_code");
      params.append("code", code);
      params.append("redirect_uri", redirectUri);

      fetch(`${ssoDomain}/OAuth/token`, {
        method: "post",
        body: params,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      })
        .then(async (resp) => {
          const data = await resp.json();
          console.log("returned token", resp);
          if (!!data.access_token) {
            console.log("login with token", data);
            login(data.access_token);
            debugger;
            window.location.href = "/select-network";
          } else {
            console.log("failed to get token, do logout", data);
            logout();
          }
        })
        .catch((err) => {
          console.log(err);
          logout();
          return;
        });
    } else {
      // redirect to igoss for sso
      console.log(
        "redirect to igoss for sso",
        ssoDomain,
        client_id,
        redirectUri
      );
      window.location.href = `${ssoDomain}/OAuth/Authorize?client_id=${client_id}&redirect_uri=${encodeURI(
        redirectUri
      )}&scope=identity&response_type=code`;
    }
  }, []);

  return (
    <>
      <div
        style={{ position: "relative", height: "100vh", width: "100vw" }}
      ></div>
    </>
  );
};
