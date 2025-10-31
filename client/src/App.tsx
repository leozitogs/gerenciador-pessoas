import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Router } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

/** Cabeçalho com glass + título visível */
function AppHeader() {
  return (
    <header className="glass-card p-4 sticky top-0 z-20">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-semibold">
          Gerenciador de Pessoas e Credenciamento
        </h1>
        {/* espaço pra ações globais no futuro */}
      </div>
    </header>
  );
}

function Routes() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/404"} component={NotFound} />
      {/* Fallback final */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // garante o título do documento no build
  React.useEffect(() => {
    document.title = "Gerenciador de Pessoas e Credenciamento";
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          {/*
            Wouter com base = subpath do GitHub Pages.
            import.meta.env.BASE_URL = "/gerenciador-pessoas/" vindo do Vite.
          */}
          <Router base={import.meta.env.BASE_URL}>
            <AppHeader />
            <main className="container mx-auto p-4">
              <Routes />
            </main>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
