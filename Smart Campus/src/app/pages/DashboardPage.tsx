import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Link } from "react-router";
import { Calendar, Users, MessageSquare, Briefcase, TrendingUp, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { User } from "../contexts/AuthContext";

export function DashboardPage() {
  const { user } = useAuth();
  const { opportunities, messages } = useData();
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    const usersData = localStorage.getItem("users");
    if (usersData) {
      const users = JSON.parse(usersData);
      setAllUsers(users.filter((u: User) => u.id !== user?.id).slice(0, 5));
    }
  }, [user]);

  const recentOpportunities = opportunities.slice(0, 3);
  const unreadMessages = messages.filter(m => m.receiverId === user?.id && !m.read).length;

  const stats = [
    {
      icon: Users,
      label: "Connections",
      value: user?.connections?.length || 0,
      color: "bg-blue-500",
      link: "/networking",
    },
    {
      icon: MessageSquare,
      label: "Messages",
      value: unreadMessages,
      color: "bg-green-500",
      link: "/messages",
    },
    {
      icon: Briefcase,
      label: "Opportunities",
      value: opportunities.length,
      color: "bg-purple-500",
      link: "/opportunities",
    },
    {
      icon: Activity,
      label: "Skills",
      value: user?.skills?.length || 0,
      color: "bg-orange-500",
      link: "/skills",
    },
  ];

  const announcements = [
    {
      title: "Welcome to Smart Campus!",
      date: "March 4, 2026",
      content: "Connect with fellow students, share skills, and discover opportunities.",
    },
    {
      title: "New Features Available",
      date: "March 3, 2026",
      content: "Check out our updated messaging system and skill-sharing platform.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {user?.fullName || user?.username}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what's happening in your campus community today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} to={stat.link}>
              <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-blue-500 dark:hover:border-blue-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="size-6 text-white" />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Campus Announcements */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="size-6 text-blue-500" />
                Campus Announcements
              </h2>
            </div>
            <div className="space-y-4">
              {announcements.map((announcement, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{announcement.title}</h3>
                    <Badge variant="secondary" className="text-xs">{announcement.date}</Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{announcement.content}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Opportunities */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="size-6 text-purple-500" />
                Recent Opportunities
              </h2>
              <Link to="/opportunities">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
            <div className="space-y-4">
              {recentOpportunities.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No opportunities posted yet. Be the first to share one!
                </p>
              ) : (
                recentOpportunities.map((opp) => (
                  <div
                    key={opp.id}
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-400 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{opp.title}</h3>
                      <Badge
                        className={
                          opp.type === "internship"
                            ? "bg-blue-500"
                            : opp.type === "project"
                            ? "bg-green-500"
                            : opp.type === "event"
                            ? "bg-purple-500"
                            : "bg-orange-500"
                        }
                      >
                        {opp.type}
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{opp.description}</p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Recently Active Students */}
        <div>
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
              <Users className="size-6 text-green-500" />
              Active Students
            </h2>
            <div className="space-y-4">
              {allUsers.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No other students yet. Invite your friends!
                </p>
              ) : (
                allUsers.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <img
                      src={student.profilePicture}
                      alt={student.username}
                      className="size-12 rounded-full border-2 border-gray-200 dark:border-gray-700"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {student.fullName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        @{student.username}
                      </p>
                    </div>
                    <Link to="/networking">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
            <Link to="/networking">
              <Button className="w-full mt-4" variant="outline">
                View All Students
              </Button>
            </Link>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/opportunities">
                <Button className="w-full justify-start" variant="outline">
                  <Briefcase className="size-4 mr-2" />
                  Post Opportunity
                </Button>
              </Link>
              <Link to="/skills">
                <Button className="w-full justify-start" variant="outline">
                  <Activity className="size-4 mr-2" />
                  Share Your Skills
                </Button>
              </Link>
              <Link to="/messages">
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="size-4 mr-2" />
                  Send Message
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
