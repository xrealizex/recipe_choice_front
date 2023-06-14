//ライブラリ
import React, { useEffect, useState, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
//UI
import { Box, Button, Heading, Text, VStack, HStack, SimpleGrid } from "@chakra-ui/react";
//型
import { RecipeType } from "../types/RecipeType"
//関数
import { AuthContext } from "../App";

export const RecipeChoice: React.FC = () => {
  const [randomRecipe, setRandomRecipe] = useState<RecipeType | null>(null);
  const { currentUser } = useContext(AuthContext);

  const fetchRandomRecipe = useCallback(async () => {
    if (!currentUser) {
      console.log("ログインしてください。");
      return;
    }
    const accessToken = localStorage.getItem("token");
    const client = Cookies.get("_client");
    const uid = Cookies.get("_uid");
    const response = await axios.get<RecipeType>(`http://localhost:3010/api/v1/users/${currentUser.id}/recipes/random`, {
      headers: {
        "access-token": accessToken,
        client: client,
        uid: uid,
      },
    });
    setRandomRecipe(response.data);
    console.log("fetchRandomRecipe!");
  }, [currentUser])

  useEffect(() => {
    fetchRandomRecipe();
  }, [fetchRandomRecipe]);

  return (
    <Box>
    <Heading mb={6} color="teal.500">今日の献立はこれ！</Heading>
    <SimpleGrid columns={1} spacing={10}>
      {randomRecipe && (
        <Box boxShadow="lg" p="6" borderRadius="lg" bg="white" border="1px" borderColor="gray.200">
          <Heading fontSize="2xl" fontWeight="bold" color="blue.700" textAlign="center">
            {randomRecipe.title}
          </Heading>
          <VStack align="start" mt={4}>
            <HStack>
              <Text fontSize="sm" color="gray.600">
                カテゴリー:{" "}
              </Text>
              <Text fontSize="sm" fontWeight="semibold">
                {randomRecipe.category}
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="sm" color="gray.600">
                手軽さ:{" "}
              </Text>
              <Text fontSize="sm" fontWeight="semibold">
                {randomRecipe.easiness}
              </Text>
            </HStack>
          </VStack>
        </Box>
      )}
    </SimpleGrid>
    <HStack spacing={6} mt={8}>
      <Button colorScheme="teal" onClick={fetchRandomRecipe} size="lg">
        他の献立にする
      </Button>
      <Link to="/recipes/new">
        <Button colorScheme="teal" size="lg">献立作成</Button>
      </Link>
      <Link to="/rakutens">
        <Button colorScheme="teal" size="lg">献立検索</Button>
      </Link>
    </HStack>
  </Box>
  );
};
