import { useState, useEffect, useRef } from "react";
import { useAuth, User } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Send, Search } from "lucide-react";

export function MessagesPage() {
  const { user } = useAuth();
  const { messages, sendMessage, markMessageAsRead } = useData();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messageText, setMessageText] = useState("");
  const [conversations, setConversations] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get all users that current user has conversations with
    const usersData = localStorage.getItem("users");
    if (usersData && user) {
      const users: User[] = JSON.parse(usersData);
      const conversationUsers = users.filter((u) => {
        if (u.id === user.id) return false;
        return messages.some(
          (m) =>
            (m.senderId === user.id && m.receiverId === u.id) ||
            (m.senderId === u.id && m.receiverId === user.id)
        );
      });

      // Also include connected users
      const connectedUsers = users.filter(
        (u) => u.id !== user.id && user.connections?.includes(u.id)
      );

      // Merge and deduplicate
      const allConversationUsers = Array.from(
        new Set([...conversationUsers, ...connectedUsers].map((u) => u.id))
      ).map((id) => users.find((u) => u.id === id)!);

      setConversations(allConversationUsers);
    }
  }, [user, messages]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedUser]);

  const getConversationMessages = (otherUserId: string) => {
    if (!user) return [];
    return messages
      .filter(
        (m) =>
          (m.senderId === user.id && m.receiverId === otherUserId) ||
          (m.senderId === otherUserId && m.receiverId === user.id)
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const getUnreadCount = (otherUserId: string) => {
    if (!user) return 0;
    return messages.filter(
      (m) => m.senderId === otherUserId && m.receiverId === user.id && !m.read
    ).length;
  };

  const handleSendMessage = () => {
    if (messageText.trim() && selectedUser && user) {
      sendMessage(selectedUser.id, messageText, user.id);
      setMessageText("");
    }
  };

  const handleSelectUser = (selectedUser: User) => {
    setSelectedUser(selectedUser);
    if (user) {
      // Mark messages from this user as read
      const userMessages = messages.filter(
        (m) => m.senderId === selectedUser.id && m.receiverId === user.id && !m.read
      );
      userMessages.forEach((m) => markMessageAsRead(m.id));
    }
  };

  const filteredConversations = searchQuery
    ? conversations.filter(
        (u) =>
          u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Messages</h1>
        <p className="text-gray-600 dark:text-gray-400">Connect and communicate with your peers</p>
      </div>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
          {/* Conversations List */}
          <div className="border-r border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            </div>
            <ScrollArea className="h-[calc(600px-65px)]">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {searchQuery ? "No conversations found" : "No conversations yet. Connect with students to start messaging!"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredConversations.map((conv) => {
                    const unreadCount = getUnreadCount(conv.id);
                    const lastMessage = getConversationMessages(conv.id).slice(-1)[0];
                    return (
                      <div
                        key={conv.id}
                        onClick={() => handleSelectUser(conv)}
                        className={`p-4 cursor-pointer transition-colors ${
                          selectedUser?.id === conv.id
                            ? "bg-blue-50 dark:bg-blue-900/20"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={conv.profilePicture}
                            alt={conv.username}
                            className="size-12 rounded-full border-2 border-gray-200 dark:border-gray-700"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-gray-900 dark:text-white truncate">
                                {conv.fullName}
                              </p>
                              {unreadCount > 0 && (
                                <span className="size-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                                  {unreadCount}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {lastMessage
                                ? lastMessage.senderId === user?.id
                                  ? `You: ${lastMessage.content}`
                                  : lastMessage.content
                                : "No messages yet"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Messages Area */}
          <div className="md:col-span-2 flex flex-col">
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedUser.profilePicture}
                      alt={selectedUser.username}
                      className="size-10 rounded-full border-2 border-gray-200 dark:border-gray-700"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedUser.fullName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">@{selectedUser.username}</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {getConversationMessages(selectedUser.id).map((message) => {
                      const isSent = message.senderId === user?.id;
                      return (
                        <div key={message.id} className={`flex ${isSent ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                              isSent
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isSent ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!messageText.trim()}>
                      <Send className="size-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
