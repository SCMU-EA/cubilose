import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { Guide } from "./posts/guide";
import { BlogList } from "./posts/blogList";

import Navigation from "./posts/navigation";
const Home: NextPage = () => {
  const { data: userData } = useSession();
  // const [isAuth, setIsAuth] = useState<boolean>(false);
  // const [currentUser, setCurrentUser] = useState<User>();
  // const setUser = async () => {
  //   const user = window.localStorage.getItem("user");
  //   if (user) {
  //     await setCurrentUser(JSON.parse(user));
  //     setIsAuth(true);
  //   }
  // };

  return <>{userData?.user ? <Index /> : <Guide />}</>;
};

const Index: NextPage = () => {
  return (
    <>
      <Navigation></Navigation>
      <BlogList></BlogList>
    </>
  );
};

export default Home;
