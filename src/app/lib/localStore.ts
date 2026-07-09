import { Event } from '@/app/data';

export type StoredUser = {
  username: string;
  password: string;
  role: 'user' | 'admin';
  likedEventIds: string[];
};

export type StoredEvent = Omit<Event, 'id'> & {
  id: string;
};

const usersKey = 'tenterden-users';
const sessionKey = 'tenterden-current-user';
const eventsKey = 'tenterden-custom-events';

const adminUser: StoredUser = {
  username: 'admin',
  password: 'admin123',
  role: 'admin',
  likedEventIds: [],
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getUsers(): StoredUser[] {
  const users = readJson<StoredUser[]>(usersKey, []);

  if (!users.some((user) => user.username === adminUser.username)) {
    return [adminUser, ...users];
  }

  return users;
}

export function saveUsers(users: StoredUser[]): void {
  writeJson(usersKey, users);
}

export function getCurrentUser(): StoredUser | null {
  const username = readJson<string | null>(sessionKey, null);

  if (!username) {
    return null;
  }

  return getUsers().find((user) => user.username === username) ?? null;
}

export function setCurrentUser(username: string): void {
  writeJson(sessionKey, username);
}

export function clearCurrentUser(): void {
  window.localStorage.removeItem(sessionKey);
}

export function loginUser(username: string, password: string): StoredUser | null {
  const user = getUsers().find((item) => item.username === username && item.password === password);

  if (!user) {
    return null;
  }

  setCurrentUser(user.username);
  return user;
}

export function registerUser(username: string, password: string): StoredUser | null {
  const users = getUsers();

  if (users.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
    return null;
  }

  const user: StoredUser = {
    username,
    password,
    role: 'user',
    likedEventIds: [],
  };

  saveUsers([...users, user]);
  setCurrentUser(username);
  return user;
}

export function updateLikedEvents(username: string, likedEventIds: string[]): void {
  const users = getUsers().map((user) => (
    user.username === username ? { ...user, likedEventIds } : user
  ));

  saveUsers(users);
}

export function getCustomEvents(): StoredEvent[] {
  return readJson<StoredEvent[]>(eventsKey, []);
}

export function addCustomEvent(event: Omit<StoredEvent, 'id'>): StoredEvent {
  const newEvent: StoredEvent = {
    ...event,
    id: `custom-${Date.now()}`,
  };

  writeJson(eventsKey, [...getCustomEvents(), newEvent]);
  return newEvent;
}
