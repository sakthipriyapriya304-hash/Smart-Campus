import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Camera, Save, Plus, X } from "lucide-react";
import { toast } from "sonner";

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    fullName: user?.fullName || "",
    email: user?.email || "",
    bio: user?.bio || "",
  });
  const [newInterest, setNewInterest] = useState("");

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && user) {
      const updatedInterests = [...(user.interests || []), newInterest.trim()];
      updateProfile({ interests: updatedInterests });
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    if (user) {
      const updatedInterests = user.interests.filter((i) => i !== interestToRemove);
      updateProfile({ interests: updatedInterests });
    }
  };

  const handleChangeProfilePicture = () => {
    const seed = prompt("Enter a seed for your avatar (any text):");
    if (seed) {
      updateProfile({
        profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`,
      });
      toast.success("Profile picture updated!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Profile Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your personal information and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile Picture */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={user?.profilePicture}
                alt={user?.username}
                className="size-32 rounded-full border-4 border-gray-200 dark:border-gray-700"
              />
              <Button
                size="icon"
                onClick={handleChangeProfilePicture}
                className="absolute bottom-0 right-0 rounded-full size-10"
              >
                <Camera className="size-5" />
              </Button>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.fullName}</h2>
              <p className="text-gray-600 dark:text-gray-400">@{user?.username}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Member since {user?.createdAt && new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Basic Information */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Basic Information</h3>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={() => setIsEditing(false)} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="size-4 mr-2" />
                  Save
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Bio</Label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                disabled={!isEditing}
                rows={4}
                placeholder="Tell others about yourself..."
              />
            </div>
          </div>
        </Card>

        {/* Skills */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {user?.skills && user.skills.length > 0 ? (
              user.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No skills added yet</p>
            )}
          </div>
          <Button variant="outline" className="mt-4" asChild>
            <a href="/skills">Manage Skills</a>
          </Button>
        </Card>

        {/* Interests */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Interests</h3>

          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Add an interest..."
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddInterest()}
            />
            <Button onClick={handleAddInterest} disabled={!newInterest.trim()}>
              <Plus className="size-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {user?.interests && user.interests.length > 0 ? (
              user.interests.map((interest, index) => (
                <Badge key={index} variant="outline" className="text-sm pr-1">
                  {interest}
                  <button
                    onClick={() => handleRemoveInterest(interest)}
                    className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No interests added yet</p>
            )}
          </div>
        </Card>

        {/* Connections */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Connections</h3>
          <div className="flex items-center justify-between">
            <p className="text-gray-600 dark:text-gray-400">
              You have {user?.connections?.length || 0} connections
            </p>
            <Button variant="outline" asChild>
              <a href="/networking">View Network</a>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
