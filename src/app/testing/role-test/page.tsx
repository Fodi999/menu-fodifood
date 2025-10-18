"use client";

import { useRole, useIsAdmin, useIsBusinessMode, useIsUser, useIsInvestor, useHasBusinessAccess, useHasAdminAccess } from "@/hooks/useRole";
import { UserRole } from "@/types/user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function RoleTestPage() {
  const { currentRole, switchRole, user } = useRole();
  const isAdmin = useIsAdmin();
  const isBusinessMode = useIsBusinessMode();
  const isUser = useIsUser();
  const isInvestor = useIsInvestor();
  const hasBusinessAccess = useHasBusinessAccess();
  const hasAdminAccess = useHasAdminAccess();

  const roles = [
    { value: UserRole.USER, label: "User", emoji: "👤", color: "bg-blue-500" },
    { value: UserRole.BUSINESS_OWNER, label: "Business Owner", emoji: "💼", color: "bg-green-500" },
    { value: UserRole.INVESTOR, label: "Investor", emoji: "💰", color: "bg-purple-500" },
    { value: UserRole.ADMIN, label: "Admin", emoji: "👑", color: "bg-red-500" },
  ];

  const handleRoleChange = async (role: UserRole) => {
    await switchRole(role);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">🎭 Role System Test</h1>
        <p className="text-muted-foreground">
          Тестирование системы ролей и хелперов
        </p>
      </div>

      {/* Current Role Display */}
      <Card className="border-2 border-primary">
        <CardHeader>
          <CardTitle>Current Role</CardTitle>
          <CardDescription>Текущая активная роль пользователя</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <span className="text-6xl">
              {roles.find(r => r.value === currentRole)?.emoji}
            </span>
            <div>
              <h2 className="text-2xl font-bold capitalize">{currentRole}</h2>
              {user && <p className="text-muted-foreground">{user.email}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Switch Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Switch Role</CardTitle>
          <CardDescription>
            Переключение между различными ролями (проверьте консоль)
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {roles.map((role) => (
            <Button
              key={role.value}
              onClick={() => handleRoleChange(role.value)}
              variant={currentRole === role.value ? "default" : "outline"}
              className="h-24 flex flex-col gap-2"
            >
              <span className="text-3xl">{role.emoji}</span>
              <span>{role.label}</span>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Hook Results */}
      <Card>
        <CardHeader>
          <CardTitle>Hook Results</CardTitle>
          <CardDescription>
            Результаты работы всех хелперов useRole
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <code className="text-sm">useIsUser()</code>
            <Badge variant={isUser ? "default" : "secondary"}>
              {isUser ? "✅ true" : "❌ false"}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <code className="text-sm">useIsBusinessMode()</code>
            <Badge variant={isBusinessMode ? "default" : "secondary"}>
              {isBusinessMode ? "✅ true" : "❌ false"}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <code className="text-sm">useIsInvestor()</code>
            <Badge variant={isInvestor ? "default" : "secondary"}>
              {isInvestor ? "✅ true" : "❌ false"}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <code className="text-sm">useIsAdmin()</code>
            <Badge variant={isAdmin ? "default" : "secondary"}>
              {isAdmin ? "✅ true" : "❌ false"}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <code className="text-sm">useHasBusinessAccess()</code>
            <Badge variant={hasBusinessAccess ? "default" : "secondary"}>
              {hasBusinessAccess ? "✅ true" : "❌ false"}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <code className="text-sm">useHasAdminAccess()</code>
            <Badge variant={hasAdminAccess ? "default" : "secondary"}>
              {hasAdminAccess ? "✅ true" : "❌ false"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Access Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Access Matrix</CardTitle>
          <CardDescription>
            Что доступно для текущей роли
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <AccessItem
            label="View Menu & Make Orders"
            granted={true}
            description="Доступно всем ролям"
          />
          
          <AccessItem
            label="Business Dashboard"
            granted={hasBusinessAccess}
            description="Только для business_owner и admin"
          />
          
          <AccessItem
            label="Investment Portfolio"
            granted={isInvestor || isAdmin}
            description="Только для investor и admin"
          />
          
          <AccessItem
            label="Admin Panel"
            granted={hasAdminAccess}
            description="Только для admin"
          />
        </CardContent>
      </Card>

      {/* Console Log Example */}
      <Card>
        <CardHeader>
          <CardTitle>📝 Console Log Example</CardTitle>
          <CardDescription>
            Откройте консоль браузера (F12) и переключите роли
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm space-y-1">
          <div>🔄 RoleContext: switchRole called</div>
          <div>📝 RoleContext: Setting current role to {currentRole}</div>
          <div>💾 RoleContext: Saved to localStorage and cookie</div>
          <div>🦀 RoleContext: Updating role in database...</div>
          <div>✅ RoleContext: Role updated in database successfully</div>
          <div className="text-yellow-400">
            {roles.find(r => r.value === currentRole)?.emoji} Current role: {currentRole}
          </div>
          <div>✅ UI Events system active</div>
        </CardContent>
      </Card>
    </div>
  );
}

interface AccessItemProps {
  label: string;
  granted: boolean;
  description: string;
}

function AccessItem({ label, granted, description }: AccessItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
      <Badge variant={granted ? "default" : "destructive"}>
        {granted ? "✅ Granted" : "🚫 Denied"}
      </Badge>
    </div>
  );
}
