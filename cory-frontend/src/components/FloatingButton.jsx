import { Link } from "react-router-dom";

export default function FloatingButton({ to, label }) {
  return (
    <Link to={to} className="floating-button">
      {label}
    </Link>
  );
}
