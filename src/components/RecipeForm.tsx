//ライブラリ
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie"
//UI
import { Box, Heading, FormControl, FormLabel, Input, Textarea, Button, Select, VStack } from "@chakra-ui/react";
//関数
import { AuthContext } from "../App";

type RecipeFormProps = {
  isNew?: boolean;
  initialValues?: {
    id?: number;
    title: string;
    description?: string;
    category: string;
    easiness: number;
  };
};

const axiosBaseInstance = axios.create({
  baseURL: "http://localhost:3010",
  headers: {
    "Content-Type": "application/json",
  },
});

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  const client = Cookies.get("_client");
  const uid = Cookies.get("_uid");

  if (token && client && uid) {
    return {
      "access-token": token,
      client: client,
      uid: uid,
    };
  } else {
    return {};
  }
};

export const RecipeForm: React.FC<RecipeFormProps> = ({
  isNew = true,
  initialValues = { title: "", description: "", category: "和食", easiness: 1 },
}) => {
  //ステート
  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description);
  const [category, setCategory] = useState(initialValues.category);
  const [easiness, setEasiness] = useState(initialValues.easiness);
  //関数
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const headers = getAuthHeaders();
    console.log(headers)

  if (!currentUser) {
    return;
  }

  if (isNew) {
    await axiosBaseInstance.post(`/api/v1/users/${currentUser.id}/recipes`, { title, description, category, easiness }, { headers });
  } else {
    await axiosBaseInstance.put(`/api/v1/users/${currentUser.id}/recipes/${initialValues.id}`, { title, description, category, easiness }, { headers });
  }
  navigate("/");
  };

  return (
    <Box>
      <Heading mb={6} color="teal.500">
        {isNew ? "新しい献立を作成" : "献立を編集"}
      </Heading>
      <Box as="form" onSubmit={handleSubmit}>
        <FormControl id="title" mt={4}>
          <FormLabel>タイトル</FormLabel>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>
      <FormControl id="description" mt={4}>
        <FormLabel>説明</FormLabel>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormControl>
      <FormControl id="category" mt={4}>
        <FormLabel>カテゴリー</FormLabel>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="和食">和食</option>
          <option value="洋食">洋食</option>
          <option value="中華">中華</option>
          <option value="麺類">麺類</option>
          <option value="パン">パン</option>
          <option value="揚げ物">揚げ物</option>
          <option value="肉">肉</option>
          <option value="魚">魚</option>
          <option value="スイーツ">スイーツ</option>
          <option value="お菓子">お菓子</option>
          <option value="ヘルシー">ヘルシー</option>
          <option value="その他">その他</option>
        </Select>
      </FormControl>
      <FormControl id="easiness" mt={4}>
        <FormLabel>手軽さ (1-5)</FormLabel>
        <Select
          value={easiness}
          onChange={(e) => setEasiness(parseInt(e.target.value))}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </Select>
      </FormControl>
      <VStack mt={5} spacing={5} align="stretch">
      <Button colorScheme="teal" type="submit">
        {isNew ? "献立作成" : "献立更新"}
        </Button>
      <Button onClick={goBack} colorScheme="teal">
        戻る
      </Button>
    </VStack>
    </Box>
  </Box>
  );
};
