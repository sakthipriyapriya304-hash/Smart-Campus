export function initializeMockData() {
  // Check if mock data already exists
  const existingUsers = localStorage.getItem("users");
  if (existingUsers) {
    const users = JSON.parse(existingUsers);
    if (users.length > 5) return; // Already has mock data
  }

  // Create mock users
  const mockUsers = [
    {
      id: "mock-1",
      username: "sarah_chen",
      email: "sarah.chen@college.edu",
      fullName: "Sarah Chen",
      bio: "Computer Science major passionate about AI and machine learning",
      skills: ["Python", "Machine Learning", "React", "TensorFlow"],
      interests: ["AI", "Robotics", "Photography", "Music"],
      profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      connections: ["mock-2", "mock-3"],
      createdAt: new Date(2026, 1, 15).toISOString(),
    },
    {
      id: "mock-2",
      username: "alex_kumar",
      email: "alex.kumar@college.edu",
      fullName: "Alex Kumar",
      bio: "Full-stack developer and hackathon enthusiast",
      skills: ["JavaScript", "Node.js", "MongoDB", "React"],
      interests: ["Web Development", "Startups", "Basketball", "Gaming"],
      profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      connections: ["mock-1", "mock-4"],
      createdAt: new Date(2026, 1, 20).toISOString(),
    },
    {
      id: "mock-3",
      username: "emma_wilson",
      email: "emma.wilson@college.edu",
      fullName: "Emma Wilson",
      bio: "UX/UI Designer creating beautiful digital experiences",
      skills: ["Figma", "Adobe XD", "UI Design", "Prototyping"],
      interests: ["Design", "Art", "Travel", "Coffee"],
      profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      connections: ["mock-1", "mock-5"],
      createdAt: new Date(2026, 2, 1).toISOString(),
    },
    {
      id: "mock-4",
      username: "james_parker",
      email: "james.parker@college.edu",
      fullName: "James Parker",
      bio: "Business major interested in entrepreneurship and innovation",
      skills: ["Marketing", "Business Strategy", "Public Speaking"],
      interests: ["Entrepreneurship", "Finance", "Tennis", "Reading"],
      profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
      connections: ["mock-2"],
      createdAt: new Date(2026, 2, 5).toISOString(),
    },
    {
      id: "mock-5",
      username: "maria_garcia",
      email: "maria.garcia@college.edu",
      fullName: "Maria Garcia",
      bio: "Data Science student exploring the world of analytics",
      skills: ["Python", "Data Analysis", "SQL", "Tableau"],
      interests: ["Data Science", "Statistics", "Cooking", "Yoga"],
      profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      connections: ["mock-3"],
      createdAt: new Date(2026, 2, 10).toISOString(),
    },
  ];

  // Save mock users
  const currentUsers = existingUsers ? JSON.parse(existingUsers) : [];
  const allUsers = [...currentUsers, ...mockUsers];
  localStorage.setItem("users", JSON.stringify(allUsers));

  // Create mock passwords
  const passwords = JSON.parse(localStorage.getItem("passwords") || "{}");
  mockUsers.forEach((user) => {
    passwords[user.email] = "demo123";
  });
  localStorage.setItem("passwords", JSON.stringify(passwords));

  // Create mock opportunities
  const mockOpportunities = [
    {
      id: "opp-1",
      userId: "mock-1",
      type: "internship",
      title: "Summer Software Engineering Internship at TechCorp",
      description: "Join our team for a 12-week paid internship working on cutting-edge web applications. Great opportunity to learn from industry professionals.",
      timestamp: new Date(2026, 2, 1).toISOString(),
      tags: ["Software", "Web Development", "Paid"],
    },
    {
      id: "opp-2",
      userId: "mock-3",
      type: "project",
      title: "Looking for UI/UX Designer for Mobile App Project",
      description: "We're building a campus food delivery app and need a talented designer to help create an amazing user experience.",
      timestamp: new Date(2026, 2, 15).toISOString(),
      tags: ["UI/UX", "Mobile", "Collaboration"],
    },
    {
      id: "opp-3",
      userId: "mock-4",
      type: "event",
      title: "Campus Startup Pitch Competition - March 20",
      description: "Present your startup idea to a panel of investors and entrepreneurs. Prize money of $5,000 for the winner!",
      timestamp: new Date(2026, 2, 18).toISOString(),
      tags: ["Entrepreneurship", "Competition", "Prize"],
    },
    {
      id: "opp-4",
      userId: "mock-2",
      type: "workshop",
      title: "React & Node.js Full-Stack Development Workshop",
      description: "Free 3-day workshop covering modern web development. Beginners welcome! Limited spots available.",
      timestamp: new Date(2026, 2, 20).toISOString(),
      tags: ["React", "Node.js", "Free", "Workshop"],
    },
  ];

  localStorage.setItem("opportunities", JSON.stringify(mockOpportunities));
}
