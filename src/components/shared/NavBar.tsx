import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { CirclePlus, History } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
export function NavBar({
  setNLInput,
}: {
  setNLInput: (value: string) => void;
}) {
  const navigator = useNavigate();
  const newQuery = () => {
    setNLInput("");
    navigator("/");
  };
  return (
    <div className="flex justify-between py-4 px-12">
      <div className="flex items-center">
        <a href="/">
          <img src={Logo} alt="Edubase Logo" className="h-6" />
        </a>
      </div>
      <div className="flex items-center gap-3">
        <ModeToggle />
        {/* tooltip showing feature is coming soon */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="bg-gray-100 dark:bg-gray-800 opacity-50 shadow-none "
            >
              <History size={16} />
              History
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            <p>Coming soon...</p>
          </TooltipContent>
        </Tooltip>

        <Button className="cursor-pointer" onClick={newQuery}>
          <CirclePlus />
          New query
        </Button>
      </div>
    </div>
  );
}
