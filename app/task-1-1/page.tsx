"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, MousePointer, TrendingUp, CheckCircle, DollarSign, BarChart3, Sun, Moon, Settings, Users, LayoutDashboard, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { campaigns, clients, metrics } from "@/lib/mockData";

export default function Task11Dashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedClient, setSelectedClient] = useState("all");
  const [dateRange, setDateRange] = useState("30");
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({ key: "spend", direction: "desc" });

  const filteredCampaigns = useMemo(() => {
    if (selectedClient === "all") return campaigns;
    return campaigns.filter((c) => c.client_id === selectedClient);
  }, [selectedClient]);

  const kpis = useMemo(() => {
    const totals = filteredCampaigns.reduce(
      (acc, campaign) => ({
        impressions: acc.impressions + campaign.impressions,
        clicks: acc.clicks + campaign.clicks,
        conversions: acc.conversions + campaign.conversions,
        spend: acc.spend + campaign.spend,
      }),
      { impressions: 0, clicks: 0, conversions: 0, spend: 0 }
    );

    const ctr = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0;
    const roas = totals.spend > 0 ? (totals.conversions * 100) / totals.spend : 0;

    return { ...totals, ctr, roas };
  }, [filteredCampaigns]);

  const sortedCampaigns = useMemo(() => {
    const sorted = [...filteredCampaigns].sort((a, b) => {
      let aVal: number = a[sortConfig.key as keyof typeof a] as number;
      let bVal: number = b[sortConfig.key as keyof typeof b] as number;

      if (sortConfig.key === "ctr") {
        aVal = a.impressions > 0 ? a.clicks / a.impressions : 0;
        bVal = b.impressions > 0 ? b.clicks / b.impressions : 0;
      } else if (sortConfig.key === "roas") {
        aVal = a.spend > 0 ? a.conversions / a.spend : 0;
        bVal = b.spend > 0 ? b.conversions / b.spend : 0;
      }

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredCampaigns, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
      case "paused": return "bg-amber-500/10 text-amber-600 border-amber-200";
      case "completed": return "bg-slate-500/10 text-slate-600 border-slate-200";
      case "draft": return "bg-sky-500/10 text-sky-600 border-sky-200";
      default: return "bg-slate-500/10 text-slate-600 border-slate-200";
    }
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-slate-950" : "bg-slate-50"}`}>
      <div className="flex">
        {/* Sidebar */}
        <aside className={`w-64 min-h-screen p-4 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} border-r`}>
          <div className="mb-8">
            <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Tasks
            </Link>
            <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>AdAgency</h2>
            <p className="text-sm text-muted-foreground">Campaign Dashboard</p>
          </div>

          <nav className="space-y-2">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "clients", label: "Clients", icon: Users },
              { id: "campaigns", label: "Campaigns", icon: BarChart3 },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeNav === item.id
                    ? darkMode ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-900"
                    : darkMode ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
            <p className="text-xs text-muted-foreground mb-2">Clients</p>
            {clients.map((client) => (
              <button
                key={client.id}
                onClick={() => setSelectedClient(client.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedClient === client.id
                    ? darkMode ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-900"
                    : darkMode ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {client.name}
              </button>
            ))}
            <button
              onClick={() => setSelectedClient("all")}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedClient === "all"
                  ? darkMode ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-900"
                  : darkMode ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Clients
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Campaign Dashboard</h1>
              <p className="text-muted-foreground">Overview of all advertising campaigns</p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            {[
              { title: "Impressions", value: formatNumber(kpis.impressions), change: 12.5, icon: Eye, color: "text-blue-500" },
              { title: "Clicks", value: formatNumber(kpis.clicks), change: 8.3, icon: MousePointer, color: "text-emerald-500" },
              { title: "CTR", value: `${kpis.ctr.toFixed(2)}%`, change: -2.1, icon: TrendingUp, color: "text-amber-500" },
              { title: "Conversions", value: formatNumber(kpis.conversions), change: 15.7, icon: CheckCircle, color: "text-emerald-500" },
              { title: "Spend", value: formatCurrency(kpis.spend), change: 5.2, icon: DollarSign, color: "text-amber-500" },
              { title: "ROAS", value: `${kpis.roas.toFixed(2)}x`, change: 7.8, icon: BarChart3, color: "text-blue-500" },
            ].map((kpi) => (
              <Card key={kpi.title} className={darkMode ? "bg-slate-900 border-slate-800" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{kpi.title}</span>
                    <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                  </div>
                  <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>{kpi.value}</p>
                  <p className={`text-xs ${kpi.change >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                    {kpi.change >= 0 ? "+" : ""}{kpi.change}% from last period
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Performance Chart */}
          <Card className={`mb-8 ${darkMode ? "bg-slate-900 border-slate-800" : ""}`}>
            <CardHeader>
              <CardTitle className={darkMode ? "text-white" : ""}>30-Day Performance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={metrics.slice(-parseInt(dateRange))}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#e2e8f0"} />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: darkMode ? "#94a3b8" : "#64748b" }} tickFormatter={(v) => v.split("-").slice(1).join("/")} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12, fill: darkMode ? "#94a3b8" : "#64748b" }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: darkMode ? "#94a3b8" : "#64748b" }} />
                  <Tooltip contentStyle={{ backgroundColor: darkMode ? "#1e293b" : "#fff", border: "none", borderRadius: "8px" }} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="impressions" stroke="#3b82f6" strokeWidth={2} dot={false} name="Impressions" />
                  <Line yAxisId="left" type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={2} dot={false} name="Clicks" />
                  <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#f59e0b" strokeWidth={2} dot={false} name="Conversions" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Campaign Table */}
          <Card className={darkMode ? "bg-slate-900 border-slate-800" : ""}>
            <CardHeader>
              <CardTitle className={darkMode ? "text-white" : ""}>All Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className={darkMode ? "border-slate-800" : ""}>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                      <div className="flex items-center gap-1">Campaign <SortIcon column="name" /></div>
                    </TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="cursor-pointer text-right" onClick={() => handleSort("impressions")}>
                      <div className="flex items-center justify-end gap-1">Impressions <SortIcon column="impressions" /></div>
                    </TableHead>
                    <TableHead className="cursor-pointer text-right" onClick={() => handleSort("clicks")}>
                      <div className="flex items-center justify-end gap-1">Clicks <SortIcon column="clicks" /></div>
                    </TableHead>
                    <TableHead className="cursor-pointer text-right" onClick={() => handleSort("ctr")}>
                      <div className="flex items-center justify-end gap-1">CTR <SortIcon column="ctr" /></div>
                    </TableHead>
                    <TableHead className="cursor-pointer text-right" onClick={() => handleSort("conversions")}>
                      <div className="flex items-center justify-end gap-1">Conversions <SortIcon column="conversions" /></div>
                    </TableHead>
                    <TableHead className="cursor-pointer text-right" onClick={() => handleSort("spend")}>
                      <div className="flex items-center justify-end gap-1">Spend <SortIcon column="spend" /></div>
                    </TableHead>
                    <TableHead className="cursor-pointer text-right" onClick={() => handleSort("roas")}>
                      <div className="flex items-center justify-end gap-1">ROAS <SortIcon column="roas" /></div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCampaigns.map((campaign) => (
                    <TableRow key={campaign.id} className={darkMode ? "border-slate-800" : ""}>
                      <TableCell className={`font-medium ${darkMode ? "text-white" : ""}`}>{campaign.name}</TableCell>
                      <TableCell className="text-muted-foreground">{campaign.client_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{formatNumber(campaign.impressions)}</TableCell>
                      <TableCell className="text-right">{formatNumber(campaign.clicks)}</TableCell>
                      <TableCell className="text-right">{campaign.impressions > 0 ? ((campaign.clicks / campaign.impressions) * 100).toFixed(2) : 0}%</TableCell>
                      <TableCell className="text-right">{formatNumber(campaign.conversions)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(campaign.spend)}</TableCell>
                      <TableCell className="text-right">{campaign.spend > 0 ? ((campaign.conversions * 100) / campaign.spend).toFixed(2) : 0}x</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
