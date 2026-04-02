"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Copy, Check, Server, Database, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const API_ENDPOINTS = [
  {
    method: "GET",
    path: "/campaigns",
    description: "List all campaigns with filter/sort/pagination",
    params: "?page=1&limit=10&status=active&sort=spend&order=desc",
    response: `{
  "data": [
    {
      "id": "camp1",
      "name": "Summer Product Launch",
      "client_name": "Acme Corp",
      "status": "active",
      "budget": 50000,
      "spend": 32450,
      "impressions": 2400000,
      "clicks": 48000,
      "conversions": 1920
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 6,
    "pages": 1
  }
}`,
  },
  {
    method: "POST",
    path: "/campaigns",
    description: "Create new campaign (validates all fields)",
    body: `{
  "name": "New Campaign",
  "client_id": "c1",
  "budget": 25000,
  "start_date": "2024-01-01",
  "end_date": "2024-03-31"
}`,
    response: `{
  "id": "camp7",
  "name": "New Campaign",
  "client_id": "c1",
  "status": "draft",
  "budget": 25000,
  "spend": 0,
  "created_at": "2024-01-01T00:00:00Z"
}`,
  },
  {
    method: "GET",
    path: "/campaigns/:id",
    description: "Get single campaign with full metrics",
    response: `{
  "id": "camp1",
  "name": "Summer Product Launch",
  "client_id": "c1",
  "client_name": "Acme Corp",
  "status": "active",
  "budget": 50000,
  "spend": 32450,
  "impressions": 2400000,
  "clicks": 48000,
  "conversions": 1920,
  "ctr": 2.0,
  "roas": 5.92,
  "start_date": "2024-06-01",
  "end_date": "2024-08-31",
  "created_at": "2024-05-15T10:00:00Z",
  "updated_at": "2024-07-20T15:30:00Z"
}`,
  },
  {
    method: "PUT",
    path: "/campaigns/:id",
    description: "Update campaign",
    body: `{
  "name": "Updated Campaign Name",
  "budget": 60000
}`,
    response: `{
  "id": "camp1",
  "name": "Updated Campaign Name",
  "budget": 60000,
  "updated_at": "2024-07-21T10:00:00Z"
}`,
  },
  {
    method: "DELETE",
    path: "/campaigns/:id",
    description: "Soft delete (sets deleted_at timestamp)",
    response: `{
  "message": "Campaign deleted successfully",
  "deleted_at": "2024-07-21T10:00:00Z"
}`,
  },
  {
    method: "POST",
    path: "/auth/login",
    description: "JWT authentication",
    body: `{
  "email": "user@example.com",
  "password": "password123"
}`,
    response: `{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "u1",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "expires_in": 86400
}`,
  },
];

const FEATURES = [
  { icon: Database, title: "PostgreSQL", description: "Schema with campaigns, clients, users, notifications tables" },
  { icon: Shield, title: "JWT Auth", description: "Secure authentication protecting all campaign endpoints" },
  { icon: Zap, title: "Rate Limiting", description: "Max 100 requests/minute per IP" },
  { icon: Server, title: "Validation", description: "Joi schemas for input validation with descriptive errors" },
];

export default function Task21APIDemo() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeEndpoint, setActiveEndpoint] = useState(0);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET": return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
      case "POST": return "bg-blue-500/10 text-blue-600 border-blue-200";
      case "PUT": return "bg-amber-500/10 text-amber-600 border-amber-200";
      case "DELETE": return "bg-red-500/10 text-red-600 border-red-200";
      default: return "bg-slate-500/10 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Tasks
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Campaign Management REST API</h1>
          <p className="text-muted-foreground mt-2">Task 2.1 - Full CRUD operations with JWT auth, validation, and rate limiting</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {FEATURES.map((feature) => (
            <Card key={feature.title}>
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <feature.icon className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Endpoints List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">API Endpoints</CardTitle>
                <CardDescription>Click to view details</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {API_ENDPOINTS.map((endpoint, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveEndpoint(idx)}
                      className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${activeEndpoint === idx ? "bg-slate-50" : ""}`}
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getMethodColor(endpoint.method)}>{endpoint.method}</Badge>
                        <code className="text-sm text-slate-700">{endpoint.path}</code>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{endpoint.description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Endpoint Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className={getMethodColor(API_ENDPOINTS[activeEndpoint].method)}>
                      {API_ENDPOINTS[activeEndpoint].method}
                    </Badge>
                    <code className="text-lg font-mono">{API_ENDPOINTS[activeEndpoint].path}</code>
                  </div>
                  <CardDescription>{API_ENDPOINTS[activeEndpoint].description}</CardDescription>
                </div>
                <Button size="sm" variant="outline">
                  <Play className="h-4 w-4 mr-2" />
                  Try It
                </Button>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="response">
                  <TabsList>
                    {API_ENDPOINTS[activeEndpoint].body && <TabsTrigger value="request">Request Body</TabsTrigger>}
                    {API_ENDPOINTS[activeEndpoint].params && <TabsTrigger value="params">Query Params</TabsTrigger>}
                    <TabsTrigger value="response">Response</TabsTrigger>
                  </TabsList>

                  {API_ENDPOINTS[activeEndpoint].body && (
                    <TabsContent value="request">
                      <div className="relative">
                        <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{API_ENDPOINTS[activeEndpoint].body}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2 text-slate-400 hover:text-white"
                          onClick={() => copyToClipboard(API_ENDPOINTS[activeEndpoint].body || "", activeEndpoint)}
                        >
                          {copiedIndex === activeEndpoint ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TabsContent>
                  )}

                  {API_ENDPOINTS[activeEndpoint].params && (
                    <TabsContent value="params">
                      <div className="bg-slate-100 p-4 rounded-lg">
                        <code className="text-sm text-slate-700">{API_ENDPOINTS[activeEndpoint].params}</code>
                      </div>
                    </TabsContent>
                  )}

                  <TabsContent value="response">
                    <div className="relative">
                      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{API_ENDPOINTS[activeEndpoint].response}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-slate-400 hover:text-white"
                        onClick={() => copyToClipboard(API_ENDPOINTS[activeEndpoint].response, activeEndpoint + 100)}
                      >
                        {copiedIndex === activeEndpoint + 100 ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* OpenAPI Spec */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">OpenAPI Specification</CardTitle>
                <CardDescription>Download the full API spec for Postman or other tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button variant="outline">
                    Download YAML
                  </Button>
                  <Button variant="outline">
                    View in Swagger UI
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
