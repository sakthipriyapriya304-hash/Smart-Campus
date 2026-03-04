import { useEffect, useState } from "react";
import { useAuth, User } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Bell, MessageSquare, Users, Calendar, Briefcase, Check } from "lucide-react";

export function NotificationsPage() {
  const { user } = useAuth();
  const { notifications, markNotificationAsRead, connectionRequests, acceptConnectionRequest } = useData();
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    const usersData = localStorage.getItem("users");
    if (usersData) {
      setAllUsers(JSON.parse(usersData));
    }
  }, []);

  const userNotifications = notifications.filter((n) => n.userId === user?.id);
  const pendingRequests = connectionRequests.filter(
    (req) => req.toUserId === user?.id && req.status === "pending"
  );

  const getIconForType = (type: string) => {
    switch (type) {
      case "message":
        return MessageSquare;
      case "connection":
        return Users;
      case "event":
        return Calendar;
      case "collaboration":
        return Briefcase;
      default:
        return Bell;
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case "message":
        return "bg-blue-500";
      case "connection":
        return "bg-green-500";
      case "event":
        return "bg-purple-500";
      case "collaboration":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleAcceptRequest = (requestId: string) => {
    acceptConnectionRequest(requestId);
  };

  const getUserById = (userId: string) => {
    return allUsers.find((u) => u.id === userId);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Notifications</h1>
        <p className="text-gray-600 dark:text-gray-400">Stay updated with your campus activities</p>
      </div>

      {/* Connection Requests */}
      {pendingRequests.length > 0 && (
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Connection Requests</h2>
          <div className="space-y-4">
            {pendingRequests.map((request) => {
              const fromUser = getUserById(request.fromUserId);
              if (!fromUser) return null;

              return (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={fromUser.profilePicture}
                      alt={fromUser.username}
                      className="size-12 rounded-full border-2 border-gray-200 dark:border-gray-700"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {fromUser.fullName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        wants to connect with you
                      </p>
                    </div>
                  </div>
                  <Button onClick={() => handleAcceptRequest(request.id)}>
                    <Check className="size-4 mr-2" />
                    Accept
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Notifications List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Notifications</h2>
          {userNotifications.some((n) => !n.read) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                userNotifications.forEach((n) => {
                  if (!n.read) markNotificationAsRead(n.id);
                });
              }}
            >
              Mark all as read
            </Button>
          )}
        </div>

        {userNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="size-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No notifications yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You'll see notifications here when you get messages, connection requests, or event updates
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {userNotifications.map((notification) => {
              const Icon = getIconForType(notification.type);
              const color = getColorForType(notification.type);

              return (
                <div
                  key={notification.id}
                  className={`flex items-start space-x-4 p-4 rounded-lg transition-colors ${
                    notification.read
                      ? "bg-gray-50 dark:bg-gray-800/50"
                      : "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                  }`}
                  onClick={() => !notification.read && markNotificationAsRead(notification.id)}
                >
                  <div className={`${color} p-2 rounded-lg shrink-0`}>
                    <Icon className="size-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 dark:text-white">{notification.content}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <Badge className="bg-blue-500 shrink-0">New</Badge>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
