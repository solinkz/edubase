import Logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { CirclePlus, History } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export function NavBar() {
  return (
    <div className="flex justify-between py-4 px-12">
      <div className="flex items-center">
        <a href="/">
          <img src={Logo} alt="Edubase Logo" className="h-6" />
        </a>
      </div>
      <div className="flex items-center gap-3">
        <ModeToggle />
        <Button
          variant="outline"
          className="bg-gray-100 dark:bg-gray-800 cursor-pointer shadow-none"
        >
          <History />
          History
        </Button>
        <Button className="cursor-pointer">
          <CirclePlus />
          New query
        </Button>
      </div>
    </div>
  );
}
