"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, BellRing, Settings, X, AlertTriangle, TrendingDown, DollarSign, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Notification {
  id: string;
  type: "ctr_low" | "budget_exceeded" | "campaign_ended" | "performance_alert";
  title: string;
  message: string;
  campaign: string;
  timestamp: Date;
  read: boolean;
  severity: "warning" | "error" | "info" | "success";
}

interface Threshold {
  id: string;
  campaignId: string;
  campaignName: string;
  ctrMin: number;
  budgetMax: number;
  enabled: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "ctr_low",
    title: "CTR Below Threshold",
    message: "CTR dropped to 0.8% (threshold: 1%)",
    campaign: "Summer Product Launch",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
    severity: "warning",
  },
  {
    id: "n2",
    type: "budget_exceeded",
    title: "Budget Limit Reached",
    message: "Campaign has spent 90% of allocated budget",
    campaign: "Black Friday Campaign",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    severity: "error",
  },
  {
    id: "n3",
    type: "performance_alert",
    title: "Performance Improvement",
    message: "Conversions increased by 25% in the last 24h",
    campaign: "Wellness Initiative",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true,
    severity: "success",
  },
  {
    id: "n4",
    type: "campaign_ended",
    title: "Campaign Completed",
    message: "Campaign has reached its end date",
    campaign: "Holiday Special",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
    severity: "info",
  },
];

const MOCK_THRESHOLDS: Threshold[] = [
  { id: "t1", campaignId: "camp1", campaignName: "Summer Product Launch", ctrMin: 1.0, budgetMax: 90, enabled: true },
  { id: "t2", campaignId: "camp2", campaignName: "Black Friday Campaign", ctrMin: 1.5, budgetMax: 85, enabled: true },
  { id: "t3", campaignId: "camp5", campaignName: "Wellness Initiative", ctrMin: 0.8, budgetMax: 95, enabled: false },
];

export default function Task23Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [thresholds, setThresholds] = useState<Threshold[]>(MOCK_THRESHOLDS);
  const [isConnected, setIsConnected] = useState(true);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState("");

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Simulate WebSocket connection and real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newNotification: Notification = {
          id: `n${Date.now()}`,
          type: Math.random() > 0.5 ? "ctr_low" : "budget_exceeded",
          title: Math.random() > 0.5 ? "CTR Alert" : "Budget Alert",
          message: Math.random() > 0.5 ? "CTR dropped below threshold" : "Budget spend rate is high",
          campaign: ["Summer Product Launch", "Black Friday Campaign", "Wellness Initiative"][Math.floor(Math.random() * 3)],
          timestamp: new Date(),
          read: false,
          severity: Math.random() > 0.5 ? "warning" : "error",
        };
        setNotifications((prev) => [newNotification, ...prev].slice(0, 20));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const toggleThreshold = (id: string) => {
    setThresholds((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "ctr_low": return TrendingDown;
      case "budget_exceeded": return DollarSign;
      case "performance_alert": return CheckCircle;
      default: return AlertTriangle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error": return "bg-red-500/10 text-red-600 border-red-200";
      case "warning": return "bg-amber-500/10 text-amber-600 border-amber-200";
      case "success": return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
      default: return "bg-blue-500/10 text-blue-600 border-blue-200";
    }
  };

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation with Notification Bell */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <div className="h-6 w-px bg-slate-200" />
            <h1 className="font-semibold text-slate-900">Real-Time Notifications</h1>
            <Badge variant="outline" className={isConnected ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"}>
              <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
              {isConnected ? "WebSocket Connected" : "Disconnected"}
            </Badge>
          </div>

          {/* Notification Bell Dropdown */}
          <DropdownMenu open={showNotificationPanel} onOpenChange={setShowNotificationPanel}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                {unreadCount > 0 ? <BellRing className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96 p-0">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    Mark all read
                  </Button>
                )}
              </div>
              <ScrollArea className="h-96">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  <div className="divide-y">
                    {notifications.map((notification) => {
                      const Icon = getIcon(notification.type);
                      return (
                        <div
                          key={notification.id}
                          className={`p-4 hover:bg-slate-50 transition-colors ${!notification.read ? "bg-blue-50/50" : ""}`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex gap-3">
                            <div className={`p-2 rounded-lg ${getSeverityColor(notification.severity)}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className="font-medium text-sm text-slate-900">{notification.title}</p>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 shrink-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                              <p className="text-sm text-muted-foreground">{notification.message}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-muted-foreground">{notification.campaign}</span>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">{formatTime(notification.timestamp)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Notification System</h2>
          <p className="text-muted-foreground">Task 2.3 - WebSocket-based real-time alerts with configurable thresholds</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Threshold Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Alert Thresholds
              </CardTitle>
              <CardDescription>Configure alert rules per campaign</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {thresholds.map((threshold) => (
                  <div key={threshold.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium text-slate-900">{threshold.campaignName}</p>
                        <p className="text-xs text-muted-foreground">Campaign ID: {threshold.campaignId}</p>
                      </div>
                      <Switch
                        checked={threshold.enabled}
                        onCheckedChange={() => toggleThreshold(threshold.id)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Min CTR (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={threshold.ctrMin}
                          disabled={!threshold.enabled}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Budget Alert (%)</Label>
                        <Input
                          type="number"
                          value={threshold.budgetMax}
                          disabled={!threshold.enabled}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t">
                  <Label>Add New Threshold</Label>
                  <div className="flex gap-2 mt-2">
                    <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select campaign" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="camp3">Q4 Brand Awareness</SelectItem>
                        <SelectItem value="camp4">Holiday Special</SelectItem>
                        <SelectItem value="camp6">Spring Collection</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button disabled={!selectedCampaign}>Add</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Alerts History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Alert History
              </CardTitle>
              <CardDescription>Recent notifications stored in PostgreSQL</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {notifications.map((notification) => {
                    const Icon = getIcon(notification.type);
                    return (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg border ${!notification.read ? "border-blue-200 bg-blue-50/30" : "border-slate-200"}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-1.5 rounded ${getSeverityColor(notification.severity)}`}>
                            <Icon className="h-3 w-3" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-slate-900">{notification.title}</p>
                              <Badge variant="outline" className={getSeverityColor(notification.severity)}>
                                {notification.severity}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{notification.message}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <span>{notification.campaign}</span>
                              <span>•</span>
                              <span>{formatTime(notification.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* WebSocket Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">WebSocket Implementation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Server</h4>
                <p className="text-sm text-muted-foreground">Native WebSocket (ws) library with connection pooling and heartbeat ping/pong</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Alert Engine</h4>
                <p className="text-sm text-muted-foreground">Threshold monitoring runs every 60s, checking campaign metrics against configured rules</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Persistence</h4>
                <p className="text-sm text-muted-foreground">All alerts stored in PostgreSQL notifications table with campaign_id foreign key</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
