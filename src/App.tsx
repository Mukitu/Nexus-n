import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AppShell } from "@/components/platform/AppShell";

import DashboardPage from "@/pages/DashboardPage";
import TeamPage from "@/pages/TeamPage";
import UserGuidePage from "@/pages/UserGuidePage";
import CVBuilderPage from "@/pages/CVBuilderPage";
import StockMarketPage from "@/pages/StockMarketPage";
import TravelServicePage from "@/pages/portal/TravelServicePage";
import MedicalServicePage from "@/pages/portal/MedicalServicePage";
import BloodBankServicePage from "@/pages/portal/BloodBankServicePage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="stocks" element={<StockMarketPage />} />
            <Route path="cv" element={<CVBuilderPage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="guide" element={<UserGuidePage />} />

            {/* Smart District services */}
            <Route path="services/travel" element={<TravelServicePage />} />
            <Route path="services/medical" element={<MedicalServicePage />} />
            <Route path="services/blood-bank" element={<BloodBankServicePage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
