/**
 * 🎨 Toaster Demo Component
 * Демонстрирует все возможности системы уведомлений
 */

"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export function ToasterDemo() {
  // ✅ Success Toast
  const showSuccess = () => {
    toast.success("Order #123 created successfully!", {
      description: "Your order has been placed and is being prepared.",
      duration: 3000,
    });
  };

  // ❌ Error Toast
  const showError = () => {
    toast.error("Failed to load products", {
      description: "Please check your internet connection and try again.",
      duration: 5000,
    });
  };

  // ⚠️ Warning Toast
  const showWarning = () => {
    toast.warning("Connection unstable", {
      description: "Using offline mode with cached data.",
      duration: 4000,
    });
  };

  // 💡 Info Toast
  const showInfo = () => {
    toast.info("New order received!", {
      description: "Table 5 has placed an order for 3 items.",
      duration: 3000,
    });
  };

  // 🎉 Promise Toast (with loading)
  const showPromise = () => {
    const orderPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve({ id: "123" });
        } else {
          reject("API Error");
        }
      }, 2000);
    });

    toast.promise(orderPromise, {
      loading: "Creating order...",
      success: "Order created successfully!",
      error: "Failed to create order",
    });
  };

  // 🔄 Action Toast (with buttons)
  const showAction = () => {
    toast("New order received", {
      description: "Order #456 from Table 8",
      action: {
        label: "View",
        onClick: () => console.log("Viewing order #456"),
      },
      cancel: {
        label: "Dismiss",
        onClick: () => console.log("Dismissed"),
      },
    });
  };

  // 🌐 Custom Duration
  const showCustom = () => {
    toast("Custom notification", {
      description: "This will stay for 10 seconds",
      duration: 10000,
    });
  };

  // 🔔 Multiple Toasts (stress test)
  const showMultiple = () => {
    toast.success("First notification");
    setTimeout(() => toast.info("Second notification"), 500);
    setTimeout(() => toast.warning("Third notification"), 1000);
    setTimeout(() => toast.error("Fourth notification (should queue)"), 1500);
  };

  // 🧪 Test Error Logger
  const testErrorLogger = () => {
    try {
      throw new Error("Test error for error logger");
    } catch (error) {
      if (typeof window !== "undefined" && (window as any).errorLogger) {
        (window as any).errorLogger.logError(error);
        toast.success("Error logged! Check console: window.errorLogger.getLogs()");
      } else {
        toast.error("Error logger not available");
      }
    }
  };

  // 🚀 Test API with Toast
  const testAPI = async () => {
    const apiPromise = api.get("/products");
    
    toast.promise(apiPromise, {
      loading: "Loading products...",
      success: (data: any) => `Loaded ${data.length} products`,
      error: "Failed to load products",
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold mb-4">🎨 Toaster Demo</h2>
      
      <div className="grid grid-cols-2 gap-3">
        <Button onClick={showSuccess} variant="default">
          ✅ Success Toast
        </Button>
        
        <Button onClick={showError} variant="destructive">
          ❌ Error Toast
        </Button>
        
        <Button onClick={showWarning} variant="secondary">
          ⚠️ Warning Toast
        </Button>
        
        <Button onClick={showInfo} variant="outline">
          💡 Info Toast
        </Button>
        
        <Button onClick={showPromise} variant="default">
          🎉 Promise Toast
        </Button>
        
        <Button onClick={showAction} variant="secondary">
          🔄 Action Toast
        </Button>
        
        <Button onClick={showCustom} variant="outline">
          ⏱️ Custom Duration
        </Button>
        
        <Button onClick={showMultiple} variant="destructive">
          🔔 Multiple Toasts
        </Button>
        
        <Button onClick={testErrorLogger} variant="secondary">
          🧪 Test Error Logger
        </Button>
        
        <Button onClick={testAPI} variant="default">
          🚀 Test API + Toast
        </Button>
      </div>

      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">💡 Tips:</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>Maximum 3 toasts visible at once (others queue automatically)</li>
          <li>Dark theme matches your app design</li>
          <li>Rich colors for better visual feedback</li>
          <li>Open DevTools and try: <code>window.errorLogger.getLogs()</code></li>
        </ul>
      </div>
    </div>
  );
}
