"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-orange-950/20 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">AI Помощник</h1>
            <p className="text-gray-400">AI чат будет доступен после настройки Rust backend</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Главная
            </Link>
          </Button>
        </div>

        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur p-8 text-center">
          <p className="text-gray-400 text-lg">
            Эта страница будет активирована после реализации Rust AI Gateway
          </p>
        </Card>
      </div>
    </div>
  );
}
