import { client } from "./client"
import  Cookies  from "js-cookie"
import { SignUpParams } from "../../types/SignUpParamsType"
import { SignInParams } from "../../types/SignInParamsType"

// サインアップ（新規アカウント作成）
export const signUp = (params: SignUpParams) => {
  return client.post("auth", params)
}

// サインイン（ログイン）
export const signIn = (params: SignInParams)  => {
  return client.post("auth/sign_in", params)
}

// サインアウト（ログアウト）
export const signOut = () => {
  return client.delete("auth/sign_out", { headers: {
    "access-token": Cookies.get("_access_token"),
    "client": Cookies.get("_client"),
    "uid": Cookies.get("_uid")
  }})
}

// ヘッダーを取得する関数
const getAuthHeaders = () => {
  const accessToken = Cookies.get("_access_token");
  const client = Cookies.get("_client");
  const uid = Cookies.get("_uid");

  if (!accessToken || !client || !uid) {
    return null;
  }

  return {
    "access-token": accessToken,
    "client": client,
    "uid": uid
  };
};

// 認証済みのユーザーを取得
export const getCurrentUser = async () => {
  const headers = getAuthHeaders();
  if (!headers) return;
  return client.get("/auth/sessions", { headers });
};
