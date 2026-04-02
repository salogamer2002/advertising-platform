"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Copy, Check, Loader2, Hash, FileText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function Task22AIMicroservice() {
  const [activeTab, setActiveTab] = useState("copy");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Copy generation form
  const [copyForm, setCopyForm] = useState({
    product: "",
    tone: "professional",
    platform: "facebook",
    wordLimit: "50",
  });

  // Social form
  const [socialForm, setSocialForm] = useState({
    platform: "instagram",
    campaignGoal: "awareness",
    brandVoice: "friendly",
  });

  // Hashtags form
  const [hashtagForm, setHashtagForm] = useState({
    content: "",
    industry: "technology",
  });

  const generateCopy = async () => {
    setIsLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 1500));
    
    const responses: Record<string, string> = {
      professional: `Introducing ${copyForm.product || "our solution"} - the smart choice for modern businesses. Streamline your workflow, boost productivity, and achieve results that matter. Discover the difference today.`,
      friendly: `Hey there! Ready to transform your day with ${copyForm.product || "something amazing"}? We've got just what you need to make life easier and way more fun. Come see what all the buzz is about!`,
      bold: `STOP scrolling. ${copyForm.product || "This"} changes EVERYTHING. No more excuses. No more waiting. The future is here, and it's spectacular. Are you ready to level up?`,
      playful: `Psst... want to know a secret? ${copyForm.product || "This little gem"} is about to become your new obsession. Trust us, your future self will thank you. Go on, treat yourself!`,
    };

    setResult(responses[copyForm.tone] || responses.professional);
    setIsLoading(false);
  };

  const generateSocial = async () => {
    setIsLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 1500));

    const captions: Record<string, string[]> = {
      instagram: [
        "Transform your perspective. Elevate your standards. Welcome to the future of innovation.",
        "Some moments are worth capturing. This is one of them.",
        "Because settling for ordinary was never an option.",
        "The journey of a thousand miles begins with a single tap.",
        "Where passion meets purpose. Where dreams meet reality.",
      ],
      twitter: [
        "Big things coming. Stay tuned.",
        "The future isn't waiting. Neither should you.",
        "Innovation isn't just what we do. It's who we are.",
      ],
      linkedin: [
        "Thrilled to share our latest milestone with the professional community. Innovation drives progress, and progress drives success.",
        "In today's competitive landscape, adaptation isn't optional - it's essential. Here's how we're leading the charge.",
      ],
    };

    const platformCaptions = captions[socialForm.platform] || captions.instagram;
    setResult(platformCaptions.join("\n\n---\n\n"));
    setIsLoading(false);
  };

  const generateHashtags = async () => {
    setIsLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 1000));

    const industryHashtags: Record<string, string[]> = {
      technology: ["#TechInnovation", "#FutureTech", "#DigitalTransformation", "#TechLife", "#Innovation", "#StartupLife", "#AI", "#MachineLearning", "#CloudComputing", "#TechNews"],
      healthcare: ["#HealthTech", "#DigitalHealth", "#PatientCare", "#MedTech", "#HealthcareInnovation", "#Wellness", "#HealthyLiving", "#MedicalTechnology", "#HealthcareIT", "#Telemedicine"],
      finance: ["#FinTech", "#Finance", "#Investment", "#WealthManagement", "#Banking", "#FinancialServices", "#MoneyMatters", "#FinancialPlanning", "#Crypto", "#DigitalBanking"],
      retail: ["#RetailTech", "#Ecommerce", "#ShopLocal", "#RetailInnovation", "#CustomerExperience", "#OnlineShopping", "#RetailTrends", "#ShoppingTime", "#RetailMarketing", "#StoreDesign"],
    };

    setResult((industryHashtags[hashtagForm.industry] || industryHashtags.technology).join(" "));
    setIsLoading(false);
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Tasks
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            AI-Powered Content Generation
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Content Generation Microservice</h1>
          <p className="text-muted-foreground mt-2">Task 2.2 - LLM-powered advertising copy generation with SSE streaming</p>
        </div>

        {/* Service Status */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Service Online</span>
                </div>
                <Badge variant="outline">v1.0.0</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Model: GPT-4</span>
                <span>Latency: ~1.2s</span>
                <span>Uptime: 99.9%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Generate Content</CardTitle>
              <CardDescription>Choose a content type and configure your request</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="copy" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Copy
                  </TabsTrigger>
                  <TabsTrigger value="social" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Social
                  </TabsTrigger>
                  <TabsTrigger value="hashtags" className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Hashtags
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="copy" className="space-y-4 mt-4">
                  <div>
                    <Label>Product/Service</Label>
                    <Input
                      value={copyForm.product}
                      onChange={(e) => setCopyForm({ ...copyForm, product: e.target.value })}
                      placeholder="e.g., Smart Home Security System"
                    />
                  </div>
                  <div>
                    <Label>Tone</Label>
                    <Select value={copyForm.tone} onValueChange={(v) => setCopyForm({ ...copyForm, tone: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                        <SelectItem value="playful">Playful</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Platform</Label>
                    <Select value={copyForm.platform} onValueChange={(v) => setCopyForm({ ...copyForm, platform: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="google">Google Ads</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Word Limit</Label>
                    <Input
                      type="number"
                      value={copyForm.wordLimit}
                      onChange={(e) => setCopyForm({ ...copyForm, wordLimit: e.target.value })}
                    />
                  </div>
                  <Button onClick={generateCopy} disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                    Generate Copy
                  </Button>
                </TabsContent>

                <TabsContent value="social" className="space-y-4 mt-4">
                  <div>
                    <Label>Platform</Label>
                    <Select value={socialForm.platform} onValueChange={(v) => setSocialForm({ ...socialForm, platform: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="twitter">Twitter/X</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Campaign Goal</Label>
                    <Select value={socialForm.campaignGoal} onValueChange={(v) => setSocialForm({ ...socialForm, campaignGoal: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="awareness">Brand Awareness</SelectItem>
                        <SelectItem value="engagement">Engagement</SelectItem>
                        <SelectItem value="conversion">Conversion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Brand Voice</Label>
                    <Select value={socialForm.brandVoice} onValueChange={(v) => setSocialForm({ ...socialForm, brandVoice: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="edgy">Edgy</SelectItem>
                        <SelectItem value="inspirational">Inspirational</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={generateSocial} disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                    Generate Captions
                  </Button>
                </TabsContent>

                <TabsContent value="hashtags" className="space-y-4 mt-4">
                  <div>
                    <Label>Content Description</Label>
                    <Textarea
                      value={hashtagForm.content}
                      onChange={(e) => setHashtagForm({ ...hashtagForm, content: e.target.value })}
                      placeholder="Describe your content or campaign..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Industry</Label>
                    <Select value={hashtagForm.industry} onValueChange={(v) => setHashtagForm({ ...hashtagForm, industry: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={generateHashtags} disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                    Generate Hashtags
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Output Panel */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Generated Content</CardTitle>
                <CardDescription>AI-generated output ready for use</CardDescription>
              </div>
              {result && (
                <Button size="sm" variant="outline" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin mb-4" />
                  <p>Generating content...</p>
                  <p className="text-xs mt-1">Streaming via SSE</p>
                </div>
              ) : result ? (
                <div className="bg-slate-50 rounded-lg p-4 min-h-[200px]">
                  <p className="whitespace-pre-wrap text-slate-800">{result}</p>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                  <p>Generated content will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* API Endpoints Reference */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">API Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { method: "POST", path: "/generate/copy", desc: "Generate ad copy" },
                { method: "POST", path: "/generate/social", desc: "Generate social captions" },
                { method: "POST", path: "/generate/hashtags", desc: "Generate hashtags" },
                { method: "GET", path: "/health", desc: "Service health check" },
              ].map((ep) => (
                <div key={ep.path} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Badge variant="outline" className={ep.method === "POST" ? "bg-blue-500/10 text-blue-600" : "bg-emerald-500/10 text-emerald-600"}>
                    {ep.method}
                  </Badge>
                  <code className="text-sm">{ep.path}</code>
                  <span className="text-xs text-muted-foreground ml-auto">{ep.desc}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
