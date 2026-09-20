import studentData from '../data/students.json';
import roomData from '../data/rooms.json';
import complaintsData from '../data/complaints.json';
import leavesData from '../data/leaves.json';
import messData from '../data/mess.json';
import announcementsData from '../data/announcements.json';
import notificationsData from '../data/notifications.json';
import blockRoomsData from '../data/blockRooms.json';
import gateLogsData from '../data/gateLogs.json';
import visitorsData from '../data/visitors.json';
import usersData from '../data/users.json';

export const STORAGE_KEYS = {
  USER: 'hostelhub_user',
  PROFILE: 'hostelhub_profile',
  ROOM: 'hostelhub_room',
  COMPLAINTS: 'hostelhub_complaints',
  LEAVES: 'hostelhub_leaves',
  MESS: 'hostelhub_mess',
  ANNOUNCEMENTS: 'hostelhub_announcements',
  NOTIFICATIONS: 'hostelhub_notifications',
  SETTINGS: 'hostelhub_settings',
  VISITORS: 'hostelhub_visitors',
  BLOCK_ROOMS: 'hostelhub_block_rooms',
  GATE_LOGS: 'hostelhub_gate_logs',
};

const DEFAULT_SETTINGS = {
  theme: 'system',
  notifications: {
    maintenance: true,
    leaves: true,
    announcements: true,
    mess: true,
  },
};

export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item || item === 'undefined' || item === 'null') {
      if (defaultValue !== null && defaultValue !== undefined) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
      }
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`Error reading key "${key}" from localStorage, falling back to default:`, error);
    try {
      if (defaultValue !== null && defaultValue !== undefined) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
      }
    } catch {}
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving key ${key} to localStorage:`, error);
  }
}

export function initializeStorage(): void {
  if (!localStorage.getItem(STORAGE_KEYS.PROFILE)) {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(studentData));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ROOM)) {
    localStorage.setItem(STORAGE_KEYS.ROOM, JSON.stringify(roomData));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COMPLAINTS)) {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaintsData));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LEAVES)) {
    localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leavesData));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MESS)) {
    localStorage.setItem(STORAGE_KEYS.MESS, JSON.stringify(messData));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcementsData));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notificationsData));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.VISITORS)) {
    localStorage.setItem(STORAGE_KEYS.VISITORS, JSON.stringify(visitorsData));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BLOCK_ROOMS)) {
    localStorage.setItem(STORAGE_KEYS.BLOCK_ROOMS, JSON.stringify(blockRoomsData));
  }
  if (!localStorage.getItem(STORAGE_KEYS.GATE_LOGS)) {
    localStorage.setItem(STORAGE_KEYS.GATE_LOGS, JSON.stringify(gateLogsData));
  }

  // Automatically migrate legacy avatars to authentic Indian avatars
  try {
    const rawProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (rawProfile) {
      const parsed = JSON.parse(rawProfile);
      if (parsed.avatar && parsed.avatar.includes('unsplash.com')) {
        parsed.avatar = '/avatars/aravind_kumar.jpg';
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(parsed));
      }
    }
    const rawUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (rawUser) {
      const parsedUser = JSON.parse(rawUser);
      if (parsedUser.avatar && parsedUser.avatar.includes('unsplash.com')) {
        const matched = usersData.find((u) => u.role === parsedUser.role || u.email === parsedUser.email);
        if (matched) {
          parsedUser.avatar = matched.avatar;
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(parsedUser));
        } else {
          parsedUser.avatar = '/avatars/aravind_kumar.jpg';
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(parsedUser));
        }
      }
    }
  } catch {}
}

export function resetAllStorage(): void {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(studentData));
  localStorage.setItem(STORAGE_KEYS.ROOM, JSON.stringify(roomData));
  localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaintsData));
  localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leavesData));
  localStorage.setItem(STORAGE_KEYS.MESS, JSON.stringify(messData));
  localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcementsData));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notificationsData));
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  localStorage.setItem(STORAGE_KEYS.VISITORS, JSON.stringify(visitorsData));
  localStorage.setItem(STORAGE_KEYS.BLOCK_ROOMS, JSON.stringify(blockRoomsData));
  localStorage.setItem(STORAGE_KEYS.GATE_LOGS, JSON.stringify(gateLogsData));
}
