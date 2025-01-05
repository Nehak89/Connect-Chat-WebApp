import React from "react";
import { Field } from "../components/ui/field";
import { Input } from "@chakra-ui/react";
// import { useToast } from "@chakra-ui/react";
import { Button, Fieldset, Stack } from "@chakra-ui/react";
import { toaster } from "../components/ui/toaster";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router";

const Login = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const submitHandler = async () => {
    if (!email || !password) {
      toaster.create({
        title: "Please Fill all the Feilds",
        type: "error",
        duration: 4000,
      });
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "http://localhost:5001/app/user/login",
        { email, password },
        config
      );

      toaster.create({
        title: "Login Successful , Please RELOAD if not rendered",
        type: "success",
        duration: 6000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      history.push("/chats");
    } catch (error) {
      toaster.create({
        title: "Error Occured!",
        description: error.response.data.message,
        type: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <Fieldset.Root size="lg" maxW="md">
      <Stack spacing="5">
        <Field label="Email Address">
          <Input
            name="email"
            type="email"
            placeholder="Enter Your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <Field label="Password">
          <Input
            name="password"
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            h="1.75rem"
            size="sm"
            onClick={handleClick}
            variant="outline"
            color="black"
            _hover={{
              color: "white",
            }}
          >
            {show ? "Hide" : "Show"}
          </Button>
        </Field>

        <Button
          colorScheme="blue"
          width="100%"
          bg="green.500"
          borderRadius="full"
          onClick={submitHandler}
          // isLoading={picLoading}
          style={{ marginTop: 15 }}
          _hover={{
            bgGradient: "linear(to-r, green.500, green.700)",
            boxShadow: "xl",
          }}
        >
          Login
        </Button>
        <Button
          variant="solid"
          color="red"
          width="100%"
          borderColor="red" // Adds red border
          borderWidth="2px"
          onClick={() => {
            setEmail("guest@example.com");
            setPassword("hellothisisguest");
          }}
        >
          Get Guest User Credentials
        </Button>
      </Stack>
    </Fieldset.Root>
  );
};

export default Login;
