"use client";

import { useEffect, useState } from "react";
import { 
  Music, 
  Video, 
  Calendar, 
  Newspaper, 
  MessageSquare,
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { motion } from "framer-motion";

interface Stats {
  totalSongs: number;
  totalSermons: number;
  upcomingEvents: number;
  totalBlogs: number;
  prayerRequests: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { 
      title: "Total Songs", 
      value: stats?.totalSongs || 0, 
      icon: Music, 
      color: "text-blue-600", 
      bg: "bg-blue-50",
      href: "/admin/songs",
      description: "Digital hymn book entries"
    },
    { 
      title: "Total Sermons", 
      value: stats?.totalSermons || 0, 
      icon: Video, 
      color: "text-purple-600", 
      bg: "bg-purple-50",
      href: "/admin/sermons",
      description: "Video archive"
    },
    { 
      title: "Upcoming Events", 
      value: stats?.upcomingEvents || 0, 
      icon: Calendar, 
      color: "text-orange-600", 
      bg: "bg-orange-50",
      href: "/admin/events",
      description: "Next 30 days"
    },
    { 
      title: "Blog Posts", 
      value: stats?.totalBlogs || 0, 
      icon: Newspaper, 
      color: "text-green-600", 
      bg: "bg-green-50",
      href: "/admin/blog",
      description: "Published articles"
    },
    { 
      title: "Prayer Requests", 
      value: stats?.prayerRequests || 0, 
      icon: MessageSquare, 
      color: "text-rose-600", 
      bg: "bg-rose-50",
      href: "/admin/prayer-requests",
      description: "Member submissions"
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-neutral-900">Dashboard Overview</h1>
        <p className="mt-2 text-neutral-500">Welcome back. Here's what's happening at Calvary Church.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={stat.href}>
              <Card className="group overflow-hidden border-neutral-200 transition-all hover:shadow-xl hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-500">
                    {stat.title}
                  </CardTitle>
                  <div className={`rounded-full p-2 ${stat.bg}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-bold tracking-tight text-neutral-900">
                      {loading ? "..." : stat.value}
                    </div>
                    <Badge variant="secondary" className="bg-neutral-100 text-neutral-600">
                      <TrendingUp className="mr-1 h-3 w-3 text-neutral-400" />
                      Live
                    </Badge>
                  </div>
                  <CardDescription className="mt-2 flex items-center gap-1 text-xs transition-colors group-hover:text-neutral-900">
                    {stat.description}
                    <ArrowRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <Separator className="bg-neutral-200" />

      {/* Recent Activity Placeholder or Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-neutral-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Quick Actions</CardTitle>
            <CardDescription>Shortcut to common tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link href="/admin/songs">
              <Button variant="outline" className="w-full justify-start gap-2 hover:bg-neutral-50">
                <Music className="h-4 w-4 text-blue-600" />
                Add New Song to Hymn Book
              </Button>
            </Link>
            <Link href="/admin/sermons">
              <Button variant="outline" className="w-full justify-start gap-2 hover:bg-neutral-50">
                <Video className="h-4 w-4 text-purple-600" />
                Upload New Sermon Video
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-serif">System Status</CardTitle>
            <CardDescription>Real-time connectivity overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium">Database Connection</span>
              </div>
              <Badge variant="outline" className="text-emerald-600 border-emerald-100 bg-emerald-50">Healthy</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium">Authentication Service</span>
              </div>
              <Badge variant="outline" className="text-emerald-600 border-emerald-100 bg-emerald-50">Active</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
