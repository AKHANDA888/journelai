import { Home, PenSquare, BarChart2, User, Target } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/write", label: "Write", icon: PenSquare },
  { path: "/insights", label: "Insights", icon: BarChart2 },
  { path: "/tracker", label: "Tracker", icon: Target },
  { path: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 pb-4">
        <div className="flex justify-around items-center h-16 bg-background/80 backdrop-blur-sm border-t border-border/50 rounded-t-lg">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center justify-center w-1/5 text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <item.icon className={cn("h-6 w-6", isActive && "text-primary")} />
                <span className={cn("text-xs mt-1", isActive && "text-primary font-semibold")}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1 h-1 w-8 bg-accent rounded-full"
                    layoutId="underline"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
