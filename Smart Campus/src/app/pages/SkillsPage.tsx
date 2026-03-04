import { useState, useEffect } from "react";
import { useAuth, User } from "../contexts/AuthContext";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Lightbulb, Plus, X, Search, Users } from "lucide-react";

export function SkillsPage() {
  const { user, updateProfile } = useAuth();
  const [newSkill, setNewSkill] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    const usersData = localStorage.getItem("users");
    if (usersData) {
      const users = JSON.parse(usersData);
      const otherUsers = users.filter((u: User) => u.id !== user?.id && u.skills.length > 0);
      setAllUsers(otherUsers);
      setFilteredUsers(otherUsers);
    }
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(allUsers);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = allUsers.filter((u) =>
        u.skills.some((s) => s.toLowerCase().includes(query))
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, allUsers]);

  const handleAddSkill = () => {
    if (newSkill.trim() && user) {
      const updatedSkills = [...(user.skills || []), newSkill.trim()];
      updateProfile({ skills: updatedSkills });
      setNewSkill("");

      // Update allUsers
      const usersData = localStorage.getItem("users");
      if (usersData) {
        const users = JSON.parse(usersData);
        const otherUsers = users.filter((u: User) => u.id !== user?.id && u.skills.length > 0);
        setAllUsers(otherUsers);
      }
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (user) {
      const updatedSkills = user.skills.filter((s) => s !== skillToRemove);
      updateProfile({ skills: updatedSkills });
    }
  };

  const getSkillCount = (skill: string) => {
    return allUsers.filter((u) => u.skills.includes(skill)).length;
  };

  const allSkills = Array.from(new Set(allUsers.flatMap((u) => u.skills)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Skills & Expertise</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Share your skills and find students with similar expertise
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Your Skills */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Lightbulb className="size-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Skills</h2>
            </div>

            {/* Add Skill Input */}
            <div className="space-y-4 mb-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                />
                <Button onClick={handleAddSkill} disabled={!newSkill.trim()}>
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>

            {/* Skills List */}
            <div className="space-y-2">
              {user?.skills && user.skills.length > 0 ? (
                user.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800"
                  >
                    <span className="font-medium text-gray-900 dark:text-white">{skill}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemoveSkill(skill)}
                      className="size-6 hover:bg-red-100 hover:text-red-600"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Lightbulb className="size-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No skills added yet. Start by adding your first skill!
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Popular Skills */}
          <Card className="p-6 mt-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Popular Skills</h3>
            <div className="flex flex-wrap gap-2">
              {allSkills.slice(0, 10).map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900"
                  onClick={() => setSearchQuery(skill)}
                >
                  {skill} ({getSkillCount(skill)})
                </Badge>
              ))}
            </div>
          </Card>
        </div>

        {/* Find Students by Skill */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Users className="size-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Find Students by Skill
              </h2>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <Input
                placeholder="Search for a skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Students List */}
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Search className="size-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {searchQuery ? "No students found with this skill" : "No students with skills yet"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchQuery ? "Try searching for a different skill" : "Be the first to add your skills!"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredUsers.map((student) => (
                  <Card key={student.id} className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-3">
                      <img
                        src={student.profilePicture}
                        alt={student.username}
                        className="size-12 rounded-full border-2 border-gray-200 dark:border-gray-700"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                          {student.fullName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          @{student.username}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {student.skills.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className={
                                searchQuery && skill.toLowerCase().includes(searchQuery.toLowerCase())
                                  ? "bg-blue-500 text-white"
                                  : ""
                              }
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
