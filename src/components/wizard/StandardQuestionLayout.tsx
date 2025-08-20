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
    <div className={cn("h-full flex flex-col p-3", className)}>
      {/* Title Section */}
      <div className="flex-shrink-0 text-center mb-3">
        <h2 className="text-lg font-semibold text-foreground leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">
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