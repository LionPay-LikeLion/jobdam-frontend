import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Bookmark, LogIn } from "lucide-react";

type UserType = "job_seeker" | "agent" | "company";

interface Post {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
    type: UserType;
  };
  content: string;
  image?: string;
  likes: number;
  bookmarks: number;
  timestamp: string;
}

const mockPosts: Post[] = [
  {
    id: "1",
    user: {
      name: "Sarah Chen",
      username: "@sarahchen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b9e0df05?w=100&h=100&fit=crop&crop=face",
      type: "job_seeker"
    },
    content: "Just completed my React certification! Looking for exciting frontend opportunities in Tokyo. #ReactJS #WebDev",
    likes: 24,
    bookmarks: 8,
    timestamp: "2h"
  },
  {
    id: "2",
    user: {
      name: "TechCorp Japan",
      username: "@techcorpjp",
      avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop",
      type: "company"
    },
    content: "We're hiring 5 senior developers! Join our team and work on cutting-edge AI projects. Remote-friendly! 🚀",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=200&fit=crop",
    likes: 156,
    bookmarks: 89,
    timestamp: "4h"
  },
  {
    id: "3",
    user: {
      name: "Hiroshi Tanaka",
      username: "@hiro_recruiter",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      type: "agent"
    },
    content: "Top 3 skills companies are looking for in 2024: AI/ML, Cloud Architecture, and Cybersecurity. Invest in yourself! 💡",
    likes: 78,
    bookmarks: 34,
    timestamp: "6h"
  },
  {
    id: "4",
    user: {
      name: "Maria Rodriguez",
      username: "@maria_ux",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      type: "job_seeker"
    },
    content: "Portfolio review session was amazing! Thank you to everyone who provided feedback on my UX designs. 🎨",
    likes: 42,
    bookmarks: 15,
    timestamp: "8h"
  },
  {
    id: "5",
    user: {
      name: "StartupHub Tokyo",
      username: "@startuphub_tk",
      avatar: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&h=100&fit=crop",
      type: "company"
    },
    content: "Join our startup accelerator program! Looking for passionate founders with innovative ideas. Apply now! 🌟",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=200&fit=crop",
    likes: 203,
    bookmarks: 127,
    timestamp: "12h"
  },
  {
    id: "6",
    user: {
      name: "Kenji Nakamura",
      username: "@kenji_tech_scout",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      type: "agent"
    },
    content: "Quick tip: When negotiating salary, research the market rate first. Knowledge is power in negotiations! 💪",
    likes: 91,
    bookmarks: 56,
    timestamp: "1d"
  }
];

const userTypeInfo = {
  job_seeker: { label: "Job Seeker", emoji: "🧑‍💼", color: "bg-green-100 text-green-800" },
  agent: { label: "Agent", emoji: "🕵️", color: "bg-blue-100 text-blue-800" },
  company: { label: "Company", emoji: "🏢", color: "bg-purple-100 text-purple-800" }
};

const Index = () => {
  const [activeFilter, setActiveFilter] = useState<UserType | "all">("all");

  const filteredPosts = activeFilter === "all" 
    ? mockPosts 
    : mockPosts.filter(post => post.user.type === activeFilter);

  const filterButtons = [
    { key: "all" as const, label: "All Posts", emoji: "📝" },
    { key: "job_seeker" as const, label: "Job Seekers", emoji: "👤" },
    { key: "agent" as const, label: "Agents", emoji: "🕵️" },
    { key: "company" as const, label: "Companies", emoji: "🏢" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">
              Job<span className="text-foreground">談</span>
            </h1>
          </div>
          
          <Button className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Login
          </Button>
        </div>
      </header>

      <div className="container max-w-2xl mx-auto px-4 py-6">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filterButtons.map((filter) => (
            <Button
              key={filter.key}
              variant={activeFilter === filter.key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter.key)}
              className="flex items-center gap-2"
            >
              <span>{filter.emoji}</span>
              <span className="hidden sm:inline">{filter.label}</span>
            </Button>
          ))}
        </div>

        {/* Feed */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-4">
                {/* User Info */}
                <div className="flex items-start space-x-3 mb-3">
                  <img
                    src={post.user.avatar}
                    alt={post.user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground truncate">
                        {post.user.name}
                      </span>
                      <span className="text-muted-foreground text-sm truncate">
                        {post.user.username}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${userTypeInfo[post.user.type].color}`}
                      >
                        {userTypeInfo[post.user.type].emoji} {userTypeInfo[post.user.type].label}
                      </Badge>
                      <span className="text-muted-foreground text-sm">
                        {post.timestamp}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="mb-3">
                  <p className="text-foreground leading-normal line-clamp-2">
                    {post.content}
                  </p>
                </div>

                {/* Post Image */}
                {post.image && (
                  <div className="mb-3">
                    <img
                      src={post.image}
                      alt="Post attachment"
                      className="w-full rounded-lg object-cover max-h-64"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-red-500 transition-colors p-2"
                    disabled
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    <span className="text-sm">{post.likes}</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-blue-500 transition-colors p-2"
                    disabled
                  >
                    <Bookmark className="h-4 w-4 mr-1" />
                    <span className="text-sm">{post.bookmarks}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Info */}
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">
            Join JobDam to connect with job opportunities and industry professionals
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;