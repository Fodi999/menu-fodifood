"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Users, ArrowLeft, Loader2, Mail, Shield, Calendar, Trash2, UserCircle, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export default function AdminUsersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/auth/signin?callbackUrl=/admin/users");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      console.log("📊 Users data:", data);
      // Go API возвращает массив напрямую, не в объекте
      const usersList = Array.isArray(data) ? data : [];
      setUsers(usersList);
      setFilteredUsers(usersList);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Не удалось загрузить пользователей");
    } finally {
      setLoading(false);
    }
  };

  // Поиск пользователей
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(
          (u) =>
            u.name?.toLowerCase().includes(query) ||
            u.email.toLowerCase().includes(query) ||
            u.role.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, users]);

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Вы уверены, что хотите удалить пользователя ${userEmail}?`)) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // Обновляем список пользователей
      setUsers(users.filter((u) => u.id !== userId));
      alert(`Пользователь ${userEmail} успешно удалён`);
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Не удалось удалить пользователя");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950/20 flex items-center justify-center">
        <Card className="w-64 bg-gray-900/50 border-gray-800">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
              <p className="text-gray-400">Загрузка...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  // Функция для получения инициалов
  const getInitials = (name: string | null, email: string) => {
    if (name && name.trim()) {
      return name.trim().slice(0, 2).toUpperCase();
    }
    return email.slice(0, 2).toUpperCase();
  };

  // Цвета для ролей
  const roleColors = {
    admin: "bg-red-500/10 text-red-500 border-red-500/20",
    user: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950/20 py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-blue-500/10 backdrop-blur-xl">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Управление пользователями
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                Всего: {users.length} {filteredUsers.length !== users.length && `• Найдено: ${filteredUsers.length}`}
              </p>
            </div>
          </div>
          <Button 
            asChild 
            variant="outline" 
            size="sm"
            className="border-blue-500/30 bg-gray-900/50 text-white hover:bg-blue-500/10 hover:text-blue-500 backdrop-blur-xl transition-colors"
          >
            <Link href="/admin">
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              <span className="text-xs sm:text-sm">Назад</span>
            </Link>
          </Button>
        </div>

        {/* Search Bar */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Поиск по имени, email или роли..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 sm:pl-12 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-blue-500 text-sm sm:text-base"
              />
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="bg-red-500/10 border-red-500/50 mb-6">
            <CardContent className="p-4">
              <p className="text-red-500 text-sm sm:text-base">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Users List */}
        {filteredUsers.length === 0 ? (
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl">
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-800/50 mb-4">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600" />
              </div>
              <p className="text-gray-400 text-base sm:text-lg">
                {searchQuery ? "Пользователи не найдены" : "Пользователей пока нет"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Mobile: Card View */}
            <div className="block lg:hidden space-y-3 sm:space-y-4">
              {filteredUsers.map((u) => (
                <Card key={u.id} className="bg-gray-900/50 border-gray-800 backdrop-blur-xl hover:bg-gray-800/60 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="h-12 w-12 border-2 border-blue-500/30">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm font-bold">
                          {getInitials(u.name, u.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-base truncate">
                          {u.name || "Без имени"}
                        </h3>
                        <p className="text-sm text-gray-400 truncate flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" />
                          {u.email}
                        </p>
                      </div>
                      <Badge className={`text-xs ${roleColors[u.role as keyof typeof roleColors] || roleColors.user}`}>
                        {u.role}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <UserCircle className="w-3.5 h-3.5" />
                        <span className="truncate font-mono">{u.id.slice(0, 8)}...</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="truncate">
                          {new Date(u.createdAt).toLocaleDateString("ru-RU", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleDeleteUser(u.id, u.email)}
                      disabled={u.role === "admin"}
                      variant="destructive"
                      size="sm"
                      className="w-full text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                      {u.role === "admin" ? "Нельзя удалить админа" : "Удалить пользователя"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Desktop: Table View */}
            <Card className="hidden lg:block bg-gray-900/50 border-gray-800 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-white">Список пользователей</CardTitle>
                <CardDescription>
                  Управление аккаунтами пользователей системы
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700 hover:bg-gray-800/50">
                        <TableHead className="text-gray-400">Пользователь</TableHead>
                        <TableHead className="text-gray-400">Email</TableHead>
                        <TableHead className="text-gray-400">Роль</TableHead>
                        <TableHead className="text-gray-400">ID</TableHead>
                        <TableHead className="text-gray-400">Регистрация</TableHead>
                        <TableHead className="text-gray-400 text-center">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((u) => (
                        <TableRow key={u.id} className="border-gray-700 hover:bg-gray-800/50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border-2 border-blue-500/30">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm font-bold">
                                  {getInitials(u.name, u.email)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-white">
                                  {u.name || "Без имени"}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-gray-300">
                              <Mail className="w-4 h-4 text-gray-500" />
                              {u.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={roleColors[u.role as keyof typeof roleColors] || roleColors.user}>
                              <Shield className="w-3 h-3 mr-1" />
                              {u.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm text-gray-400">
                            {u.id.slice(0, 8)}...
                          </TableCell>
                          <TableCell className="text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              {new Date(u.createdAt).toLocaleDateString("ru-RU", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center">
                              <Button
                                onClick={() => handleDeleteUser(u.id, u.email)}
                                disabled={u.role === "admin"}
                                variant="destructive"
                                size="sm"
                                className="text-xs"
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                                Удалить
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
