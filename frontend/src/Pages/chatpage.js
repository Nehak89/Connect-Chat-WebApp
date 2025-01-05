import { Box } from "@chakra-ui/react";
import { useState } from "react";
import Chatbox from "../Authentication/Chatbox";
import Mychats from "../Authentication/Mychats";
import { SideDrawer } from "../Authentication/miscellaneous/SideDrawer";
import { ChatState } from "../context/chatProvider";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <Mychats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;
