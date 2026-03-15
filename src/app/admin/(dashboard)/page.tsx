"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Video,
  Newspaper,
  Calendar,
  Users,
  Plus,
  ArrowRight,
  TrendingUp,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { name: "Total Sermons", value: "24", icon: Video, color: "text-blue-600", bg: "bg-blue-50" },
  { name: "Blog Posts", value: "12", icon: Newspaper, color: "text-purple-600", bg: "bg-purple-50" },
  { name: "Upcoming Events", value: "5", icon: Calendar, color: "text-amber-600", bg: "bg-amber-50" },
  { name: "Site Visitors", value: "1.2k", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
];

const recentActivity = [
  {
    id: 1,
    type: "sermon",
    title: "New Sermon Published",
    detail: "The Power of Radical Love",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "blog",
    title: "New Blog Post",
    detail: "The Importance of Community",
    time: "5 hours ago",
  },
  {
    id: 3,
    type: "event",
    title: "Event Updated",
    detail: "Sunday Worship Service",
    time: "Yesterday",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-neutral-900">Dashboard Overview</h1>
          <p className="mt-1 text-neutral-500">Welcome back! Here&apos;s what&apos;s happening with your site.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl">
            View Public Site
          </Button>
          <Button className="rounded-xl gap-2 shadow-lg shadow-neutral-200">
            <Plus className="h-4 w-4" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-neutral-200/60 shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-500">{stat.name}</p>
                    <h3 className="mt-1 text-3xl font-bold text-neutral-900">{stat.value}</h3>
                  </div>
                  <div className={stat.bg + " p-3 rounded-2xl"}>
                    <stat.icon className={stat.color + " h-6 w-6"} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="border-neutral-200/60 shadow-sm h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Activity className="h-5 w-5 text-neutral-400" />
                Recent Activity
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-neutral-500 hover:text-neutral-900">
                View All
              </Button>
            </CardHeader>
            <CardContent className="px-0">
              <div className="divide-y divide-neutral-100">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between px-6 py-4 hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-neutral-100 flex items-center justify-center">
                        {activity.type === "sermon" && <Video className="h-4 w-4 text-blue-600" />}
                        {activity.type === "blog" && <Newspaper className="h-4 w-4 text-purple-600" />}
                        {activity.type === "event" && <Calendar className="h-4 w-4 text-amber-600" />}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{activity.title}</p>
                        <p className="text-sm text-neutral-500">{activity.detail}</p>
                      </div>
                    </div>
                    <span className="text-xs text-neutral-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions / Suggestions */}
        <div>
          <Card className="border-neutral-200/60 shadow-sm overflow-hidden">
            <div className="bg-neutral-900 p-6 text-white">
              <h3 className="font-semibold">Need Help?</h3>
              <p className="mt-1 text-sm text-white/60">Explore our documentation for managing your church platform.</p>
              <Button variant="outline" className="mt-4 w-full border-white/20 text-white hover:bg-white/10">
                Open Guide
              </Button>
            </div>
            <CardContent className="p-6">
              <h4 className="font-semibold text-neutral-900 mb-4">Site Performance</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">Page Speed</span>
                  <span className="font-medium text-emerald-600">Optimal</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">Storage Used</span>
                  <span className="font-medium">2.4 / 10 GB</span>
                </div>
                <div className="mt-6 border-t border-neutral-100 pt-4">
                  <Link href="/admin/settings" className="group flex items-center justify-between text-sm font-medium text-neutral-900">
                    Review Site Settings
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
