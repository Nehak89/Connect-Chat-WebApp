import React, { useEffect } from "react";
import { Box, Container, Tabs, Text } from "@chakra-ui/react";
import Login from "../Authentication/login.js";
import Signup from "../Authentication/signup.js";
import { useHistory } from "react-router";

const Homepage = () => {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/chats");
  }, [history]);
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text
          fontSize="4xl"
          fontFamily="Work sans"
          color="black"
          textAlign="center"
        >
          LiveConnect 🌐🤝
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs.Root lazyMount unmountOnExit defaultValue="tab-1">
          <Tabs.List>
            <Tabs.Trigger
              value="tab-1"
              width="50%"
              color="black"
              _selected={{
                bg: "green.600",
                color: "white",
                fontWeight: "bold",
              }}
            >
              Login
            </Tabs.Trigger>
            <Tabs.Trigger
              value="tab-2"
              width="50%"
              color="black"
              _selected={{
                bg: "green.600",
                color: "white",
                fontWeight: "bold",
              }}
            >
              Signup
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content
            value="tab-1"
            style={{
              padding: "20px",
              backgroundColor: "#fff", // White background for content
              color: "#000", // Black text for visibility
            }}
          >
            <Login />
          </Tabs.Content>
          <Tabs.Content
            value="tab-2"
            style={{
              padding: "20px",
              backgroundColor: "#fff", // White background for content
              color: "#000", // Black text for visibility
            }}
          >
            <Signup />
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Container>
  );
};

export default Homepage;
