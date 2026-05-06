import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Courts from "./pages/Courts.tsx";
import CourtDetail from "./pages/CourtDetail.tsx";
import Owner from "./pages/Owner.tsx";
import Bookings from "./pages/Bookings.tsx";
import Academy from "./pages/Academy.tsx";
import PadelCoaching from "./pages/PadelCoaching.tsx";
import { BookingProvider } from "./context/BookingContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <BookingProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/courts" element={<Courts />} />
            <Route path="/courts/:id" element={<CourtDetail />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/owner" element={<Owner />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/padel-coaching" element={<PadelCoaching />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BookingProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
