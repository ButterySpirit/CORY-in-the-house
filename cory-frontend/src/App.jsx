import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import "./index.css"; // Ensure Tailwind works
import AppRouter from "./Router"; // Assuming you have this file

export default function App() {
  return (
    <Theme>
      <AppRouter />
    </Theme>
  );
}
