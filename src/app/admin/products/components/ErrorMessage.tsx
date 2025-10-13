import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <Card className="mb-6 bg-red-500/10 border-red-500/30">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-400 text-sm sm:text-base">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}
