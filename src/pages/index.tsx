import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { boolean } from "zod";
import { trpc } from "../utils/trpc";
import type { User } from "../types/utils";
import Login from "./posts/login";
import Navigation from "./posts/navigation";
const Home: NextPage = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User>();
  const setUser = async () => {
    const user = window.localStorage.getItem("user");
    if (user) {
      await setCurrentUser(JSON.parse(user));
      setIsAuth(true);
    }
  };
  useEffect(() => {
    setUser();
  }, []);
  return <>{isAuth ? <Index /> : <Login setUser={() => setUser()} />}</>;
};

const Index: NextPage = () => {
  return <Navigation></Navigation>;
};

export default Home;
