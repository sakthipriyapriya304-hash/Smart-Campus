import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: "message" | "connection" | "event" | "collaboration";
  content: string;
  timestamp: string;
  read: boolean;
  relatedId?: string;
}

export interface ConnectionRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: "pending" | "accepted" | "rejected";
  timestamp: string;
}

export interface Opportunity {
  id: string;
  userId: string;
  type: "internship" | "project" | "event" | "workshop";
  title: string;
  description: string;
  timestamp: string;
  tags: string[];
}

interface DataContextType {
  messages: Message[];
  notifications: Notification[];
  connectionRequests: ConnectionRequest[];
  opportunities: Opportunity[];
  sendMessage: (receiverId: string, content: string, senderId: string) => void;
  markMessageAsRead: (messageId: string) => void;
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void;
  markNotificationAsRead: (notificationId: string) => void;
  sendConnectionRequest: (fromUserId: string, toUserId: string) => void;
  acceptConnectionRequest: (requestId: string) => void;
  addOpportunity: (opportunity: Omit<Opportunity, "id" | "timestamp">) => void;
  deleteOpportunity: (opportunityId: string) => void;
  updateOpportunity: (opportunityId: string, updates: Partial<Opportunity>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const loadedMessages = localStorage.getItem("messages");
    const loadedNotifications = localStorage.getItem("notifications");
    const loadedRequests = localStorage.getItem("connectionRequests");
    const loadedOpportunities = localStorage.getItem("opportunities");

    if (loadedMessages) setMessages(JSON.parse(loadedMessages));
    if (loadedNotifications) setNotifications(JSON.parse(loadedNotifications));
    if (loadedRequests) setConnectionRequests(JSON.parse(loadedRequests));
    if (loadedOpportunities) setOpportunities(JSON.parse(loadedOpportunities));
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Save connection requests to localStorage
  useEffect(() => {
    localStorage.setItem("connectionRequests", JSON.stringify(connectionRequests));
  }, [connectionRequests]);

  // Save opportunities to localStorage
  useEffect(() => {
    localStorage.setItem("opportunities", JSON.stringify(opportunities));
  }, [opportunities]);

  const sendMessage = (receiverId: string, content: string, senderId: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId,
      receiverId,
      content,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => [...prev, newMessage]);

    // Add notification for receiver
    addNotification({
      userId: receiverId,
      type: "message",
      content: `New message from user`,
      read: false,
      relatedId: senderId,
    });
  };

  const markMessageAsRead = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg))
    );
  };

  const addNotification = (notification: Omit<Notification, "id" | "timestamp">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif))
    );
  };

  const sendConnectionRequest = (fromUserId: string, toUserId: string) => {
    const newRequest: ConnectionRequest = {
      id: Date.now().toString(),
      fromUserId,
      toUserId,
      status: "pending",
      timestamp: new Date().toISOString(),
    };
    setConnectionRequests((prev) => [...prev, newRequest]);

    // Add notification
    addNotification({
      userId: toUserId,
      type: "connection",
      content: `New connection request`,
      read: false,
      relatedId: fromUserId,
    });
  };

  const acceptConnectionRequest = (requestId: string) => {
    setConnectionRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: "accepted" as const } : req))
    );

    // Update both users' connections
    const request = connectionRequests.find((req) => req.id === requestId);
    if (request) {
      const usersData = localStorage.getItem("users");
      if (usersData) {
        const users = JSON.parse(usersData);
        const fromUserIndex = users.findIndex((u: any) => u.id === request.fromUserId);
        const toUserIndex = users.findIndex((u: any) => u.id === request.toUserId);

        if (fromUserIndex !== -1 && toUserIndex !== -1) {
          users[fromUserIndex].connections = [...(users[fromUserIndex].connections || []), request.toUserId];
          users[toUserIndex].connections = [...(users[toUserIndex].connections || []), request.fromUserId];
          localStorage.setItem("users", JSON.stringify(users));
        }
      }
    }
  };

  const addOpportunity = (opportunity: Omit<Opportunity, "id" | "timestamp">) => {
    const newOpportunity: Opportunity = {
      ...opportunity,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setOpportunities((prev) => [newOpportunity, ...prev]);
  };

  const deleteOpportunity = (opportunityId: string) => {
    setOpportunities((prev) => prev.filter((opp) => opp.id !== opportunityId));
  };

  const updateOpportunity = (opportunityId: string, updates: Partial<Opportunity>) => {
    setOpportunities((prev) =>
      prev.map((opp) => (opp.id === opportunityId ? { ...opp, ...updates } : opp))
    );
  };

  return (
    <DataContext.Provider
      value={{
        messages,
        notifications,
        connectionRequests,
        opportunities,
        sendMessage,
        markMessageAsRead,
        addNotification,
        markNotificationAsRead,
        sendConnectionRequest,
        acceptConnectionRequest,
        addOpportunity,
        deleteOpportunity,
        updateOpportunity,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
