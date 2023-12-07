import {
  El_Messiri,
  Noto_Kufi_Arabic,
  IBM_Plex_Sans_Arabic,
  Noto_Naskh_Arabic,
} from "next/font/google";
import "./globals.css";
import Navigation from "../components/headers/navigation";

import AuthProvider from "./context/AuthProvider";

// redux store
import StoreProvider from "../../store/StoreProvider";

import { ApolloWrapper } from "./lib/apollo-provider";
import { Toaster, toast } from "sonner";

import { Providers } from "../components/graphql/Providers";

const ElMessiri = Noto_Naskh_Arabic({
  weight: "400",
  subsets: ["arabic"],
});

const metadata = {
  title: "Tahado",
  description: "A gift ecommerce",
};

function RootLayout({ children }) {
  return (
    <html lang="ar">
      <Providers>
        <StoreProvider>
          <body className={`${ElMessiri.className} `}>
            <ApolloWrapper>
              <AuthProvider>
                <Navigation />

                <Toaster />
                {children}
              </AuthProvider>
            </ApolloWrapper>
          </body>
        </StoreProvider>
      </Providers>
    </html>
  );
}

export default RootLayout;
