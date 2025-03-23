import { Outlet } from "react-router-dom";
import Navbar from "./Navbar"; // Adjust the path if needed

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="pt-16"> {/* Optional padding if your navbar is fixed */}
        <Outlet /> {/* This renders the child route component */}
      </main>
    </>
  );
}
