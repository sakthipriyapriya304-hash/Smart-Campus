import { useState, useEffect } from "react";
import { useAuth, User } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Search, UserPlus, UserCheck, Mail } from "lucide-react";
import { Link } from "react-router";

export function NetworkingPage() {
  const { user } = useAuth();
  const { sendConnectionRequest, connectionRequests } = useData();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const usersData = localStorage.getItem("users");
    if (usersData) {
      const users = JSON.parse(usersData);
      const otherUsers = users.filter((u: User) => u.id !== user?.id);
      setAllUsers(otherUsers);
      setFilteredUsers(otherUsers);
    }
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(allUsers);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = allUsers.filter(
        (u) =>
          u.username.toLowerCase().includes(query) ||
          u.fullName.toLowerCase().includes(query) ||
          u.skills.some((s) => s.toLowerCase().includes(query)) ||
          u.interests.some((i) => i.toLowerCase().includes(query))
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, allUsers]);

  const isConnected = (userId: string) => {
    return user?.connections?.includes(userId);
  };

  const hasPendingRequest = (userId: string) => {
    return connectionRequests.some(
      (req) =>
        req.fromUserId === user?.id &&
        req.toUserId === userId &&
        req.status === "pending"
    );
  };

  const handleConnect = (userId: string) => {
    if (user) {
      sendConnectionRequest(user.id, userId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Student Network</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Connect with fellow students and build your campus community
        </p>
      </div>

      {/* Search Bar */}
      <Card className="p-6 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
          <Input
            placeholder="Search by name, username, skills, or interests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Students Grid */}
      {filteredUsers.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Search className="size-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchQuery ? "No students found" : "No students yet"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Be the first to invite your friends to join Smart Campus!"}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((student) => (
            <Card
              key={student.id}
              className="p-6 hover:shadow-xl transition-all duration-200 border-2 hover:border-blue-500 dark:hover:border-blue-400"
            >
              <div className="text-center mb-4">
                <img
                  src={student.profilePicture}
                  alt={student.username}
                  className="size-24 rounded-full mx-auto mb-4 border-4 border-gray-200 dark:border-gray-700"
                />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {student.fullName}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">@{student.username}</p>
                {student.bio && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{student.bio}</p>
                )}
              </div>

              {/* Skills */}
              {student.skills.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">SKILLS</p>
                  <div className="flex flex-wrap gap-2">
                    {student.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {student.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{student.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Interests */}
              {student.interests.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">INTERESTS</p>
                  <div className="flex flex-wrap gap-2">
                    {student.interests.slice(0, 3).map((interest, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                    {student.interests.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{student.interests.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                {isConnected(student.id) ? (
                  <>
                    <Button className="flex-1 bg-green-500 hover:bg-green-600" disabled>
                      <UserCheck className="size-4 mr-2" />
                      Connected
                    </Button>
                    <Link to="/messages" className="flex-1">
                      <Button variant="outline" className="w-full">
                        <Mail className="size-4 mr-2" />
                        Message
                      </Button>
                    </Link>
                  </>
                ) : hasPendingRequest(student.id) ? (
                  <Button className="flex-1" variant="outline" disabled>
                    Request Sent
                  </Button>
                ) : (
                  <Button className="flex-1" onClick={() => handleConnect(student.id)}>
                    <UserPlus className="size-4 mr-2" />
                    Connect
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
