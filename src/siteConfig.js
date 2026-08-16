// This is your personal configuration file. 
// You can edit any of these details and the site will update automatically!
export const siteConfig = {
  // Your Personal Details
  name: "vasu",
  college: "Tech University",
  graduationYear: "2030",
  targetSalary: "12+ LPA",
  
  // Customization
  avatarUrl: "/vasu-avatar", // Replace avatar.jpg in the 'public' folder with your own image
  backgroundVideoUrl: "/background.mp4",
  
  // Journey Details
  // The tracker will calculate progress and delays based on this date. 
  // Format: "YYYY-MM-DD"
  startDate: new Date().toISOString().split('T')[0], 
  
  // Motivational Quotes to rotate on the dashboard
  quotes: [
    "Every packet inspected brings you one step closer.",
    "Zero trust in the network, absolute trust in the process.",
    "A shell today, a career tomorrow.",
    "Consistency is the ultimate exploit.",
    "Security is not a product, but a process."
  ]
};
