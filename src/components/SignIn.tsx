//ライブラリ
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
//UI
import { Box, VStack, Heading, FormControl, FormLabel, Input, Button, Text, Link, useToast } from "@chakra-ui/react";
//関数
import { AuthContext } from "../App";
import { signIn } from "../lib/api/auth";
import { SignInParams } from "../types/SignInParamsType";

export const SignIn: React.FC = () => {
  //ステート
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  //関数
  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();

  //ログイン機能
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>, params: SignInParams) => {
    e.preventDefault();
    try {
      const res = await signIn(params);
      if (res.status === 200) {
        // ログインに成功した場合はCookieに各値を格納
        Cookies.set("_access_token", res.headers["access-token"]);
        Cookies.set("_client", res.headers["client"]);
        Cookies.set("_uid", res.headers["uid"]);
        // トークンをlocalStorageに保存する
        localStorage.setItem('token', res.headers["access-token"]);
        setIsSignedIn(true);
        setCurrentUser(res.data.data);
        navigate("/");
        console.log("ログインに成功しました。");
      } else {
        toast({
          title: "Error",
          description: "メールアドレスまたはパスワードが違います。",
          status: "error",
          duration: 5000,
          isClosable: true
        });
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: "メールアドレスまたはパスワードが違います。",
        status: "error",
        duration: 5000,
        isClosable: true
      });
    }
  };

  //ゲストログイン機能
  const handleGuestSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    const guestParams: SignInParams = {
      email: process.env.REACT_APP_GUEST_EMAIL || '',
      password: process.env.REACT_APP_GUEST_PASSWORD || ''
    };
    handleSubmit(e, guestParams);
  };

  return (
    <Box maxW="400px" mx="auto" mt={10}>
      <VStack spacing={5}>
        <Heading textAlign="center" size="lg">
          ログイン
        </Heading>
        <FormControl>
          <FormLabel>メールアドレス</FormLabel>
          <Input
            type="email"
            placeholder="example@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>パスワード</FormLabel>
          <Input
            type="password"
            placeholder="6文字以上"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </FormControl>
        <Button
          width="100%"
          colorScheme="orange"
          onClick={(e) => handleSubmit(e, { email, password })}
          isDisabled={!email || !password}
        >
          ログイン
        </Button>
        <Button
          width="100%"
          colorScheme="orange"
          onClick={handleGuestSubmit}
        >
          試しに使ってみる
        </Button>
        <Text textAlign="center">
          アカウントをお持ちでなければ{" "}
          <Link textDecoration="underline" onClick={() => navigate('/signup')}>
            会員登録へ
          </Link>
        </Text>
      </VStack>
    </Box>
  );
};
