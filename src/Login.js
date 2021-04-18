import React, { useCallback, useEffect, useState } from "react";

const SCOPES = ["user-read-email", "playlist-modify-public"];

const LOGIN_URL =
  "https://accounts.spotify.com/authorize?client_id=" +
  process.env.REACT_APP_CLIENT_ID +
  "&redirect_uri=" +
  encodeURIComponent(process.env.REACT_APP_REDIRECT_URI) +
  "&scope=" +
  encodeURIComponent(SCOPES.join(" ")) +
  "&response_type=token";

const width = 450,
  height = 730,
  left = window.screen.width / 2 - width / 2,
  top = window.screen.height / 2 - height / 2;

const ACCESS_TOKEN_REGEX_PATTERN = /(?<=access_token=)[^&$]*/;

function Login() {
  const [newWindow, setNewWindow] = useState(null);

  const login = useCallback(() => {
    const newWindow = window.open(
      LOGIN_URL,
      "Spotify",
      "menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=" +
        width +
        ", height=" +
        height +
        ", top=" +
        top +
        ", left=" +
        left
    );
    newWindow.addEventListener("load", getAcessTokenFromNewWindow, false);
    setNewWindow(newWindow);
  }, []);

  const getAcessTokenFromNewWindow = (event) => {
    const accessToken = event?.currentTarget?.location?.hash
      ?.substr(1)
      ?.match(ACCESS_TOKEN_REGEX_PATTERN)?.[0];

    if (accessToken) {
      sessionStorage.setItem("accessToken", accessToken);
      event?.currentTarget?.close();
      window.location.reload();
    }
  };

  const getAcessToken = (event) => {
    if (event.data) {
      const hash = JSON.parse(event.data);
      if (hash.type === "access_token") {
        sessionStorage.setItem("accessToken", hash.access_token);

        window.close();
        window.location.reload();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("message", getAcessToken, false);

    return function cleanup() {
      window.removeEventListener("message", getAcessToken);
      newWindow?.removeEventListener("load", getAcessTokenFromNewWindow);
    };
  });

  return (
    <div className="App">
      <button onClick={login}>Login</button>
    </div>
  );
}

export default Login;
