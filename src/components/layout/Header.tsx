import { Bell, MessageCircle, Search } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";

export function Header() {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-black/5 bg-white px-6 py-4">
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
      <div className="flex flex-1 items-center justify-end gap-3">
        <div className="flex w-full max-w-xs items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm text-slate-400">
          <Search className="h-4 w-4" />
          <span>Search anything...</span>
        </div>
        <Button>Create</Button>
        <IconButton aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </IconButton>
        <IconButton aria-label="Chat">
          <MessageCircle className="h-4 w-4" />
        </IconButton>
        <Avatar name="David Alvarez" size="md" />
      </div>
    </header>
  );
}
