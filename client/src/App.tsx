import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/providers/AuthProvider";
import { AdminAuthProvider } from "@/hooks/use-admin-auth";
import { ThemeProvider } from "@/components/theme-provider";
import { TicketsProvider } from "@/hooks/use-tickets";
import { NotificationProvider } from "@/providers/NotificationProvider";
import { ProtectedRoute } from "@/lib/protected-route";
import AdminProtectedRoute from "@/lib/admin-protected-route";
import Navbar from "@/components/layout/navbar";
import BottomNav from "@/components/layout/bottom-nav";
import Home from "@/pages/home";
import Complaint from "@/pages/complaint";
import Resources from "@/pages/resources";
import NotFound from "@/pages/not-found";
import { Link, useLocation } from "wouter";
import AuthPage from "@/pages/auth";
import AdminLogin from "@/pages/admin-dashboard/admin-login";
import AdminTopNav from "@/pages/admin-dashboard/components/AdminTopNav";
import React, { useState, Suspense, lazy, useEffect } from "react";
import Footer from "@/components/layout/footer";
import { LoadingProvider, useLoading } from '@/providers/loading-provider';
import NotificationContainer from './components/NotificationContainer';
import PhoneWidget from './components/PhoneWidget';
import { Redirect } from "wouter";
import { TaskNotificationProvider } from "@/hooks/use-task-notifications";
import ScrollToTop from "@/components/ui/scroll-to-top";

function AppContent() {
  const [location] = useLocation();
  const { showLoading, hideLoading } = useLoading();

  console.log('AppContent rendering:', { location, isAdmin: location.startsWith('/admin-dashboard') });

  useEffect(() => {
    showLoading();
    // Hide loading after a short delay to ensure smooth transition
    const timer = setTimeout(() => {
      hideLoading();
    }, 500);
    return () => clearTimeout(timer);
  }, [location, showLoading, hideLoading]);

  const isAdminRoute = location.startsWith('/admin-dashboard');

  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={null}>
        {/* Show appropriate navigation based on route */}
        {isAdminRoute ? <AdminTopNav /> : <Navbar />}
        <main className="flex-1 pb-16">
          <Switch>
            <Route path="/" component={Home} />
            <ProtectedRoute path="/complaint" component={Complaint} />
            <Route path="/resources" component={Resources} />
            <Route path="/auth" component={AuthPage} />
            <Route path="/vakilsutra">
              {() => (
                <React.Suspense fallback={null}>
                  {React.createElement(React.lazy(() => import("@/pages/vakilsutra")))}
                </React.Suspense>
              )}
            </Route>
            <Route path="/consult">
              {() => (
                <React.Suspense fallback={null}>
                  {React.createElement(React.lazy(() => import("@/pages/consult")))}
                </React.Suspense>
              )}
            </Route>
            <Route path="/tickets">
              {() => (
                <React.Suspense fallback={null}>
                  {React.createElement(React.lazy(() => import("@/pages/tickets")))}
                </React.Suspense>
              )}
            </Route>
            <Route path="/ticket/:id">
              {() => (
                <React.Suspense fallback={null}>
                  {React.createElement(React.lazy(() => import("@/pages/ticket/[id]")))}
                </React.Suspense>
              )}
            </Route>
            <Route path="/document-vault">
              {() => (
                <React.Suspense fallback={null}>
                  {React.createElement(React.lazy(() => import("@/pages/document-vault")))}
                </React.Suspense>
              )}
            </Route>
            <Route path="/about-us">
              {() => (
                <React.Suspense fallback={null}>
                  {React.createElement(React.lazy(() => import("@/pages/more/about-us")))}
                </React.Suspense>
              )}
            </Route>
            <Route path="/events">
              {() => (
                <React.Suspense fallback={null}>
                  {React.createElement(React.lazy(() => import("@/pages/more/events")))}
                </React.Suspense>
              )}
            </Route>
            <Route path="/products">
              {() => (
                <React.Suspense fallback={null}>
                  {React.createElement(React.lazy(() => import("@/pages/more/products")))}
                </React.Suspense>
              )}
            </Route>
            <Route path="/news">
              {() => (
                <React.Suspense fallback={null}>
                  {React.createElement(React.lazy(() => import("@/pages/more/news")))}
                </React.Suspense>
              )}
            </Route>
            <Route path="/blog">
              {() => (
                <React.Suspense fallback={null}>
                  {React.createElement(React.lazy(() => import("@/pages/more/blog")))}
                </React.Suspense>
              )}
            </Route>
            <Route path="/media">
              {() => (
                <React.Suspense fallback={null}>
                  {React.createElement(React.lazy(() => import("@/pages/more/media")))}
                </React.Suspense>
              )}
            </Route>
            <Route path="/careers">
              {() => (
                <React.Suspense fallback={null}>
                  {React.createElement(React.lazy(() => import("@/pages/more/careers")))}
                </React.Suspense>
              )}
            </Route>
            <Route path="/refer">
              {() => (
                <React.Suspense fallback={null}>
                  {React.createElement(React.lazy(() => import("@/pages/more/refer")))}
                </React.Suspense>
              )}
            </Route>
            <Route path="/partner">
              {() => (
                <React.Suspense fallback={null}>
                  {React.createElement(React.lazy(() => import("@/pages/more/partner")))}
                </React.Suspense>
              )}
            </Route>
            <Route path="/talk-to-expert">
              {() => (
                <React.Suspense fallback={null}>
                  {React.createElement(React.lazy(() => import("@/pages/more/talk-to-expert")))}
                </React.Suspense>
              )}
            </Route>
            <Route path="/search">
              {() => (
                <React.Suspense fallback={null}>
                  {React.createElement(React.lazy(() => import("@/pages/search")))}
                </React.Suspense>
              )}
            </Route>
            <Route path="/services-directory">
              {() => (
                <React.Suspense fallback={null}>
                  {React.createElement(React.lazy(() => import("@/pages/services-directory")))}
                </React.Suspense>
              )}
            </Route>
            
            {/* Dynamic service route */}
            <Route path="/service/:id">
              {() => (
                <React.Suspense fallback={null}>
                  {React.createElement(React.lazy(() => import("./pages/service/[id]")))}
                </React.Suspense>
              )}
            </Route>
            
            {/* Admin Login Route - Accessible without authentication */}
            <Route path="/admin-dashboard/admin-login" component={AdminLogin} />
            
            {/* Protected Admin Dashboard Routes */}
            <Route path="/admin-dashboard">
              {() => (
                <AdminProtectedRoute>
                  <React.Suspense fallback={null}>
                    {React.createElement(React.lazy(() => import("@/pages/admin-dashboard")))}
                  </React.Suspense>
                </AdminProtectedRoute>
              )}
            </Route>
            <Route path="/admin-dashboard/tickets">
              {() => (
                <AdminProtectedRoute>
                  <React.Suspense fallback={null}>
                    {React.createElement(React.lazy(() => import("@/pages/admin-dashboard/tickets")))}
                  </React.Suspense>
                </AdminProtectedRoute>
              )}
            </Route>
            <Route path="/admin-dashboard/tickets/:id">
              {() => (
                <AdminProtectedRoute>
                  <React.Suspense fallback={null}>
                    {React.createElement(React.lazy(() => import("@/pages/admin-dashboard/tickets/[id]")))}
                  </React.Suspense>
                </AdminProtectedRoute>
              )}
            </Route>
            <Route path="/admin-dashboard/users">
              {() => (
                <AdminProtectedRoute>
                  <React.Suspense fallback={null}>
                    {React.createElement(React.lazy(() => import("@/pages/admin-dashboard/users")))}
                  </React.Suspense>
                </AdminProtectedRoute>
              )}
            </Route>
            
            {/* Redirects for legacy routes */}
            <Route path="/health-claim">
              {() => {
                window.location.replace("/service/health-claim");
                return null;
              }}
            </Route>
            <Route path="/motor-claim">
              {() => {
                window.location.replace("/service/motor-claim");
                return null;
              }}
            </Route>
            <Route path="/fire-claim">
              {() => {
                window.location.replace("/service/fire-claim");
                return null;
              }}
            </Route>
            <Route path="/life-claim">
              {() => {
                window.location.replace("/service/life-claim");
                return null;
              }}
            </Route>
            <Route path="/travel-claim">
              {() => {
                window.location.replace("/service/travel-claim");
                return null;
              }}
            </Route>
            <Route path="/property-claim">
              {() => {
                window.location.replace("/service/property-claim");
                return null;
              }}
            </Route>
            <Route path="/marine-claim">
              {() => {
                window.location.replace("/service/marine-claim");
                return null;
              }}
            </Route>
            <Route component={NotFound} />
          </Switch>
        </main>
        {!isAdminRoute && <Footer />}
        {!isAdminRoute && <ScrollToTop />}
        {!isAdminRoute && <BottomNav />}
      </Suspense>
      <NotificationContainer />
      <PhoneWidget />
    </div>
  );
}

export default function App() {
  return (
    <LoadingProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <AuthProvider>
            <AdminAuthProvider>
              <TicketsProvider>
                <NotificationProvider>
                  <TaskNotificationProvider>
                    <AppContent />
                    <Toaster />
                  </TaskNotificationProvider>
                </NotificationProvider>
              </TicketsProvider>
            </AdminAuthProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </LoadingProvider>
  );
}