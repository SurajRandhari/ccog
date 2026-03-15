"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, forwardRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";

const aboutLinks = [
  { href: "/about", label: "Our Story", description: "Learn about our history, mission and core values." },
  { href: "/about/pastor", label: "Our Pastor", description: "Meet Rev. Suresh Randhari and his family." },
  { href: "/about/membership", label: "Membership", description: "Find out how to become a part of our church family." },
  { href: "/about/connect", label: "I'm New Here", description: "Everything you need to know for your first visit." },
];

const resourceLinks = [
  { href: "/resources/sermons", label: "Sermons", description: "Watch and listen to recent messages." },
  { href: "/resources/devotions", label: "Daily Devotions", description: "Start your day with spiritual encouragement." },
  { href: "/resources/songs", label: "Songs & Lyrics", description: "Browse our library of worship songs." },
  { href: "/resources/blog", label: "Church Blog", description: "Articles and updates from our community." },
  { href: "/resources/downloads", label: "Downloads", description: "Forms, study materials, and other resources." },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-lg border-b border-neutral-200/50 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <span className="font-serif text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl">
              Calvary
            </span>
            <span className="hidden text-sm font-light tracking-widest text-neutral-500 uppercase sm:inline">
              Church of God
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), pathname === "/" && "text-neutral-900")}>
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className={cn(pathname.startsWith("/about") && "text-neutral-900")}>
                    About
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {aboutLinks.map((link) => (
                        <ListItem
                          key={link.href}
                          title={link.label}
                          href={link.href}
                        >
                          {link.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className={cn(pathname.startsWith("/resources") && "text-neutral-900")}>
                    Resources
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {resourceLinks.map((link) => (
                        <ListItem
                          key={link.href}
                          title={link.label}
                          href={link.href}
                        >
                          {link.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/offering" legacyBehavior passHref>
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), pathname.startsWith("/offering") && "text-neutral-900")}>
                      Offering
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/events" legacyBehavior passHref>
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), pathname.startsWith("/events") && "text-neutral-900")}>
                      Events
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/contact" legacyBehavior passHref>
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), pathname.startsWith("/contact") && "text-neutral-900")}>
                      Contact
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="ml-4">
              <Link href="/about/connect">
                <InteractiveHoverButton className="w-40 text-xs">
                  New Here
                </InteractiveHoverButton>
              </Link>
            </div>
          </div>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" aria-label="Open navigation menu" className="md:hidden" />}
            >
              <AnimatePresence mode="wait">
                {open ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80 pt-12 overflow-y-auto">
              <nav className="flex flex-col space-y-4">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-4 py-2 text-lg font-medium transition-colors",
                    pathname === "/" ? "text-neutral-900 bg-neutral-50 rounded-lg" : "text-neutral-600"
                  )}
                >
                  Home
                </Link>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="about" className="border-none">
                    <AccordionTrigger className="px-4 py-2 text-lg hover:no-underline">
                      About
                    </AccordionTrigger>
                    <AccordionContent className="bg-neutral-50 rounded-xl mt-1 p-2">
                      <div className="flex flex-col space-y-1">
                        {aboutLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "px-4 py-3 rounded-lg text-sm transition-colors",
                              pathname === link.href ? "text-neutral-900 font-semibold" : "text-neutral-600"
                            )}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="resources" className="border-none mt-2">
                    <AccordionTrigger className="px-4 py-2 text-lg hover:no-underline">
                      Resources
                    </AccordionTrigger>
                    <AccordionContent className="bg-neutral-50 rounded-xl mt-1 p-2">
                      <div className="flex flex-col space-y-1">
                        {resourceLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "px-4 py-3 rounded-lg text-sm transition-colors",
                              pathname === link.href ? "text-neutral-900 font-semibold" : "text-neutral-600"
                            )}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Link
                  href="/offering"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-4 py-2 text-lg font-medium transition-colors",
                    pathname.startsWith("/offering") ? "text-neutral-900 bg-neutral-50 rounded-lg" : "text-neutral-600"
                  )}
                >
                  Offering
                </Link>

                <Link
                  href="/events"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-4 py-2 text-lg font-medium transition-colors",
                    pathname.startsWith("/events") ? "text-neutral-900 bg-neutral-50 rounded-lg" : "text-neutral-600"
                  )}
                >
                  Events
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-4 py-2 text-lg font-medium transition-colors",
                    pathname.startsWith("/contact") ? "text-neutral-900 bg-neutral-50 rounded-lg" : "text-neutral-600"
                  )}
                >
                  Contact
                </Link>
              </nav>

              <div className="mt-12 px-4 pt-8 border-t border-neutral-100">
                <Link href="/about/connect" onClick={() => setOpen(false)}>
                  <InteractiveHoverButton className="w-full">
                    New Here
                  </InteractiveHoverButton>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </motion.header>
  );
}

const ListItem = forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-colors hover:bg-neutral-50 hover:text-neutral-900 focus:bg-neutral-50 focus:text-neutral-900",
            className
          )}
          {...props}
        >
          <div className="text-sm font-semibold leading-none">{title}</div>
          <p className="line-clamp-2 text-xs leading-snug text-neutral-500">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
