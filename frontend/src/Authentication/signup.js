import React from "react";
import { Field } from "../components/ui/field";
import { Input } from "@chakra-ui/react";
//import { useToast } from "@chakra-ui/react";
import { Button, Fieldset, Stack } from "@chakra-ui/react";
import { toaster } from "../components/ui/toaster";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router";

const Signup = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  // const toast = useToast();
  const history = useHistory();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [password, setPassword] = useState("");
  // const [pic, setPic] = useState();
  // const [picLoading, setPicLoading] = useState(false);

  const submitHandler = async () => {
    if (!name || !email || !password || !confirmpassword) {
      toaster.create({
        title: "Please Fill all the Feilds",
        type: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (password !== confirmpassword) {
      toaster.create({
        title: "Passwords Do Not Match",
        type: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(name, email, password);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "http://localhost:5001/app/user",
        {
          name,
          email,
          password,
        },
        config
      );
      console.log(data);
      toaster.create({
        title: "Registration Successful",
        type: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));

      history.push("/chats");
    } catch (error) {
      toaster.create({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  return (
    <Fieldset.Root size="lg" maxW="md">
      <Stack spacing="5">
        <Field label="Name">
          <Input
            name="name"
            placeholder="Enter Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>

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

        <Field label="Confirm Password">
          <Input
            name="confirmpassword"
            type={show ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmpassword}
            onChange={(e) => setConfirmpassword(e.target.value)}
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

        {/* <Field label="Upload your Picture">
          <Input
            type="file"
            p={1.5}
            accept="image/*"
            // onChange={(e) => postDetails(e.target.files[0])}
          />
        </Field> */}

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
          Sign Up
        </Button>
      </Stack>
    </Fieldset.Root>
  );
};

export default Signup;
