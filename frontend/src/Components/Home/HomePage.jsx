import { useEffect } from "react";
import "./home.css";
import { getAllUsers } from "../../redux/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //DUMMY DATA
  const userList = useSelector(
    (state) => state.users.users?.allUsers
  );
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (user?.accessToken) getAllUsers(user?.accessToken, dispatch);
  }, []);
  return (
    <main className="home-container">
      <div className="home-title">User List</div>
      <div className="home-userlist">
        {userList?.map((user) => {
          return (
            <div className="user-container">
              <div className="home-user">{user.username}</div>
              <div className="delete-user"> Delete </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default HomePage;
