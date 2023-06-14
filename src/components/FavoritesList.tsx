//ライブラリ
import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';
//UI
import { Box, Button, Heading, VStack, HStack, Text } from '@chakra-ui/react';
//型
import { FavoriteType } from '../types/FavoriteType';
//関数
import { AuthContext } from "../App";

export const FavoritesList = () => {
  const [favorites, setFavorites] = useState<FavoriteType[]>([]);
  const { currentUser } = useContext(AuthContext);

  const fetchAllFavorites = useCallback(async () => {
    if (!currentUser) {
      console.log("ログインしてください。");
      return;
    }
    const accessToken = localStorage.getItem("token");
    const client = Cookies.get("_client");
    const uid = Cookies.get("_uid");

    try {
      const response = await axios.get(`http://localhost:3010/api/v1/users/${currentUser.id}/favorites`, {
        headers: {
          "access-token": accessToken,
          client: client,
          uid: uid,
        },
      });
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites', error);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchAllFavorites();
  }, [fetchAllFavorites]);

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <Box>
      <Heading mb={6} color="teal.500">お気に入り一覧</Heading>
      <VStack spacing={6}>
        {favorites.map((favorite) => (
          <Box
            key={favorite.recipe.id}
            w="100%"
            boxShadow="md"
            p={6}
            borderRadius="md"
            bgColor="gray.100"
          >
            <VStack alignItems="start" spacing={4}>
              <Text fontSize="2xl" fontWeight="bold" color="blue.700">
                {favorite.recipe.title}
              </Text>
              <HStack>
                <Text fontSize="sm" color="gray.600">
                  カテゴリー:{" "}
                </Text>
                <Text fontSize="sm" fontWeight="semibold">
                  {favorite.recipe.category}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="sm" color="gray.600">
                  手軽さ:{" "}
                </Text>
                <Text fontSize="sm" fontWeight="semibold">
                  {favorite.recipe.easiness}
                </Text>
              </HStack>
            </VStack>
            <HStack justifyContent="space-between" mt={4}>
            </HStack>
          </Box>
        ))}
      </VStack>
      <HStack justifyContent="center" spacing={6} mt={8}>
        <Button onClick={goBack} colorScheme="teal">
          戻る
        </Button>
      </HStack>
    </Box>
  );
};
