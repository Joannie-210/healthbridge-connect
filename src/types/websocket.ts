// Message types matching Spring Boot backend
export enum MessageType {
  JOIN = 'JOIN',
  LEAVE = 'LEAVE',
  PING = 'PING',
  SYSTEM = 'SYSTEM',
  ROOM_PRESENCE = 'ROOM_PRESENCE',
  ONLINE_USERS = 'ONLINE_USERS',
}

// User presence status
export type UserStatus = 'online' | 'away' | 'offline';

// User DTO
export interface User {
  id: string;
  username: string;
  status: UserStatus;
  roomId: string | null;
  lastSeen: string;
}

// Room DTO
export interface Room {
  id: string;
  name: string;
  userCount: number;
  users: User[];
}

// WebSocket message DTOs
export interface WebSocketMessage {
  type: MessageType;
  payload: unknown;
  timestamp: string;
}

export interface JoinPayload {
  username: string;
  roomId: string;
}

export interface LeavePayload {
  username: string;
  roomId: string;
}

export interface PingPayload {
  username: string;
}

export interface SystemEventPayload {
  message: string;
  roomId?: string;
  eventType: 'join' | 'leave' | 'system';
}

export interface RoomPresencePayload {
  roomId: string;
  users: User[];
}

export interface OnlineUsersPayload {
  users: User[];
  totalCount: number;
}

// System event for UI display
export interface SystemEvent {
  id: string;
  message: string;
  timestamp: string;
  eventType: 'join' | 'leave' | 'system';
  roomId?: string;
}

// Connection state
export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error';
