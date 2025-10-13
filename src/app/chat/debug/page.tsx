"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function ChatDebugPage() {
  const { user, loading } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [wsUrl, setWsUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const t = localStorage.getItem("token");
      setToken(t);
      
      const baseUrl = process.env.NEXT_PUBLIC_RUST_BOT_URL!.replace("http", "ws");
      setWsUrl(t ? `${baseUrl}/ws?token=${t.substring(0, 20)}...` : `${baseUrl}/ws`);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-orange-500">Chat Debug Info</h1>
          <Button asChild variant="outline" className="border-gray-700">
            <Link href="/chat">← Back to Chat</Link>
          </Button>
        </div>

        <div className="space-y-4">
          {/* User Info */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                👤 User Info
                {loading && <Badge variant="outline">Loading...</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Authenticated:</span>
                <Badge variant={user ? "default" : "destructive"}>
                  {user ? "✅ Yes" : "❌ No"}
                </Badge>
              </div>
              {user && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email:</span>
                    <span>{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span>{user.name || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Role:</span>
                    <Badge>{user.role}</Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Token Info */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>🔑 JWT Token</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Token exists:</span>
                <Badge variant={token ? "default" : "destructive"}>
                  {token ? "✅ Yes" : "❌ No"}
                </Badge>
              </div>
              {token && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Token length:</span>
                    <span>{token.length} chars</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-2">Token preview:</span>
                    <code className="block bg-gray-900 p-3 rounded text-xs break-all">
                      {token.substring(0, 100)}...
                    </code>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* WebSocket Info */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>🔌 WebSocket Config</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="text-gray-400 block mb-2">Rust Bot URL:</span>
                <code className="block bg-gray-900 p-3 rounded text-xs">
                  {process.env.NEXT_PUBLIC_RUST_BOT_URL}
                </code>
              </div>
              <div>
                <span className="text-gray-400 block mb-2">WebSocket URL:</span>
                <code className="block bg-gray-900 p-3 rounded text-xs break-all">
                  {wsUrl}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {!user && (
            <Card className="bg-yellow-500/10 border-yellow-500/20">
              <CardContent className="pt-6">
                <p className="text-yellow-500 mb-4">
                  ⚠️ You need to login to use the chat
                </p>
                <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  <Link href="/auth/signin">Login Now</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
