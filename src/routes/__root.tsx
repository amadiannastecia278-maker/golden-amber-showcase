import { Outlet, Link, createRootRoute, HeadContent, Scripts, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { CursorGlow } from "@/components/site/CursorGlow";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 grain relative">
      <div className="max-w-md text-center relative">
        <h1 className="font-display text-8xl font-bold gradient-silver-text">404</h1>
        <h2 className="mt-4 font-sans text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">This page does not exist.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-full gradient-button text-black px-6 py-2.5 text-sm font-semibold">Go home</Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Amadi Annastecia Amarachi | Full Stack Developer" },
      { name: "description", content: "Full Stack Web & App Developer crafting scalable digital experiences. Available for freelance projects." },
      { name: "author", content: "Amadi Annastecia Amarachi" },
      { property: "og:title", content: "Amadi Annastecia Amarachi | Full Stack Developer" },
      { property: "og:description", content: "Full Stack Web & App Developer crafting scalable digital experiences." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Amadi Annastecia Amarachi | Full Stack Developer" },
      { name: "twitter:description", content: "Full Stack Web & App Developer crafting scalable digital experiences." },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body className="bg-background text-foreground">{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/amastecia-admin");
  return (
    <>
      <CursorGlow />
      {!isAdmin && <Navbar />}
      <main className={isAdmin ? "" : "pt-20"}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      {!isAdmin && <Footer />}
      <Toaster theme="dark" richColors position="top-center" />
    </>
  );
}
