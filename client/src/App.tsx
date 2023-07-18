import { Authenticated, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { ErrorComponent, notificationProvider, RefineSnackbarProvider, ThemedLayoutV2 } from "@refinedev/mui";
import { CssBaseline, GlobalStyles } from "@mui/material";
import routerBindings, {CatchAllNavigate, NavigateToResource, UnsavedChangesNotifier } from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { authProvider } from "./authProvider";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { ForgotPassword } from "./pages/forgotPassword";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { FcContacts, FcEditImage } from "react-icons/fc";
import Datos from "./pages/datos";
import { AppIcon } from "./components/app-icon";
import PublicProfile from "./pages/public";
import VCard from "./pages/vcard";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <Refine
              dataProvider={dataProvider("https://mylicard.onrender.com/")}
              notificationProvider={notificationProvider}
              authProvider={authProvider}
              routerProvider={routerBindings}
              resources={[
                {
                  name: "datos",
                  list: "/datos",
                  meta: {
                    icon: <FcEditImage />,
                    canDelete: true,
                  },
                },
                {
                  name: "vcards",
                  list: "/vcard",
                  meta: {
                    icon: <FcContacts />,
                    canDelete: true,
                  },
                },                
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
              }}
            >
              <Routes>

              {/* Dashboard */}
                <Route
                  element={
                    <Authenticated fallback={<CatchAllNavigate to="/login" />}>
                      <ThemedLayoutV2
                        Header={() => <Header sticky={true} />}
                        Title={({ collapsed }) => (<AppIcon collapsed={collapsed}/>)}
                      >
                        <Outlet />
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                {/* Datos */}
                  <Route index element={<NavigateToResource resource="datos" />}/>
                    <Route path="/datos">
                      <Route index element={<Datos />} />
                    </Route>
                  <Route path="*" element={<ErrorComponent />} />
                {/* VCard */}
                  <Route index element={<NavigateToResource resource="vcard" />}/>
                    <Route path="/vcard">
                      <Route index element={<VCard />} />
                    </Route>
                  <Route path="*" element={<ErrorComponent />} />
                </Route>

              {/* Autenticación */}
                <Route>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                </Route>

              {/* Página Dinámica de Usuario */}
                <Route path="/:username" element={<PublicProfile />} />
              </Routes>

              <RefineKbar />
              <UnsavedChangesNotifier />
            </Refine>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
