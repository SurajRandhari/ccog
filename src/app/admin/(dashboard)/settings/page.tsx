"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Save, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  User, 
  Clock, 
  Plus, 
  Trash2,
  Facebook,
  Youtube,
  Instagram,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SiteSettingsPage() {
  const [loading, setLoading] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: Connect to API
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-neutral-900">Site Settings</h1>
          <p className="mt-1 text-neutral-500">Manage your church&apos;s public information and preferences.</p>
        </div>
        <Button onClick={handleSave} disabled={loading} className="rounded-xl gap-2 shadow-lg shadow-neutral-200">
          <Save className="h-4 w-4" />
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-white border border-neutral-200 p-1 h-auto rounded-2xl flex-wrap justify-start gap-1">
          <TabsTrigger value="general" className="rounded-xl px-4 py-2 data-[state=active]:bg-neutral-900 data-[state=active]:text-white">General Info</TabsTrigger>
          <TabsTrigger value="contact" className="rounded-xl px-4 py-2 data-[state=active]:bg-neutral-900 data-[state=active]:text-white">Contact & Map</TabsTrigger>
          <TabsTrigger value="social" className="rounded-xl px-4 py-2 data-[state=active]:bg-neutral-900 data-[state=active]:text-white">Social Links</TabsTrigger>
          <TabsTrigger value="pastor" className="rounded-xl px-4 py-2 data-[state=active]:bg-neutral-900 data-[state=active]:text-white">Pastor Details</TabsTrigger>
          <TabsTrigger value="times" className="rounded-xl px-4 py-2 data-[state=active]:bg-neutral-900 data-[state=active]:text-white">Service Times</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSave} className="mt-8 space-y-6">
          <TabsContent value="general" className="space-y-6 outline-none">
            <Card className="border-neutral-200/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Basic Information</CardTitle>
                <CardDescription>Core details used throughout the website header and footer.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="churchName">Church Name</Label>
                    <Input id="churchName" defaultValue="Calvary Church of God" className="h-11 border-neutral-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input id="tagline" defaultValue="A community of faith, hope, and love" className="h-11 border-neutral-200" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6 outline-none">
            <Card className="border-neutral-200/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Contact Information</CardTitle>
                <CardDescription>Address, phone, and email shown on the Contact page.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="address">Physical Address</Label>
                  <Input id="address" className="h-11 border-neutral-200" placeholder="123 Church Street..." />
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" className="h-11 border-neutral-200" placeholder="+1-234-567-8900" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Public Email</Label>
                    <Input id="email" type="email" className="h-11 border-neutral-200" placeholder="hello@calvarychurch.org" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mapUrl">Google Maps Embed URL</Label>
                  <Input id="mapUrl" className="h-11 border-neutral-200" placeholder="https://www.google.com/maps/embed?..." />
                  <p className="text-[10px] text-neutral-400">The &apos;src&apos; attribute from the Google Maps iframe embed code.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-6 outline-none">
            <Card className="border-neutral-200/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Social Media Presence</CardTitle>
                <CardDescription>Connect your church social accounts to show icons in the footer.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Facebook className="h-4 w-4 text-[#1877F2]" />
                      Facebook URL
                    </Label>
                    <Input className="h-11 border-neutral-200" placeholder="https://facebook.com/..." />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Youtube className="h-4 w-4 text-[#FF0000]" />
                      YouTube Channel URL
                    </Label>
                    <Input className="h-11 border-neutral-200" placeholder="https://youtube.com/..." />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Instagram className="h-4 w-4 text-[#E4405F]" />
                      Instagram URL
                    </Label>
                    <Input className="h-11 border-neutral-200" placeholder="https://instagram.com/..." />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-[#25D366]" />
                      WhatsApp Group/Contact
                    </Label>
                    <Input className="h-11 border-neutral-200" placeholder="https://wa.me/..." />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pastor" className="space-y-6 outline-none">
            <Card className="border-neutral-200/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Pastor Details</CardTitle>
                <CardDescription>Information shown on the &apos;Our Pastor&apos; page.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="pastorName">Full Name</Label>
                    <Input id="pastorName" defaultValue="Rev. Suresh Randhari" className="h-11 border-neutral-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pastorImage">Profile Image URL</Label>
                    <Input id="pastorImage" className="h-11 border-neutral-200" placeholder="Cloudinary URL..." />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pastorBio">Biography</Label>
                  <Textarea id="pastorBio" rows={6} className="border-neutral-200 resize-none" placeholder="Share the pastor's journey and vision..." />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="times" className="space-y-6 outline-none">
            <Card className="border-neutral-200/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Service Times</CardTitle>
                <CardDescription>Manage the regular weekly services shown on the home page and footer.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { label: "Sunday Worship", time: "10:00 AM" },
                    { label: "Wednesday Bible Study", time: "7:00 PM" }
                  ].map((service, i) => (
                    <div key={i} className="flex gap-4 items-end">
                      <div className="flex-1 space-y-2">
                        <Label>Label</Label>
                        <Input defaultValue={service.label} className="h-10 border-neutral-100 bg-neutral-50/50" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label>Time</Label>
                        <Input defaultValue={service.time} className="h-10 border-neutral-100 bg-neutral-50/50" />
                      </div>
                      <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-red-500 mb-0.5">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" className="mt-4 gap-2 rounded-xl text-neutral-600 border-dashed border-2">
                  <Plus className="h-4 w-4" />
                  Add Service Time
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  );
}
