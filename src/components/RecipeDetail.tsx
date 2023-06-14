//ライブラリ
import React, { useEffect, useState, useCallback, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
//UI
import { Box, Heading, Text, Button, HStack, VStack, Spinner, Center } from "@chakra-ui/react";
//関数
import { AuthContext } from "../App";

type Recipe = {
  id: number;
  title: string;
  description: string;
  category: string;
  easiness: number;
};

export const RecipeDetail: React.FC = () => {
  //ステート
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const { id } = useParams<{ id: string }>();
  //関数
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  const { currentUser } = useContext(AuthContext);

  const fetchRecipe = useCallback(async () => {
    if (!currentUser) {
      console.log("ログインしてください。");
      return;
    }
    const accessToken = localStorage.getItem("token");
    const client = Cookies.get("_client");
    const uid = Cookies.get("_uid");

    const response = await axios.get<Recipe>(`http://localhost:3010/api/v1/users/${currentUser.id}/recipes/${id}`, {
      headers: {
        "access-token": accessToken,
        client: client,
        uid: uid,
      },
    });
    setRecipe(response.data);
  }, [currentUser, id])

  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);

  if (!recipe) {
    return (
      <Center h="100vh">
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="teal.500" size="xl" />
      </Center>
    );
  }

  return (
    <Box mx="auto" maxW="4xl">
      <VStack spacing={4} align="start">
        <Heading mb={6} color="teal.500" fontSize="4xl">
          {recipe.title}
        </Heading>
        <Text fontSize="xl" fontWeight="bold">説明:</Text>
        <Text mt={2} fontSize="lg">{recipe.description}</Text>
        <Text fontSize="xl" fontWeight="bold">カテゴリー:</Text>
        <Text mt={2} fontSize="lg">{recipe.category}</Text>
        <Text fontSize="xl" fontWeight="bold">手軽さ:</Text>
        <Text mt={2} fontSize="lg">{recipe.easiness} / 5</Text>
      </VStack>
      <HStack justifyContent="center" spacing={6} mt={8}>
        <Link to={`/recipes/${recipe.id}/edit`}>
          <Button colorScheme="blue">
            編集
          </Button>
        </Link>
        <Button onClick={goBack} colorScheme="blue">
          戻る
        </Button>
      </HStack>
    </Box>
  );
};
