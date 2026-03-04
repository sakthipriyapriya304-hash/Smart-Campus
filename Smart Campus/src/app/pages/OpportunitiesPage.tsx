import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Briefcase, Plus, Calendar, Users, Edit, Trash2 } from "lucide-react";

export function OpportunitiesPage() {
  const { user } = useAuth();
  const { opportunities, addOpportunity, deleteOpportunity, updateOpportunity } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");

  const [formData, setFormData] = useState({
    type: "internship" as "internship" | "project" | "event" | "workshop",
    title: "",
    description: "",
    tags: "",
  });

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.description.trim()) return;

    const tags = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);

    if (editingId) {
      updateOpportunity(editingId, {
        ...formData,
        tags,
      });
      setEditingId(null);
    } else {
      addOpportunity({
        userId: user!.id,
        ...formData,
        tags,
      });
    }

    setFormData({
      type: "internship",
      title: "",
      description: "",
      tags: "",
    });
    setIsDialogOpen(false);
  };

  const handleEdit = (oppId: string) => {
    const opp = opportunities.find((o) => o.id === oppId);
    if (opp) {
      setFormData({
        type: opp.type,
        title: opp.title,
        description: opp.description,
        tags: opp.tags.join(", "),
      });
      setEditingId(oppId);
      setIsDialogOpen(true);
    }
  };

  const handleDelete = (oppId: string) => {
    if (confirm("Are you sure you want to delete this opportunity?")) {
      deleteOpportunity(oppId);
    }
  };

  const filteredOpportunities =
    filterType === "all"
      ? opportunities
      : opportunities.filter((opp) => opp.type === filterType);

  const typeColors = {
    internship: "bg-blue-500",
    project: "bg-green-500",
    event: "bg-purple-500",
    workshop: "bg-orange-500",
  };

  const typeIcons = {
    internship: Briefcase,
    project: Users,
    event: Calendar,
    workshop: Users,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Opportunities</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover internships, projects, events, and workshops
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              onClick={() => {
                setEditingId(null);
                setFormData({
                  type: "internship",
                  title: "",
                  description: "",
                  tags: "",
                });
              }}
            >
              <Plus className="size-4 mr-2" />
              Post Opportunity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Opportunity" : "Post New Opportunity"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="Enter opportunity title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe the opportunity..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Tags (comma-separated)</Label>
                <Input
                  placeholder="e.g., React, Design, Marketing"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>

              <Button onClick={handleSubmit} className="w-full">
                {editingId ? "Update Opportunity" : "Post Opportunity"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <Button
          variant={filterType === "all" ? "default" : "outline"}
          onClick={() => setFilterType("all")}
          size="sm"
        >
          All ({opportunities.length})
        </Button>
        <Button
          variant={filterType === "internship" ? "default" : "outline"}
          onClick={() => setFilterType("internship")}
          size="sm"
        >
          Internships ({opportunities.filter((o) => o.type === "internship").length})
        </Button>
        <Button
          variant={filterType === "project" ? "default" : "outline"}
          onClick={() => setFilterType("project")}
          size="sm"
        >
          Projects ({opportunities.filter((o) => o.type === "project").length})
        </Button>
        <Button
          variant={filterType === "event" ? "default" : "outline"}
          onClick={() => setFilterType("event")}
          size="sm"
        >
          Events ({opportunities.filter((o) => o.type === "event").length})
        </Button>
        <Button
          variant={filterType === "workshop" ? "default" : "outline"}
          onClick={() => setFilterType("workshop")}
          size="sm"
        >
          Workshops ({opportunities.filter((o) => o.type === "workshop").length})
        </Button>
      </div>

      {/* Opportunities Grid */}
      {filteredOpportunities.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Briefcase className="size-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No opportunities yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Be the first to post an opportunity for your campus community!
            </p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600"
            >
              <Plus className="size-4 mr-2" />
              Post First Opportunity
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opp) => {
            const Icon = typeIcons[opp.type];
            const isOwner = opp.userId === user?.id;

            return (
              <Card
                key={opp.id}
                className="p-6 hover:shadow-xl transition-all duration-200 border-2 hover:border-blue-500 dark:hover:border-blue-400 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${typeColors[opp.type]} p-3 rounded-lg`}>
                    <Icon className="size-6 text-white" />
                  </div>
                  <Badge className={typeColors[opp.type]}>{opp.type}</Badge>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{opp.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow">
                  {opp.description}
                </p>

                {opp.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {opp.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Posted {new Date(opp.timestamp).toLocaleDateString()}
                </div>

                {isOwner && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(opp.id)}
                      className="flex-1"
                    >
                      <Edit className="size-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(opp.id)}
                      className="flex-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="size-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
