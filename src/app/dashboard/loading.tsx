import { Logo } from "@/components/ui/logo";

export default function Loading() {
  return (
    <div className="flex-1 h-full w-full flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-50">
      <div className="relative flex items-center justify-center">
        {/* Pulsing ring */}
        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
        {/* Static Logo */}
        <div className="relative bg-background rounded-full p-2">
          <Logo size="lg" />
        </div>
      </div>
      <p className="mt-6 text-sm font-medium text-muted-foreground animate-pulse tracking-widest uppercase">
        Loading...
      </p>
    </div>
  );
}
