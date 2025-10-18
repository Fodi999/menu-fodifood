/**
 * 🧪 Testing Dashboard
 * Страница для тестирования всех улучшений API и Providers
 */

import { ToasterDemo } from "@/components/ToasterDemo";

export default function TestingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-2">🧪 Testing Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Test all improvements: API fallbacks, Toaster system, Error Logger
        </p>

        <div className="grid gap-6">
          {/* Toaster Demo Section */}
          <section className="border rounded-lg p-6">
            <ToasterDemo />
          </section>

          {/* API Status Section */}
          <section className="border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">🔌 API Status</h2>
            <div className="space-y-2 text-sm">
              <p>✅ Mock API: Always available</p>
              <p>🔄 Rust Backend: Check console logs</p>
              <p>💾 Session Cache: Enabled</p>
              <p>⚡ Graceful Fallback: Active</p>
            </div>
          </section>

          {/* Error Logger Section */}
          <section className="border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">📝 Error Logger Commands</h2>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-2">
              <div>
                <code className="text-primary">window.errorLogger.getLogs()</code>
                <span className="text-muted-foreground ml-2">— View all logs</span>
              </div>
              <div>
                <code className="text-primary">window.errorLogger.downloadLogs()</code>
                <span className="text-muted-foreground ml-2">— Download logs as JSON</span>
              </div>
              <div>
                <code className="text-primary">window.errorLogger.clearLogs()</code>
                <span className="text-muted-foreground ml-2">— Clear all logs</span>
              </div>
            </div>
          </section>

          {/* Providers Info Section */}
          <section className="border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">🏗️ Active Providers</h2>
            <ul className="space-y-2">
              <li>✅ AuthProvider — User authentication</li>
              <li>✅ RoleProvider — Role-based access</li>
              <li>✅ BusinessProvider — Business context</li>
              <li>✅ I18nextProvider — Multi-language support</li>
              <li>✅ UI Events — Real-time updates</li>
              <li>✅ Toaster (Sonner) — Global notifications</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
