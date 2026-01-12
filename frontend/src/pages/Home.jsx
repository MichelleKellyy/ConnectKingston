import { Link } from "react-router-dom";

export default function Home() {
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