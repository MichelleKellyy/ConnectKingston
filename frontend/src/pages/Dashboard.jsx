import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
export default function Dashboard() {
  const {user, loading, logout} = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
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