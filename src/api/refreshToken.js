import loginApi from "./loginApi";

export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) throw new Error("No refresh token");

  try {
    const response = await loginApi.post("/refresh-token", { refreshToken });
    const { access_token, refresh_token } = response.data.result;

    localStorage.setItem("access_token", access_token);
    if (refresh_token) {
      localStorage.setItem("refresh_token", refresh_token);
    }
    return access_token;
  } catch (error) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    throw error;
  }
}
