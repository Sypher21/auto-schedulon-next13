"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle, Group, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useTeamModal } from "@/hooks/use-team-modal"
import { useParams, useRouter } from "next/navigation"
import { Team } from "@prisma/client"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface TeamSwitcherProps extends PopoverTriggerProps {
  items: Team[];
}

export default function TeamSwitcher({ className, items = [] }: TeamSwitcherProps) {
  const teamModal = useTeamModal();
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    name: item.name,
    id: item.id
  }));

  const currentTeam = formattedItems.find((item) => item.id === params.teamId);

  const [open, setOpen] = React.useState(false)

  const onTeamSelect = (team: { id: string, name: string }) => {
    setOpen(false);
    router.push(`/${team.id}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Wähle eine Gruppe"
          className={cn("w-[200px] justify-between", className)}
        >
          <Users className="mr-2 h-4 w-4" />
          {currentTeam?.name}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Suche Gruppen..." />
            <CommandEmpty>Kein Team gefunden</CommandEmpty>
            <CommandGroup heading="Gruppen">
              {formattedItems.map((team) => (
                <CommandItem
                  key={team.id}
                  onSelect={() => onTeamSelect(team)}
                  className="text-sm"
                >
                  <Users className="mr-2 h-4 w-4" />
                  {team.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentTeam?.id === team.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  teamModal.onOpen()
                }}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Team erstellen
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};