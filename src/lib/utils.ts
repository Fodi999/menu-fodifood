import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the API base URL for Rust backend
 * @returns {string} API base URL (e.g., "http://127.0.0.1:8000/api/v1")
 */
export function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
}

/**
 * Get the WebSocket URL for Rust backend
 * @returns {string} WebSocket URL (e.g., "ws://127.0.0.1:8000/api/v1/admin/ws")
 */
export function getWsUrl(): string {
  return process.env.NEXT_PUBLIC_WS_URL || "ws://127.0.0.1:8000/api/v1/admin/ws";
}
