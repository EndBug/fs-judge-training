"use client";

import { Globe } from "lucide-react";

import { Button } from "~/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";
import { Tooltip } from "./ui/tooltip";
import { routing, type SupportedLocale } from "~/i18n/routing";
import { useRouter } from "next/navigation";
import nookies from "nookies";
import { ForwardPropsToChild } from "./util/forward-props-to-child";

export function LanguageToggle() {
  const router = useRouter();

  const changeLocale = async (locale: SupportedLocale) => {
    // Navigate to the current path, but with the new locale, using the app router
    void router.push(window.location.pathname.replace(/^\/(\w+)\/?.*/, locale));
    // Save cookie
    nookies.set(null, "NEXT_LOCALE", locale, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ForwardPropsToChild>
          <Tooltip content={<p>Toggle theme</p>}>
            <Button variant="outline" size="icon">
              <Globe />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </Tooltip>
        </ForwardPropsToChild>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {routing.locales.map((lang) => (
          <DropdownMenuItem key={lang} onClick={() => changeLocale(lang)}>
            {lang.toUpperCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
