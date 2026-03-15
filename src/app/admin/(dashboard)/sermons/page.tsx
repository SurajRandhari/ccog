"use client";

import { motion } from "framer-motion";
import { 
  Video, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye,
  Calendar,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

// Dummy data for sermons
const sermons = [
  {
    id: "1",
    title: "The Power of Radical Love",
    series: "Greater Love",
    speaker: "Rev. Suresh Randhari",
    date: "2026-05-18",
    status: "Published",
  },
  {
    id: "2",
    title: "Walking in Faith",
    series: "The Journey",
    speaker: "Rev. Suresh Randhari",
    date: "2026-05-11",
    status: "Published",
  },
  {
    id: "3",
    title: "A Community of Hope",
    series: "Kingdom Life",
    speaker: "Rev. Suresh Randhari",
    date: "2026-05-04",
    status: "Draft",
  },
];

export default function SermonsAdminPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-neutral-900">Sermons</h1>
          <p className="mt-1 text-neutral-500">Manage your video messages and sermon series.</p>
        </div>
        <Link href="/admin/sermons/new">
          <Button className="rounded-xl gap-2 shadow-lg shadow-neutral-200">
            <Plus className="h-4 w-4" />
            Add Sermon
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input 
            placeholder="Search by title, series, or speaker..." 
            className="h-11 border-neutral-200 bg-white pl-10 focus-visible:ring-neutral-900"
          />
        </div>
        <Button variant="outline" className="h-11 gap-2 rounded-xl border-neutral-200 bg-white">
          <Filter className="h-4 w-4 text-neutral-400" />
          Sort & Filter
        </Button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50/50 text-neutral-400 uppercase tracking-wider font-medium">
              <tr>
                <th className="px-6 py-4">Title & Series</th>
                <th className="px-6 py-4">Speaker</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {sermons.map((sermon, i) => (
                <motion.tr
                  key={sermon.id}
                  initial="hidden"
                  animate="visible"
                  custom={i}
                  variants={fadeInUp}
                  className="group hover:bg-neutral-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-400 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                        <Video className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900">{sermon.title}</p>
                        <p className="text-xs text-neutral-400">{sermon.series}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-600">
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-neutral-300" />
                      {sermon.speaker}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-500 font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-neutral-300" />
                      {sermon.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      sermon.status === 'Published' 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'bg-neutral-100 text-neutral-500'
                    }`}>
                      {sermon.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <MoreVertical className="h-4 w-4 text-neutral-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-xl">
                        <DropdownMenuItem asChild>
                          <Link href={`/resources/sermons/${sermon.id}`} target="_blank" className="cursor-pointer gap-2">
                            <Eye className="h-4 w-4" /> View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/sermons/${sermon.id}`} className="cursor-pointer gap-2">
                            <Edit2 className="h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2 text-red-600 focus:text-red-600">
                          <Trash2 className="h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
