import { useState } from "react";
import { Plus, Users, Home, Calendar, FileText, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { QuickAddModal } from "./QuickAddModal";

interface QuickAddButtonProps {
  onSuccess?: () => void;
  variant?: "default" | "floating";
}

export function QuickAddButton({ onSuccess, variant = "default" }: QuickAddButtonProps) {
  const [modalType, setModalType] = useState<"lead" | "property" | "showing" | "task" | null>(null);

  const handleOpenModal = (type: "lead" | "property" | "showing" | "task") => {
    setModalType(type);
  };

  if (variant === "floating") {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              size="lg" 
              className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl z-50 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Quick Add</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleOpenModal("lead")} className="cursor-pointer">
              <Users className="h-4 w-4 mr-2" />
              New Lead
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOpenModal("property")} className="cursor-pointer">
              <Home className="h-4 w-4 mr-2" />
              New Property
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOpenModal("task")} className="cursor-pointer">
              <FileText className="h-4 w-4 mr-2" />
              New Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <QuickAddModal
          type={modalType || "lead"}
          open={modalType !== null}
          onOpenChange={(open) => !open && setModalType(null)}
          onSuccess={onSuccess}
        />
      </>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Quick Add
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Add New</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleOpenModal("lead")} className="cursor-pointer">
            <Users className="h-4 w-4 mr-2" />
            New Lead
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleOpenModal("property")} className="cursor-pointer">
            <Home className="h-4 w-4 mr-2" />
            New Property
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleOpenModal("task")} className="cursor-pointer">
            <FileText className="h-4 w-4 mr-2" />
            New Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <QuickAddModal
        type={modalType || "lead"}
        open={modalType !== null}
        onOpenChange={(open) => !open && setModalType(null)}
        onSuccess={onSuccess}
      />
    </>
  );
}
