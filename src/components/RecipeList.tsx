//ライブラリ
import React, { useEffect, useState, useCallback, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie"
//UI
import { Box, Button, Heading, VStack, HStack, Text, IconButton } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
//型
import { RecipeType } from "../types/RecipeType";
import { FavoriteType } from "../types/FavoriteType";
//関数
import { AuthContext } from "../App";

export const RecipeList: React.FC = () => {
  const { currentUser } = useContext(AuthContext);
  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  const [favorites, setFavorites] = useState<FavoriteType[]>([]);

  const fetchAllRecipes = useCallback(async () => {
    if (!currentUser) {
      console.log("ログインしてください。");
      return;
    }
    const accessToken = localStorage.getItem("token");
    const client = Cookies.get("_client");
    const uid = Cookies.get("_uid");
    const response = await axios.get<RecipeType[]>(`http://localhost:3010/api/v1/users/${currentUser.id}/recipes`, {
    headers: {
      "access-token": accessToken,
      client: client,
      uid: uid,
    },
    });
    setRecipes(response.data);
    console.log("fetchAllRecipes!");
  }, [currentUser])

  const deleteRecipe = async (id: number) => {
    if (!currentUser) {
      console.log("ログインしてください。");
      return;
    }
    const accessToken = localStorage.getItem("token");
    const client = Cookies.get("_client");
    const uid = Cookies.get("_uid");

    try {
      await axios.delete(`http://localhost:3010/api/v1/users/${currentUser.id}/recipes/${id}`, {
        headers: {
          "access-token": accessToken,
          client: client,
          uid: uid,
        },
      });
      alert("削除に成功しました。")
      console.log("削除に成功しました。")
      fetchAllRecipes();
    } catch (error) {
      console.log(error);
      console.log(id)
    }
  };

  useEffect(() => {
    fetchAllRecipes();
  }, [fetchAllRecipes]);

  const fetchFavorites = useCallback(async () => {
    if (!currentUser) {
      console.log("ログインしてください。");
      return;
    }
    const accessToken = localStorage.getItem("token");
    const client = Cookies.get("_client");
    const uid = Cookies.get("_uid");
    const response = await axios.get<FavoriteType[]>(`http://localhost:3010/api/v1/users/${currentUser.id}/favorites`, {
      headers: {
        "access-token": accessToken,
        client: client,
        uid: uid,
      },
    });
    setFavorites(response.data);
    console.log("fetchFavorites!");
  }, [currentUser])

  const isFavorite = (recipeId: number) => {
    return favorites.some(favorite => favorite.recipe.id === recipeId);
  };

  const handleFavorite = async (recipeId: number) => {
    if (!currentUser) {
      console.log("ログインしてください。");
      return;
    }
    const accessToken = localStorage.getItem("token");
    const client = Cookies.get("_client");
    const uid = Cookies.get("_uid");
    try {
      if (isFavorite(recipeId)) {
        await axios.delete(`http://localhost:3010/api/v1/users/${currentUser.id}/favorites/${recipeId}`, {
          headers: {
            "access-token": accessToken,
            client: client,
            uid: uid,
          },
          data: {
            user_id: currentUser.id,
            recipe_id: recipeId,
          },
        });
        console.log("お気に入りから削除しました。")
      } else {
        await axios.post(`http://localhost:3010/api/v1/users/${currentUser.id}/favorites`, {
          recipe_id: recipeId,
        }, {
          headers: {
            "access-token": accessToken,
            client: client,
            uid: uid,
          },
        });
        console.log("お気に入りに追加しました。")
      }
      fetchFavorites();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <Box>
      <Heading mb={6} color="teal.500">献立一覧</Heading>
      <VStack spacing={6}>
        {recipes.map((recipe) => (
          <Box
            key={recipe.id}
            w="100%"
            boxShadow="md"
            p={6}
            borderRadius="md"
            bgColor="gray.100"
          >
            <VStack alignItems="start" spacing={4}>
              <Text fontSize="2xl" fontWeight="bold" color="blue.700">
                {recipe.title}
              </Text>
              <HStack>
                <Text fontSize="sm" color="gray.600">
                  カテゴリー:{" "}
                </Text>
                <Text fontSize="sm" fontWeight="semibold">
                  {recipe.category}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="sm" color="gray.600">
                  手軽さ:{" "}
                </Text>
                <Text fontSize="sm" fontWeight="semibold">
                  {recipe.easiness}
                </Text>
              </HStack>
            </VStack>
            <HStack justifyContent="space-between" mt={4}>
              <Link to={`/recipes/${recipe.id}`}>
                <Button colorScheme="teal">詳細</Button>
              </Link>
              <Button colorScheme="orange" onClick={() => deleteRecipe(recipe.id)}>
                削除
              </Button>
              <IconButton aria-label="Add to favorites" icon={isFavorite(recipe.id) ? <StarIcon color="orange.500"/> : <StarIcon color="gray.500"/>} onClick={() => handleFavorite(recipe.id)}/>
            </HStack>
          </Box>
        ))}
      </VStack>
      <HStack mt={5} spacing={5}>
        <Link to="/recipes/new">
          <Button colorScheme="teal" width="100px">献立作成</Button>
        </Link>
        <Button onClick={goBack} colorScheme="teal" width="100px">
          戻る
        </Button>
      </HStack>
    </Box>
  );
};
