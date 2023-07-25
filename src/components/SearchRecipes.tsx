//ライブラリ
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
//UI
import { Box, Input, Button, VStack, Link, Heading, Text } from "@chakra-ui/react";

type Recipe = {
  categoryId: number | null;
  categoryName: string;
  categoryUrl: string;
  parentCategoryId: number | null;
};

export const SearchRecipes = () => {
  const [keyword, setKeyword] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const searchRecipes = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_RAKUTEN_API_URL}/rakutens?keyword=${keyword}`);
      const filteredRecipes = response.data.filter((recipe: Recipe) => recipe.categoryName.includes(keyword)).slice(0, 3);
      if (filteredRecipes.length > 0) {
        setRecipes(filteredRecipes);
      } else {
        setRecipes([{ categoryId: null, categoryName: `検索の結果、「${keyword}」を含む献立は見つかりませんでした。別のキーワードで検索してください。`, categoryUrl: "", parentCategoryId: null }]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <Box p={5}>
      <VStack spacing={5} align="stretch">
        <Input
          type="text"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          mb={4}
          placeholder="キーワードを入力してください"
        />
        <Button onClick={searchRecipes} colorScheme="orange" mb={4}>検索する</Button>
        {recipes.map((recipe, index) => (
          <Box key={index} p={5} shadow="md" borderWidth="1px" flex="1" borderRadius="md">
            <Heading fontSize="xl">{recipe.categoryName}</Heading>
            {recipe.categoryUrl && (
              <Text mt={4}>
                <Link isExternal href={recipe.categoryUrl} color="orange.500">ページを表示する ⇲</Link>
              </Text>
            )}
          </Box>
        ))}
        <Button onClick={goBack} colorScheme="orange">
          戻る
        </Button>
      </VStack>
    </Box>
  );
};
