import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";

export default function Dashboard() {
  const {user, loading, logout} = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
    <Nav/>
      <h1>User Dashboard</h1>
        {user ? (
        <p>Logged in as: {user.email}</p>
      ) : (
        <p>Not logged in</p>
      )}

      <button onClick={handleLogout}>Log Out</button>

    </>
  );
}