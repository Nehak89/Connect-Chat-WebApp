import { Badge, Box, Button, Text } from "@chakra-ui/react";
import { Tooltip } from "../../components/ui/tooltip.jsx";
import { ChatState } from "../../context/chatProvider";
import { Avatar } from "../../components/ui/avatar";
import { useHistory } from "react-router";
import { Input } from "@chakra-ui/react";
import React, { useState } from "react";
import { Spinner } from "@chakra-ui/react";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "../../components/ui/menu";
import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
} from "../../components/ui/drawer";
import axios from "axios";
import { toaster } from "../../components/ui/toaster";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../Chatlogics";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    user,
    chats,
    setSelectedChat,
    setChats,
    notification,
    setNotification,
  } = ChatState();

  const [open, setOpen] = useState(false);

  const history = useHistory();

  const handleSearchClick = () => {
    setOpen(true); // Open the drawer when the button is clicked
  };

  const handleSearch = async () => {
    if (!search) {
      toaster.create({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/app/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toaster.create({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const accessChat = async (userId) => {
    try {
      setLoading(true);
      const config = {
        "Content-type": "application/json",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/app/chat", { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setLoading(false);
      setSelectedChat(data);
      setLoadingChat(false);
      setOpen(false);
    } catch (error) {
      toaster.create({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip showArrow content="Search Users to chat">
          <Button
            variant="outline"
            color="black"
            _hover={{
              color: "white", // Text color on hover
              bg: "#38B2AC",
            }}
          >
            <Text
              d={{ base: "none", md: "flex" }}
              px={4}
              onClick={handleSearchClick}
            >
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans">
          Live Connect
        </Text>
        <div>
          <MenuRoot>
            <MenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                color="black"
                bg="white"
                _hover={{
                  color: "white", // Text color on hover
                  bg: "#38B2AC",
                }}
              >
                Notification 🔔
                {notification.length > 0 && (
                  <Badge color="white" ml={2} bg="red">
                    {notification.length}
                  </Badge>
                )}
              </Button>
            </MenuTrigger>
            <MenuContent
              overflowY="auto" //  scrolling if content overflows
              bg="#38B2AC"
            >
              <MenuItem
                _hover={{
                  bg: "white",
                  color: "black",
                }}
              >
                {!notification.length && "No New Messages"}
                {notification.map((notif) => (
                  <MenuItem
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotification(notification.filter((n) => n !== notif));
                    }}
                    bg="#38B2AC"
                    color="white"
                    _hover={{
                      bg: "white",
                      color: "black",
                    }}
                  >
                    New message from {getSender(user, notif.chat.users)}
                  </MenuItem>
                ))}
              </MenuItem>
            </MenuContent>
          </MenuRoot>
          <MenuRoot>
            <MenuTrigger asChild>
              <Button size="sm">
                <Avatar name={user.name} bg="#38B2AC" />
              </Button>
            </MenuTrigger>
            <MenuContent bg="#38B2AC">
              <MenuItem
                bg="#38B2AC"
                _hover={{
                  bg: "white",
                  color: "black",
                }}
              >
                Username: {user.name}
              </MenuItem>
              <MenuItem
                bg="#38B2AC"
                onClick={logoutHandler}
                _hover={{
                  bg: "white",
                  color: "black",
                }}
              >
                Logout
              </MenuItem>
            </MenuContent>
          </MenuRoot>
        </div>
      </Box>

      <DrawerRoot
        placement="start"
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
      >
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Search Users</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner size="sm" color="white" />}
          </DrawerBody>
          <DrawerFooter>
            <DrawerActionTrigger asChild>
              <Button variant="outline" bg="white" color="black">
                Cancel
              </Button>
            </DrawerActionTrigger>
          </DrawerFooter>
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>
    </>
  );
};

export { SideDrawer };
