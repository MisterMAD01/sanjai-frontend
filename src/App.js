import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { UserProvider } from "./contexts/UserContext";

function App() {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
}

export default App;
