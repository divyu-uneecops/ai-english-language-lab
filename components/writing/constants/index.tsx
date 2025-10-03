import { FileText, Mail, Newspaper, PenTool } from "lucide-react";

export const writingTypeOptions = [
  {
    id: "article",
    title: "Article Writing",
    description: "News articles, blog posts, and informative content",
    icon: Newspaper,
    color: "bg-green-500",
    examples: [
      "Technology trends",
      "Health tips",
      "Travel guide",
      "Product review",
    ],
  },
  {
    id: "notice",
    title: "Notice Writing",
    description: "Official notices, announcements, and formal communications",
    icon: FileText,
    color: "bg-purple-500",
    examples: [
      "School event",
      "Office meeting",
      "Public announcement",
      "Event cancellation",
    ],
  },
  {
    id: "letter",
    title: "Letter Writing",
    description: "Personal and formal letters for various purposes",
    icon: Mail,
    color: "bg-blue-500",
    examples: [
      "Job application",
      "Complaint letter",
      "Thank you letter",
      "Invitation letter",
    ],
  },
  {
    id: "essay",
    title: "Essay Writing",
    description: "Structured essays on various topics and themes",
    icon: PenTool,
    color: "bg-orange-500",
    examples: [
      "Environmental issues",
      "Education system",
      "Social media impact",
      "Future of technology",
    ],
  },
];
