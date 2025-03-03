import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import "./index.css"; // Ensure Tailwind works
import AppRouter from "./Router";
import { AuthProvider } from "./context/AuthContext"; // ✅ Fix Import

export default function App() {
  return (
    <AuthProvider> {/* ✅ Wrap App in AuthProvider */}
      <Theme>
        <AppRouter />
      </Theme>
    </AuthProvider>
  );
}
