import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Complaint,
  LeaveRequest,
  RoomDetails,
  StudentProfile,
  MealInfo,
  WeeklyMenuDay,
  MenuSuggestion,
  Announcement,
  NotificationItem,
  VisitorRequest,
  ComplaintCategory,
  ComplaintPriority,
  LeaveType,
  AppSettings,
  BlockRoom,
  GateLogEntry,
  GateMovementType,
  AnnouncementCategory,
  AnnouncementPriority,
} from '../types';
import {
  STORAGE_KEYS,
  getFromStorage,
  saveToStorage,
  resetAllStorage,
  initializeStorage,
} from '../utils/storage';
import {
  generateComplaintId,
  generateLeaveId,
  generatePassCode,
} from '../utils/formatters';
import initialStudent from '../data/students.json';
import initialRoom from '../data/rooms.json';
import initialComplaints from '../data/complaints.json';
import initialLeaves from '../data/leaves.json';
import initialMess from '../data/mess.json';
import initialAnnouncements from '../data/announcements.json';
import initialNotifications from '../data/notifications.json';
import initialBlockRooms from '../data/blockRooms.json';
import initialGateLogs from '../data/gateLogs.json';
import initialVisitors from '../data/visitors.json';

interface DataContextType {
  profile: StudentProfile;
  room: RoomDetails;
  complaints: Complaint[];
  leaves: LeaveRequest[];
  todayMeals: MealInfo[];
  weeklyMenu: WeeklyMenuDay[];
  suggestions: MenuSuggestion[];
  announcements: Announcement[];
  notifications: NotificationItem[];
  visitors: VisitorRequest[];
  blockRooms: BlockRoom[];
  gateLogs: GateLogEntry[];
  unreadNotificationCount: number;

  // Student Actions
  addComplaint: (data: {
    title: string;
    description: string;
    category: ComplaintCategory;
    priority: ComplaintPriority;
    imageUrl?: string;
  }) => Complaint;
  cancelComplaint: (id: string) => void;

  applyLeave: (data: {
    fromDate: string;
    toDate: string;
    leaveType: LeaveType;
    destination: string;
    reason: string;
    emergencyContact: string;
  }) => LeaveRequest;

  rateMeal: (mealId: string, rating: number) => void;
  suggestDish: (data: { dishName: string; mealType: string; description: string }) => MenuSuggestion;
  voteSuggestion: (suggestionId: string) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;

  updateProfile: (updated: Partial<StudentProfile>) => void;
  requestRoomChange: (data: { reason: string; preferredBlock: string; preferredFloor: string }) => void;
  requestVisitorPass: (data: { visitorName: string; relation: string; purpose: string; visitDate: string; visitTime: string }) => VisitorRequest;

  // Phase 2 Warden Actions
  assignComplaint: (id: string, assignedTo: string, technicianPhone?: string, priority?: ComplaintPriority) => void;
  reviewLeave: (id: string, decision: 'Approved' | 'Rejected', remarks: string) => void;
  createAnnouncement: (data: {
    title: string;
    description: string;
    category: AnnouncementCategory;
    priority: AnnouncementPriority;
    isPinned?: boolean;
  }) => Announcement;
  allocateBed: (
    roomNumber: string,
    bedNumber: number,
    student: { name: string; studentId: string; course: string; year: string; phone: string }
  ) => void;
  vacateBed: (roomNumber: string, bedNumber: number) => void;
  toggleRoomMaintenance: (roomNumber: string) => void;

  // Phase 2 Maintenance Actions
  startMaintenanceTask: (complaintId: string, notes?: string) => void;
  resolveMaintenanceTask: (complaintId: string, resolutionNotes: string) => void;

  // Phase 2 Security Actions
  recordGateMovement: (entry: {
    personName: string;
    identifier: string;
    type: GateMovementType;
    roomNumber?: string;
    remarks?: string;
  }) => void;
  approveVisitor: (visitorId: string) => void;
  checkInVisitor: (visitorId: string) => void;
  checkOutVisitor: (visitorId: string) => void;
  recordStudentExit: (studentId: string, studentName: string, roomNumber: string, passCode?: string) => void;
  recordStudentEntry: (studentId: string, studentName: string, roomNumber: string) => void;

  resetDemoData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const loaded = getFromStorage<StudentProfile>(STORAGE_KEYS.PROFILE, initialStudent as StudentProfile);
    if (!loaded.avatar || loaded.avatar.includes('unsplash.com')) {
      loaded.avatar = '/avatars/aravind_kumar.jpg';
      saveToStorage(STORAGE_KEYS.PROFILE, loaded);
    }
    return loaded;
  });

  // Ensure storage is seeded on first boot
  useEffect(() => {
    initializeStorage();
    setProfile((prev) => {
      if (!prev.avatar || prev.avatar.includes('unsplash.com')) {
        const updated = { ...prev, avatar: '/avatars/aravind_kumar.jpg' };
        saveToStorage(STORAGE_KEYS.PROFILE, updated);
        return updated;
      }
      return prev;
    });
  }, []);

  const [room, setRoom] = useState<RoomDetails>(() =>
    getFromStorage<RoomDetails>(STORAGE_KEYS.ROOM, initialRoom as RoomDetails)
  );

  const [complaints, setComplaints] = useState<Complaint[]>(() =>
    getFromStorage<Complaint[]>(STORAGE_KEYS.COMPLAINTS, initialComplaints as Complaint[])
  );

  const [leaves, setLeaves] = useState<LeaveRequest[]>(() =>
    getFromStorage<LeaveRequest[]>(STORAGE_KEYS.LEAVES, initialLeaves as LeaveRequest[])
  );

  const [messState, setMessState] = useState<{
    todayMeals: MealInfo[];
    weeklyMenu: WeeklyMenuDay[];
    suggestions: MenuSuggestion[];
  }>(() =>
    getFromStorage(
      STORAGE_KEYS.MESS,
      initialMess as unknown as {
        todayMeals: MealInfo[];
        weeklyMenu: WeeklyMenuDay[];
        suggestions: MenuSuggestion[];
      }
    )
  );

  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    getFromStorage<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, initialAnnouncements as Announcement[])
  );

  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    getFromStorage<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, initialNotifications as NotificationItem[])
  );

  const [visitors, setVisitors] = useState<VisitorRequest[]>(() =>
    getFromStorage<VisitorRequest[]>(STORAGE_KEYS.VISITORS, initialVisitors as VisitorRequest[])
  );

  const [blockRooms, setBlockRooms] = useState<BlockRoom[]>(() =>
    getFromStorage<BlockRoom[]>(STORAGE_KEYS.BLOCK_ROOMS, initialBlockRooms as BlockRoom[])
  );

  const [gateLogs, setGateLogs] = useState<GateLogEntry[]>(() =>
    getFromStorage<GateLogEntry[]>(STORAGE_KEYS.GATE_LOGS, initialGateLogs as GateLogEntry[])
  );

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  // Complaint actions
  const addComplaint = (data: {
    title: string;
    description: string;
    category: ComplaintCategory;
    priority: ComplaintPriority;
    imageUrl?: string;
  }): Complaint => {
    const id = generateComplaintId();
    const now = new Date().toISOString();
    const newComplaint: Complaint = {
      id,
      title: data.title,
      description: data.description,
      category: data.category,
      roomNumber: profile.roomNumber || 'B-204',
      priority: data.priority,
      status: 'Submitted',
      createdAt: now,
      updatedAt: now,
      imageUrl: data.imageUrl,
      timeline: [
        {
          status: 'Submitted',
          timestamp: now,
          note: `Request logged by student ${profile.name}`,
        },
      ],
    };

    const updated = [newComplaint, ...complaints];
    setComplaints(updated);
    saveToStorage(STORAGE_KEYS.COMPLAINTS, updated);

    // Trigger a notification if user has enabled maintenance alerts in Settings
    const currentSettings = getFromStorage<AppSettings>(STORAGE_KEYS.SETTINGS, {
      theme: 'system',
      notifications: { maintenance: true, leaves: true, announcements: true, mess: true },
    });

    if (currentSettings.notifications?.maintenance) {
      const newNotification: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Complaint Registered',
        message: `Your maintenance request ${id} (${data.title}) has been registered successfully.`,
        timestamp: now,
        type: 'maintenance',
        isRead: false,
        link: '/maintenance',
      };
      const updatedNotifs = [newNotification, ...notifications];
      setNotifications(updatedNotifs);
      saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updatedNotifs);
    }

    return newComplaint;
  };

  const cancelComplaint = (id: string) => {
    const updated = complaints.filter((c) => c.id !== id);
    setComplaints(updated);
    saveToStorage(STORAGE_KEYS.COMPLAINTS, updated);
  };

  // Leave actions
  const applyLeave = (data: {
    fromDate: string;
    toDate: string;
    leaveType: LeaveType;
    destination: string;
    reason: string;
    emergencyContact: string;
  }): LeaveRequest => {
    const id = generateLeaveId();
    const passCode = generatePassCode();
    const now = new Date().toISOString();

    const newLeave: LeaveRequest = {
      id,
      studentId: profile.studentId,
      studentName: profile.name,
      roomNumber: profile.roomNumber,
      fromDate: data.fromDate,
      toDate: data.toDate,
      leaveType: data.leaveType,
      destination: data.destination,
      reason: data.reason,
      emergencyContact: data.emergencyContact,
      status: 'Pending',
      appliedAt: now,
      passCode,
    };

    const updated = [newLeave, ...leaves];
    setLeaves(updated);
    saveToStorage(STORAGE_KEYS.LEAVES, updated);

    // Trigger notification if user has enabled leave alerts in Settings
    const currentSettings = getFromStorage<AppSettings>(STORAGE_KEYS.SETTINGS, {
      theme: 'system',
      notifications: { maintenance: true, leaves: true, announcements: true, mess: true },
    });

    if (currentSettings.notifications?.leaves) {
      const newNotification: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Leave Request Submitted',
        message: `Leave request ${id} for ${data.leaveType} submitted and forwarded to Warden office.`,
        timestamp: now,
        type: 'leave',
        isRead: false,
        link: '/leaves',
      };
      const updatedNotifs = [newNotification, ...notifications];
      setNotifications(updatedNotifs);
      saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updatedNotifs);
    }

    return newLeave;
  };

  // Mess actions
  const rateMeal = (mealId: string, rating: number) => {
    const validRating = Math.max(1, Math.min(5, Math.round(rating)));
    const updatedMeals = messState.todayMeals.map((meal) => {
      if (meal.id === mealId) {
        let newRating = meal.currentRating;
        let total = meal.totalRatings;

        if (meal.userRating) {
          const sumWithoutOld = meal.currentRating * total - meal.userRating;
          newRating = parseFloat(((sumWithoutOld + validRating) / Math.max(1, total)).toFixed(1));
        } else {
          total = meal.totalRatings + 1;
          newRating = parseFloat(((meal.currentRating * meal.totalRatings + validRating) / total).toFixed(1));
        }

        return {
          ...meal,
          currentRating: Math.max(1.0, Math.min(5.0, newRating)),
          totalRatings: total,
          userRating: validRating,
        };
      }
      return meal;
    });

    const updatedState = { ...messState, todayMeals: updatedMeals };
    setMessState(updatedState);
    saveToStorage(STORAGE_KEYS.MESS, updatedState);
  };

  const suggestDish = (data: { dishName: string; mealType: string; description: string }): MenuSuggestion => {
    const newSuggestion: MenuSuggestion = {
      id: `sug-${Date.now()}`,
      studentName: profile.name,
      dishName: data.dishName,
      mealType: data.mealType,
      description: data.description,
      votes: 1,
      submittedAt: new Date().toISOString(),
      hasVoted: true,
    };

    const updatedSuggestions = [newSuggestion, ...messState.suggestions];
    const updatedState = { ...messState, suggestions: updatedSuggestions };
    setMessState(updatedState);
    saveToStorage(STORAGE_KEYS.MESS, updatedState);
    return newSuggestion;
  };

  const voteSuggestion = (suggestionId: string) => {
    const updatedSuggestions = messState.suggestions.map((sug) => {
      if (sug.id === suggestionId) {
        const hasVoted = !sug.hasVoted;
        return {
          ...sug,
          votes: hasVoted ? sug.votes + 1 : Math.max(0, sug.votes - 1),
          hasVoted,
        };
      }
      return sug;
    });

    const updatedState = { ...messState, suggestions: updatedSuggestions };
    setMessState(updatedState);
    saveToStorage(STORAGE_KEYS.MESS, updatedState);
  };

  // Notification actions
  const markNotificationRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    setNotifications(updated);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
  };

  const markAllNotificationsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
  };

  const clearNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, []);
  };

  // Profile update
  const updateProfile = (updated: Partial<StudentProfile>) => {
    const newProfile = { ...profile, ...updated };
    setProfile(newProfile);
    saveToStorage(STORAGE_KEYS.PROFILE, newProfile);
  };

  // Room change request
  const requestRoomChange = (data: { reason: string; preferredBlock: string; preferredFloor: string }) => {
    const now = new Date().toISOString();
    const newNotification: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Room Change Requested',
      message: `Room transfer request to ${data.preferredBlock} (${data.preferredFloor}) has been forwarded to Chief Warden office.`,
      timestamp: now,
      type: 'system',
      isRead: false,
    };
    const updatedNotifs = [newNotification, ...notifications];
    setNotifications(updatedNotifs);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updatedNotifs);
  };

  // Visitor request
  const requestVisitorPass = (data: {
    visitorName: string;
    relation: string;
    purpose: string;
    visitDate: string;
    visitTime: string;
  }): VisitorRequest => {
    const newVisitor: VisitorRequest = {
      id: `vis-${Date.now()}`,
      visitorName: data.visitorName,
      relation: data.relation,
      purpose: data.purpose,
      visitDate: data.visitDate,
      visitTime: data.visitTime,
      studentId: profile.studentId,
      studentName: profile.name,
      roomNumber: profile.roomNumber,
      status: 'Approved',
      passCode: `VP-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
    };

    const updated = [newVisitor, ...visitors];
    setVisitors(updated);
    saveToStorage(STORAGE_KEYS.VISITORS, updated);

    // Notification
    const newNotification: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Visitor Pass Approved',
      message: `Visitor pass issued for ${data.visitorName} (${data.relation}) on ${data.visitDate}. Pass Code: ${newVisitor.passCode}`,
      timestamp: new Date().toISOString(),
      type: 'system',
      isRead: false,
    };
    const updatedNotifs = [newNotification, ...notifications];
    setNotifications(updatedNotifs);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updatedNotifs);

    return newVisitor;
  };

  // Phase 2 Warden Actions
  const assignComplaint = (
    id: string,
    assignedTo: string,
    technicianPhone?: string,
    priority?: ComplaintPriority
  ) => {
    const now = new Date().toISOString();
    const updated = complaints.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          status: 'Assigned' as const,
          assignedTo,
          technicianPhone: technicianPhone || '+91 98230 45678',
          priority: priority || c.priority,
          updatedAt: now,
          timeline: [
            ...c.timeline,
            {
              status: 'Assigned' as const,
              timestamp: now,
              note: `Assigned to ${assignedTo} (${technicianPhone || 'Facilities Support'}) by Chief Warden`,
            },
          ],
        };
      }
      return c;
    });

    setComplaints(updated);
    saveToStorage(STORAGE_KEYS.COMPLAINTS, updated);

    // Notify student
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Technician Dispatched',
      message: `Your complaint ${id} has been assigned to ${assignedTo}. Diagnostic & repair work scheduled.`,
      timestamp: now,
      type: 'maintenance',
      isRead: false,
      link: '/maintenance',
    };
    const updatedNotifs = [notif, ...notifications];
    setNotifications(updatedNotifs);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updatedNotifs);
  };

  const reviewLeave = (id: string, decision: 'Approved' | 'Rejected', remarks: string) => {
    const now = new Date().toISOString();
    let targetLeave: LeaveRequest | undefined;

    const updated = leaves.map((l) => {
      if (l.id === id) {
        targetLeave = {
          ...l,
          status: decision,
          reviewedAt: now,
          reviewedBy: 'Dr. K. Ramanathan (Chief Warden)',
          wardenRemarks: remarks,
        };
        return targetLeave;
      }
      return l;
    });

    setLeaves(updated);
    saveToStorage(STORAGE_KEYS.LEAVES, updated);

    // Notify student
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: decision === 'Approved' ? 'Leave Request Approved' : 'Leave Request Rejected',
      message:
        decision === 'Approved'
          ? `Your leave request ${id} to ${targetLeave?.destination || 'destination'} has been approved! Pass Code: ${targetLeave?.passCode || 'ACTIVE'}.`
          : `Your leave request ${id} was rejected. Warden Remarks: ${remarks || 'Incomplete documentation'}.`,
      timestamp: now,
      type: 'leave',
      isRead: false,
      link: '/leaves',
    };
    const updatedNotifs = [notif, ...notifications];
    setNotifications(updatedNotifs);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updatedNotifs);

    // If approved, create security outstation authorization record
    if (decision === 'Approved' && targetLeave) {
      const gateEntry: GateLogEntry = {
        id: `gate-${Date.now()}`,
        type: 'student_exit',
        personName: targetLeave.studentName,
        identifier: targetLeave.passCode || targetLeave.studentId,
        roomNumber: targetLeave.roomNumber,
        timestamp: now,
        guardName: 'Officer S. Verma (Pre-Auth)',
        remarks: `Warden authorized leave to ${targetLeave.destination}`,
      };
      const updatedLogs = [gateEntry, ...gateLogs];
      setGateLogs(updatedLogs);
      saveToStorage(STORAGE_KEYS.GATE_LOGS, updatedLogs);
    }
  };

  const createAnnouncement = (data: {
    title: string;
    description: string;
    category: AnnouncementCategory;
    priority: AnnouncementPriority;
    isPinned?: boolean;
  }): Announcement => {
    const now = new Date().toISOString();
    const newNotice: Announcement = {
      id: `ann-${Date.now()}`,
      title: data.title,
      description: data.description,
      date: now.split('T')[0],
      category: data.category,
      priority: data.priority,
      author: 'Office of Chief Warden',
      isPinned: data.isPinned ?? false,
      isRead: false,
    };

    const updated = [newNotice, ...announcements];
    setAnnouncements(updated);
    saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, updated);

    // Push alert to all students
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Notice: ${data.title}`,
      message: data.description.length > 90 ? `${data.description.slice(0, 90)}...` : data.description,
      timestamp: now,
      type: 'announcement',
      isRead: false,
      link: '/announcements',
    };
    const updatedNotifs = [notif, ...notifications];
    setNotifications(updatedNotifs);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updatedNotifs);

    return newNotice;
  };

  const allocateBed = (
    roomNumber: string,
    bedNumber: number,
    student: { name: string; studentId: string; course: string; year: string; phone: string }
  ) => {
    const updatedRooms = blockRooms.map((rm) => {
      if (rm.roomNumber === roomNumber) {
        const updatedBeds = rm.beds.map((b) => {
          if (b.bedNumber === bedNumber) {
            return {
              ...b,
              status: 'occupied' as const,
              occupantName: student.name,
              studentId: student.studentId,
              course: student.course,
              year: student.year,
              phone: student.phone,
            };
          }
          return b;
        });
        const occupiedCount = updatedBeds.filter((b) => b.status === 'occupied').length;
        return {
          ...rm,
          beds: updatedBeds,
          occupiedBeds: occupiedCount,
        };
      }
      return rm;
    });

    setBlockRooms(updatedRooms);
    saveToStorage(STORAGE_KEYS.BLOCK_ROOMS, updatedRooms);
  };

  const vacateBed = (roomNumber: string, bedNumber: number) => {
    const updatedRooms = blockRooms.map((rm) => {
      if (rm.roomNumber === roomNumber) {
        const updatedBeds = rm.beds.map((b) => {
          if (b.bedNumber === bedNumber) {
            return {
              bedNumber: b.bedNumber,
              status: 'available' as const,
            };
          }
          return b;
        });
        const occupiedCount = updatedBeds.filter((b) => b.status === 'occupied').length;
        return {
          ...rm,
          beds: updatedBeds,
          occupiedBeds: occupiedCount,
        };
      }
      return rm;
    });

    setBlockRooms(updatedRooms);
    saveToStorage(STORAGE_KEYS.BLOCK_ROOMS, updatedRooms);
  };

  const toggleRoomMaintenance = (roomNumber: string) => {
    const updatedRooms = blockRooms.map((rm) => {
      if (rm.roomNumber === roomNumber) {
        const nextState = !rm.isUnderMaintenance;
        const updatedBeds = rm.beds.map((b) => {
          if (b.status === 'occupied') return b;
          return {
            ...b,
            status: (nextState ? 'maintenance' : 'available') as 'maintenance' | 'available',
          };
        });
        return {
          ...rm,
          isUnderMaintenance: nextState,
          beds: updatedBeds,
        };
      }
      return rm;
    });

    setBlockRooms(updatedRooms);
    saveToStorage(STORAGE_KEYS.BLOCK_ROOMS, updatedRooms);
  };

  // Phase 2 Maintenance Actions
  const startMaintenanceTask = (complaintId: string, notes?: string) => {
    const now = new Date().toISOString();
    const updated = complaints.map((c) => {
      if (c.id === complaintId) {
        return {
          ...c,
          status: 'In Progress' as const,
          updatedAt: now,
          timeline: [
            ...c.timeline,
            {
              status: 'In Progress' as const,
              timestamp: now,
              note: notes || 'Technician started physical inspection & diagnostic repair on site.',
            },
          ],
        };
      }
      return c;
    });

    setComplaints(updated);
    saveToStorage(STORAGE_KEYS.COMPLAINTS, updated);

    // Notify student
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Technician Working On Issue',
      message: `Work in progress on ticket ${complaintId}. Technician is repairing the facility.`,
      timestamp: now,
      type: 'maintenance',
      isRead: false,
      link: '/maintenance',
    };
    const updatedNotifs = [notif, ...notifications];
    setNotifications(updatedNotifs);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updatedNotifs);
  };

  const resolveMaintenanceTask = (complaintId: string, resolutionNotes: string) => {
    const now = new Date().toISOString();
    const updated = complaints.map((c) => {
      if (c.id === complaintId) {
        return {
          ...c,
          status: 'Resolved' as const,
          updatedAt: now,
          resolvedAt: now,
          resolutionNotes,
          timeline: [
            ...c.timeline,
            {
              status: 'Resolved' as const,
              timestamp: now,
              note: resolutionNotes || 'Repair complete and certified functional by maintenance staff.',
            },
          ],
        };
      }
      return c;
    });

    setComplaints(updated);
    saveToStorage(STORAGE_KEYS.COMPLAINTS, updated);

    // Notify student
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Maintenance Issue Resolved',
      message: `Ticket ${complaintId} marked resolved. Note: ${resolutionNotes}`,
      timestamp: now,
      type: 'maintenance',
      isRead: false,
      link: '/maintenance',
    };
    const updatedNotifs = [notif, ...notifications];
    setNotifications(updatedNotifs);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updatedNotifs);
  };

  // Phase 2 Security Actions
  const recordGateMovement = (entry: {
    personName: string;
    identifier: string;
    type: GateMovementType;
    roomNumber?: string;
    remarks?: string;
  }) => {
    const newEntry: GateLogEntry = {
      id: `gate-${Date.now()}`,
      personName: entry.personName,
      identifier: entry.identifier,
      type: entry.type,
      roomNumber: entry.roomNumber,
      timestamp: new Date().toISOString(),
      guardName: 'Officer S. Verma (Main Gate 1)',
      remarks: entry.remarks || 'Turnstile biometric / QR authentication verified',
    };

    const updated = [newEntry, ...gateLogs];
    setGateLogs(updated);
    saveToStorage(STORAGE_KEYS.GATE_LOGS, updated);
  };

  const approveVisitor = (visitorId: string) => {
    const updated = visitors.map((v) => (v.id === visitorId ? { ...v, status: 'Approved' as const } : v));
    setVisitors(updated);
    saveToStorage(STORAGE_KEYS.VISITORS, updated);
  };

  const checkInVisitor = (visitorId: string) => {
    const now = new Date().toISOString();
    let visObj: VisitorRequest | undefined;
    const updated = visitors.map((v) => {
      if (v.id === visitorId) {
        visObj = { ...v, status: 'Inside' as const, checkedInAt: now };
        return visObj;
      }
      return v;
    });

    setVisitors(updated);
    saveToStorage(STORAGE_KEYS.VISITORS, updated);

    if (visObj) {
      recordGateMovement({
        personName: visObj.visitorName,
        identifier: visObj.passCode,
        type: 'visitor_entry',
        roomNumber: visObj.roomNumber,
        remarks: `Visitor Entry (${visObj.relation}) to visit student ${visObj.studentName}`,
      });
    }
  };

  const checkOutVisitor = (visitorId: string) => {
    const now = new Date().toISOString();
    let visObj: VisitorRequest | undefined;
    const updated = visitors.map((v) => {
      if (v.id === visitorId) {
        visObj = { ...v, status: 'Completed' as const, checkedOutAt: now };
        return visObj;
      }
      return v;
    });

    setVisitors(updated);
    saveToStorage(STORAGE_KEYS.VISITORS, updated);

    if (visObj) {
      recordGateMovement({
        personName: visObj.visitorName,
        identifier: visObj.passCode,
        type: 'visitor_exit',
        roomNumber: visObj.roomNumber,
        remarks: `Visitor Exit. Pass surrendered at turnstile checkpoint.`,
      });
    }
  };

  const recordStudentExit = (studentId: string, studentName: string, roomNumber: string, passCode?: string) => {
    recordGateMovement({
      personName: studentName,
      identifier: passCode || studentId,
      type: 'student_exit',
      roomNumber,
      remarks: passCode ? `Outstation departure with pass code ${passCode}` : 'Campus exit recorded',
    });
  };

  const recordStudentEntry = (studentId: string, studentName: string, roomNumber: string) => {
    recordGateMovement({
      personName: studentName,
      identifier: studentId,
      type: 'student_entry',
      roomNumber,
      remarks: 'Student return through biometric turnstile scanner',
    });
  };

  // Reset to default seed data
  const resetDemoData = () => {
    resetAllStorage();
    setProfile(initialStudent as StudentProfile);
    setRoom(initialRoom as RoomDetails);
    setComplaints(initialComplaints as Complaint[]);
    setLeaves(initialLeaves as LeaveRequest[]);
    setMessState(
      initialMess as unknown as {
        todayMeals: MealInfo[];
        weeklyMenu: WeeklyMenuDay[];
        suggestions: MenuSuggestion[];
      }
    );
    setAnnouncements(initialAnnouncements as Announcement[]);
    setNotifications(initialNotifications as NotificationItem[]);
    setVisitors(initialVisitors as VisitorRequest[]);
    setBlockRooms(initialBlockRooms as BlockRoom[]);
    setGateLogs(initialGateLogs as GateLogEntry[]);
  };

  return (
    <DataContext.Provider
      value={{
        profile,
        room,
        complaints,
        leaves,
        todayMeals: messState.todayMeals,
        weeklyMenu: messState.weeklyMenu,
        suggestions: messState.suggestions,
        announcements,
        notifications,
        visitors,
        blockRooms,
        gateLogs,
        unreadNotificationCount,
        addComplaint,
        cancelComplaint,
        applyLeave,
        rateMeal,
        suggestDish,
        voteSuggestion,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotification,
        clearAllNotifications,
        updateProfile,
        requestRoomChange,
        requestVisitorPass,
        assignComplaint,
        reviewLeave,
        createAnnouncement,
        allocateBed,
        vacateBed,
        toggleRoomMaintenance,
        startMaintenanceTask,
        resolveMaintenanceTask,
        recordGateMovement,
        approveVisitor,
        checkInVisitor,
        checkOutVisitor,
        recordStudentExit,
        recordStudentEntry,
        resetDemoData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export function useData(): DataContextType {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
