//ライブラリ
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//UI
import { Box, CircularProgress, Flex, Text, useToast } from "@chakra-ui/react";
//関数
import { RecipeChoice } from "./RecipeChoice";
import { AuthContext } from "../App";

export const Home: React.FC = () => {
  const { loading, isSignedIn, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!loading && !isSignedIn) {
      navigate("/signin");
    }
  }, [loading, isSignedIn, navigate]);

  useEffect(() => {
    if (!loading && !isSignedIn) {
      navigate("/signin");
    } else if (isSignedIn && currentUser) {
      toast({
        title: "Signed in successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  }, [loading, isSignedIn, currentUser, navigate, toast]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress isIndeterminate color="teal.300" />
      </Box>
    );
  }

  return (
    <>
      {isSignedIn && currentUser ? (
        <>
          <Flex justifyContent="flex-end" alignItems="center" p={2}>
            <Text fontSize="sm" fontWeight="bold" color="teal.500">{currentUser?.name}の献立</Text>
          </Flex>
          <RecipeChoice />
        </>
      ) : (
        <h1>ログインしてください。</h1>
      )}
    </>
  );
};
