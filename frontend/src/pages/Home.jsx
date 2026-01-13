import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
    const { user, loading } = useAuth();

  return (
    <div>
      <h1>ConnectKingston</h1>
      <p>Discover meaningful volunteer opportunities tailored to your interests and skills through our AI-powered matching platform.</p>

      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <Link to="/signup">Get Started</Link>
        <Link to="/signin">Sign In</Link>
        
      </div>
    </div>
  );
}