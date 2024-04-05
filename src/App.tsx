import Layout from "@/layout/Layout";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function App() {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark">
      <Layout />
    </NextThemesProvider>
  );
}
