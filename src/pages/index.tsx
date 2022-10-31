import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { Guide } from "./posts/guide";
import { BlogList } from "./posts/blogList";
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

  return <>{userData ? <Index /> : <Guide />}</>;
};

const Index: NextPage = () => {
  return <BlogList></BlogList>;
};

export default Home;
