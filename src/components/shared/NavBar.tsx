import Logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { CirclePlus, History } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export function NavBar() {
  return (
    <div className="flex justify-between py-4 px-12">
      <div className="flex items-center">
        <img src={Logo} alt="Edubase Logo" className="h-6" />
      </div>
      <div className="flex items-center gap-3">
        <ModeToggle />
        <Button
          variant="secondary"
          className="border border-gray-200 dark:border-gray-800 cursor-pointer hover:bg-gray-200 hover:border-gray-300 dark:hover:border-gray-800 dark:hover:bg-gray-800"
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
