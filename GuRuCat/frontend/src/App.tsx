import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MoodProvider } from "./Context/MoodContext";
import Router from "./routes/router";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>

      <MoodProvider>
        <Router />
      </MoodProvider>
    </QueryClientProvider>
  );
}
export default App;