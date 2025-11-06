// client/src/App.tsx
import React from 'react';
import { Route, Switch, Router } from 'wouter';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

import ErrorBoundary from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/contexts/ThemeContext';

import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import { APP_TITLE } from '@/const';

function Routes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  React.useEffect(() => {
    document.title = `${APP_TITLE} e Credenciamento`;
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router base={import.meta.env.BASE_URL}>
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
