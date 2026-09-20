export type UserRole = 'student' | 'warden' | 'security' | 'maintenance' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  studentId?: string;
  roomNumber?: string;
  block?: string;
  phone?: string;
  staffId?: string;
  designation?: string;
  department?: string;
  officeLocation?: string;
  dutyHours?: string;
  shift?: string;
  checkpoint?: string;
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
}

export interface BedAllocation {
  bedNumber: number;
  status: 'occupied' | 'available';
  occupantName?: string;
  studentId?: string;
  phone?: string;
}

export interface RoomDetails {
  roomNumber: string;
  block: string;
  floor: string;
  type: string;
  totalBeds: number;
  occupiedBeds: number;
  beds: BedAllocation[];
  amenities: string[];
}

export interface StudentProfile {
  id: string;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  course: string;
  year: string;
  bloodGroup: string;
  roomNumber: string;
  block: string;
  floor: string;
  bedNumber: string;
  attendancePercentage: number;
  guardian: {
    name: string;
    relation: string;
    phone: string;
  };
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
}

export type ComplaintCategory =
  | 'Electrical'
  | 'Plumbing'
  | 'Furniture'
  | 'Fan / AC'
  | 'Wi-Fi'
  | 'Cleaning'
  | 'Other';

export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type ComplaintStatus = 'Submitted' | 'Assigned' | 'In Progress' | 'Resolved';

export interface ComplaintTimelineStep {
  status: ComplaintStatus;
  timestamp: string;
  note?: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  roomNumber: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  technicianPhone?: string;
  imageUrl?: string;
  timeline: ComplaintTimelineStep[];
  resolutionNotes?: string;
  resolvedAt?: string;
  assignedStaffId?: string;
}

export type LeaveType = 'Home Visit' | 'Family Function' | 'Medical' | 'Personal' | 'Other';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  fromDate: string;
  toDate: string;
  leaveType: LeaveType;
  destination: string;
  reason: string;
  emergencyContact: string;
  status: LeaveStatus;
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  wardenRemarks?: string;
  passCode?: string;
}

export interface MealInfo {
  id: string;
  name: 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';
  timing: string;
  items: string[];
  isVeg: boolean;
  calories: string;
  currentRating: number;
  totalRatings: number;
  userRating?: number;
}

export interface WeeklyMenuDay {
  day: string;
  breakfast: string[];
  lunch: string[];
  snacks: string[];
  dinner: string[];
}

export interface MenuSuggestion {
  id: string;
  studentName: string;
  dishName: string;
  mealType: string;
  description: string;
  votes: number;
  submittedAt: string;
  hasVoted?: boolean;
}

export type AnnouncementCategory = 'General' | 'Maintenance' | 'Mess' | 'Emergency' | 'Events';
export type AnnouncementPriority = 'Normal' | 'High' | 'Urgent';

export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  author: string;
  isPinned?: boolean;
  isRead?: boolean;
}

export type NotificationType = 'maintenance' | 'leave' | 'mess' | 'announcement' | 'system';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: NotificationType;
  isRead: boolean;
  link?: string;
}

export interface VisitorRequest {
  id: string;
  visitorName: string;
  relation: string;
  purpose: string;
  visitDate: string;
  visitTime: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  phone?: string;
  status: 'Approved' | 'Pending' | 'Completed' | 'Inside';
  passCode: string;
  createdAt: string;
  checkedInAt?: string;
  checkedOutAt?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    maintenance: boolean;
    leaves: boolean;
    announcements: boolean;
    mess: boolean;
  };
}

// Phase 2 Operational Types
export type GateMovementType = 'student_exit' | 'student_entry' | 'visitor_entry' | 'visitor_exit';

export interface GateLogEntry {
  id: string;
  type: GateMovementType;
  personName: string;
  identifier: string; // Student ID or Visitor Pass Code
  roomNumber?: string;
  timestamp: string;
  guardName: string;
  remarks?: string;
}

export type BedStatus = 'occupied' | 'available' | 'maintenance';

export interface BedDetail {
  bedNumber: number;
  status: BedStatus;
  occupantName?: string;
  studentId?: string;
  course?: string;
  year?: string;
  phone?: string;
}

export interface BlockRoom {
  roomNumber: string;
  block: 'Block A' | 'Block B' | 'Block C' | 'Block D';
  floor: number;
  type: '2-Sharing' | '3-Sharing' | '4-Sharing';
  totalBeds: number;
  occupiedBeds: number;
  isUnderMaintenance?: boolean;
  beds: BedDetail[];
}

export interface SmartRoomRecommendation {
  roomNumber: string;
  block: string;
  matchScore: number;
  reasons: string[];
  availableBed: number;
  type: string;
}
