//ライブラリ
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
//UI
import { Box, Flex, IconButton, Button, Link, Modal, VStack, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
//関数
import { signOut } from "../lib/api/auth";
import { AuthContext } from "../App";

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const { loading, isSignedIn, setIsSignedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const res = await signOut();

      if (res.data.success === true) {
        Cookies.remove("_access_token");
        Cookies.remove("_client");
        Cookies.remove("_uid");
        localStorage.removeItem('token');

        setIsSignedIn(false);
        navigate("/signin");

        console.log("ログアウトに成功しました。");
      } else {
        console.log("ログアウトに失敗しました。");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const renderAuthButtons = () => {
    if (loading) {
      return null;
    }
    if (isSignedIn) {
      return (
        <Button colorScheme="white" variant="link" color="white" backgroundColor="transparent" _hover={{ backgroundColor: "teal.300" }} onClick={handleSignOut}>
          ログアウト
        </Button>
      );
    }
    return null;
  };

  return (
    <Box bg="teal.500" color="white" px={4}>
      <Flex h="4rem" alignItems="center">
      <IconButton
        aria-label="Menu"
        size="md"
        icon={<HamburgerIcon />}
        color="white"
        backgroundColor="transparent"
        _hover={{ backgroundColor: "teal.300" }}
        mr={4}
        onClick={openModal}
      />
      <Link href="/" color="white" fontWeight="bold" fontSize="xl" mr="auto">
        こんだてChoice!
      </Link>
      {renderAuthButtons()}
      <Modal size="lg" isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent mx={5} my={10}>
          <ModalHeader color="teal.500" fontSize="2xl" fontWeight="bold">Menu</ModalHeader>
          <ModalCloseButton />
          <ModalBody mx={5} my={5}>
            <VStack spacing={4} align="start">
              <Link href="/recipes" color="teal.500" textDecoration="underline" fontWeight="light">献立一覧</Link>
              <Link href="/" color="teal.500" textDecoration="underline" fontWeight="light">今日の献立</Link>
              <Link href="/recipes/new" color="teal.500" textDecoration="underline" fontWeight="light">献立作成</Link>
              <Link href="/favorites" color="teal.500" textDecoration="underline" fontWeight="light">お気に入り一覧</Link>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
      </Flex>
    </Box>
  );
};
