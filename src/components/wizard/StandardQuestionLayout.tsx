import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StandardQuestionLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export const StandardQuestionLayout = ({ 
  title, 
  subtitle, 
  children, 
  className 
}: StandardQuestionLayoutProps) => {
  return (
    <div className={cn("h-full flex flex-col px-2", className)}>
      {/* Title Section */}
      <div className="flex-shrink-0 text-center mb-1">
        <h2 className="text-base font-semibold text-foreground leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      
      {/* Content Section - Centered and scrollable if needed */}
      <div className="flex-1 flex flex-col justify-center min-h-0">
        <div className="mx-auto w-full max-w-xs">
          {children}
        </div>
      </div>
    </div>
  );
};