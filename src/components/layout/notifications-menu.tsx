import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { notifications } from "@/config/dashboard-data";

export function NotificationsMenu() {
  const unread = notifications.filter((n) => n.unread).length;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          <button className="text-xs text-muted-foreground hover:text-foreground">
            Mark all read
          </button>
        </div>
        <Separator />
        <ScrollArea className="h-80">
          <ul className="divide-y">
            {notifications.map((n) => (
              <li
                key={n.id}
                className="flex cursor-pointer gap-3 px-4 py-3 transition-colors hover:bg-accent/40"
              >
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                    n.unread ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">{n.title}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">{n.at}</span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{n.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
        <Separator />
        <button className="w-full px-4 py-2.5 text-center text-xs font-medium text-primary hover:bg-accent/40">
          View all
        </button>
      </PopoverContent>
    </Popover>
  );
}
