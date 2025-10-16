"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { signUpSchema, type SignUpInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpInput) => {
    setIsLoading(true);
    setApiError("");

    try {
      await signup(data.email, data.password, data.name);
      
      // Редирект на профиль после успешной регистрации
      router.push("/profile");
    } catch (error: any) {
      console.error("❌ Signup error:", error);
      setApiError(error.message || "Ошибка при регистрации");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#090909] via-[#0d0d0d] to-[#1a1a1a] flex items-center justify-center px-4 py-12">
      {/* Background noise texture */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-30 pointer-events-none" />
      
      <div className="max-w-md w-full relative z-10">
        {/* Card */}
        <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] shadow-2xl p-8 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8 space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 mb-4 shadow-lg shadow-orange-500/30">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Создать аккаунт
            </h1>
            <p className="text-gray-400 text-sm">
              Присоединяйтесь к FODI уже сегодня
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* API Error */}
            {apiError && (
              <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 border-l-4 border-red-500 text-red-300 px-4 py-3 rounded-r-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{apiError}</p>
              </div>
            )}

            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300 font-medium">
                Имя
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Иван Иванов"
                {...register("name")}
                className="bg-[#0f0f0f] border-gray-800 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/30 text-white placeholder:text-gray-600 h-11"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-red-400 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...register("email")}
                className="bg-[#0f0f0f] border-gray-800 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/30 text-white placeholder:text-gray-600 h-11"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-400 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 font-medium">
                Пароль
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="bg-[#0f0f0f] border-gray-800 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/30 text-white placeholder:text-gray-600 h-11"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-red-400 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300 font-medium">
                Подтвердите пароль
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
                className="bg-[#0f0f0f] border-gray-800 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/30 text-white placeholder:text-gray-600 h-11"
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Password requirements */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 space-y-1.5">
              <p className="text-xs text-gray-400 font-medium mb-2">Требования к паролю:</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <CheckCircle2 className="w-3 h-3 text-gray-600" />
                <span>Минимум 6 символов</span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-semibold h-11 shadow-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Создание аккаунта...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Создать аккаунт
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] px-2 text-gray-500">
                Уже есть аккаунт?
              </span>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <Link
              href="/auth/signin"
              className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
            >
              Войти <span className="text-orange-400">→</span>
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
          >
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
}
