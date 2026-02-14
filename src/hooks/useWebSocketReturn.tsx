import { useState, useEffect, useCallback, useRef } from 'react';
import {
  MessageType,
  WebSocketMessage,
  User,
  Room,
  SystemEvent,
  ConnectionState,
  JoinPayload,
  OnlineUsersPayload,
  RoomPresencePayload,
  SystemEventPayload,
} from '@/types/websocket';

// Configure your Spring Boot WebSocket server URL here
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws/presence';

// Enable mock mode for testing UI without backend
const MOCK_MODE = import.meta.env.VITE_MOCK_WS === 'true' || true; // Set to true for testing

// Heartbeat interval in milliseconds
const HEARTBEAT_INTERVAL = 30000;

interface UseWebSocketReturn {
  // Connection state
  connectionState: ConnectionState;
  isConnected: boolean;
  
  // Current user
  currentUser: User | null;
  
  // Data
  onlineUsers: User[];
  rooms: Room[];
  currentRoom: Room | null;
  systemEvents: SystemEvent[];
  
  // Actions
  joinRoom: (username: string, roomId: string) => void;
  leaveRoom: () => void;
  requestOnlineUsers: () => void;
  requestRoomPresence: (roomId: string) => void;
  connect: () => void;
  disconnect: () => void;
}

// Mock data for testing
const mockUsers: User[] = [
  { id: 'user-1', username: 'Alice', status: 'online', roomId: 'general', lastSeen: new Date().toISOString() },
  { id: 'user-2', username: 'Bob', status: 'online', roomId: 'general', lastSeen: new Date().toISOString() },
  { id: 'user-3', username: 'Charlie', status: 'away', roomId: 'dev-team', lastSeen: new Date(Date.now() - 300000).toISOString() },
  { id: 'user-4', username: 'Diana', status: 'online', roomId: 'dev-team', lastSeen: new Date().toISOString() },
  { id: 'user-5', username: 'Eve', status: 'online', roomId: 'design', lastSeen: new Date().toISOString() },
];

const mockRooms: Room[] = [
  { id: 'general', name: 'General', userCount: 2, users: mockUsers.filter(u => u.roomId === 'general') },
  { id: 'dev-team', name: 'Dev Team', userCount: 2, users: mockUsers.filter(u => u.roomId === 'dev-team') },
  { id: 'design', name: 'Design', userCount: 1, users: mockUsers.filter(u => u.roomId === 'design') },
];

const mockSystemEvents: SystemEvent[] = [
  { id: '1', message: 'Alice joined the room', timestamp: new Date(Date.now() - 60000).toISOString(), eventType: 'join', roomId: 'general' },
  { id: '2', message: 'Bob joined the room', timestamp: new Date(Date.now() - 45000).toISOString(), eventType: 'join', roomId: 'general' },
  { id: '3', message: 'System initialized', timestamp: new Date(Date.now() - 30000).toISOString(), eventType: 'system' },
  { id: '4', message: 'Charlie went away', timestamp: new Date(Date.now() - 15000).toISOString(), eventType: 'system', roomId: 'dev-team' },
];

export function useWebSocket(): UseWebSocketReturn {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [systemEvents, setSystemEvents] = useState<SystemEvent[]>([]);
  
  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatRef = useRef<number | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  // Add system event
  const addSystemEvent = useCallback((event: Omit<SystemEvent, 'id'>) => {
    const newEvent: SystemEvent = {
      ...event,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setSystemEvents((prev) => [newEvent, ...prev].slice(0, 50)); // Keep last 50 events
  }, []);

  // Send WebSocket message
  const sendMessage = useCallback((type: MessageType, payload: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type,
        payload,
        timestamp: new Date().toISOString(),
      };
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  // Start heartbeat
  const startHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
    }
    heartbeatRef.current = window.setInterval(() => {
      if (currentUser) {
        sendMessage(MessageType.PING, { username: currentUser.username });
      }
    }, HEARTBEAT_INTERVAL);
  }, [currentUser, sendMessage]);

  // Stop heartbeat
  const stopHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
  }, []);

  // Handle incoming messages
  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      
      switch (message.type) {
        case MessageType.SYSTEM: {
          const payload = message.payload as SystemEventPayload;
          addSystemEvent({
            message: payload.message,
            timestamp: message.timestamp,
            eventType: payload.eventType,
            roomId: payload.roomId,
          });
          break;
        }
        
        case MessageType.ONLINE_USERS: {
          const payload = message.payload as OnlineUsersPayload;
          setOnlineUsers(payload.users);
          
          // Update rooms based on users
          const roomMap = new Map<string, Room>();
          payload.users.forEach((user) => {
            if (user.roomId) {
              const existing = roomMap.get(user.roomId);
              if (existing) {
                existing.users.push(user);
                existing.userCount = existing.users.length;
              } else {
                roomMap.set(user.roomId, {
                  id: user.roomId,
                  name: user.roomId,
                  userCount: 1,
                  users: [user],
                });
              }
            }
          });
          setRooms(Array.from(roomMap.values()));
          break;
        }
        
        case MessageType.ROOM_PRESENCE: {
          const payload = message.payload as RoomPresencePayload;
          setCurrentRoom({
            id: payload.roomId,
            name: payload.roomId,
            userCount: payload.users.length,
            users: payload.users,
          });
          break;
        }
        
        case MessageType.JOIN: {
          // User successfully joined
          const payload = message.payload as JoinPayload;
          setCurrentUser({
            id: `user-${Date.now()}`,
            username: payload.username,
            status: 'online',
            roomId: payload.roomId,
            lastSeen: new Date().toISOString(),
          });
          break;
        }
        
        case MessageType.LEAVE: {
          setCurrentUser(null);
          setCurrentRoom(null);
          break;
        }
        
        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }, [addSystemEvent]);

  // Mock connect
  const mockConnect = useCallback(() => {
    setConnectionState('connecting');
    
    // Simulate connection delay
    setTimeout(() => {
      setConnectionState('connected');
      setOnlineUsers(mockUsers);
      setRooms(mockRooms);
      setSystemEvents(mockSystemEvents);
      
      addSystemEvent({
        message: 'Connected to presence server (Mock Mode)',
        timestamp: new Date().toISOString(),
        eventType: 'system',
      });
    }, 500);
  }, [addSystemEvent]);

  // Mock disconnect
  const mockDisconnect = useCallback(() => {
    setConnectionState('disconnected');
    setCurrentUser(null);
    setCurrentRoom(null);
    setOnlineUsers([]);
    setRooms([]);
    
    addSystemEvent({
      message: 'Disconnected from presence server',
      timestamp: new Date().toISOString(),
      eventType: 'system',
    });
  }, [addSystemEvent]);

  // Mock join room
  const mockJoinRoom = useCallback((username: string, roomId: string) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      username,
      status: 'online',
      roomId,
      lastSeen: new Date().toISOString(),
    };
    
    setCurrentUser(newUser);
    setOnlineUsers(prev => [...prev, newUser]);
    
    // Find or create room
    const existingRoom = mockRooms.find(r => r.id === roomId);
    if (existingRoom) {
      const updatedRoom = {
        ...existingRoom,
        users: [...existingRoom.users, newUser],
        userCount: existingRoom.userCount + 1,
      };
      setCurrentRoom(updatedRoom);
      setRooms(prev => prev.map(r => r.id === roomId ? updatedRoom : r));
    } else {
      const newRoom: Room = {
        id: roomId,
        name: roomId,
        userCount: 1,
        users: [newUser],
      };
      setCurrentRoom(newRoom);
      setRooms(prev => [...prev, newRoom]);
    }
    
    addSystemEvent({
      message: `${username} joined ${roomId}`,
      timestamp: new Date().toISOString(),
      eventType: 'join',
      roomId,
    });
  }, [addSystemEvent]);

  // Mock leave room
  const mockLeaveRoom = useCallback(() => {
    if (currentUser && currentRoom) {
      addSystemEvent({
        message: `${currentUser.username} left ${currentRoom.name}`,
        timestamp: new Date().toISOString(),
        eventType: 'leave',
        roomId: currentRoom.id,
      });
      
      setOnlineUsers(prev => prev.filter(u => u.id !== currentUser.id));
      setRooms(prev => prev.map(r => {
        if (r.id === currentRoom.id) {
          return {
            ...r,
            users: r.users.filter(u => u.id !== currentUser.id),
            userCount: r.userCount - 1,
          };
        }
        return r;
      }).filter(r => r.userCount > 0));
    }
    
    setCurrentUser(null);
    setCurrentRoom(null);
  }, [currentUser, currentRoom, addSystemEvent]);

  // Mock request room presence
  const mockRequestRoomPresence = useCallback((roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      setCurrentRoom(room);
    }
  }, [rooms]);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (MOCK_MODE) {
      mockConnect();
      return;
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionState('connecting');
    
    try {
      wsRef.current = new WebSocket(WS_URL);
      
      wsRef.current.onopen = () => {
        setConnectionState('connected');
        addSystemEvent({
          message: 'Connected to presence server',
          timestamp: new Date().toISOString(),
          eventType: 'system',
        });
        
        // Request initial data
        sendMessage(MessageType.ONLINE_USERS, {});
      };
      
      wsRef.current.onmessage = handleMessage;
      
      wsRef.current.onclose = () => {
        setConnectionState('disconnected');
        stopHeartbeat();
        
        addSystemEvent({
          message: 'Disconnected from presence server',
          timestamp: new Date().toISOString(),
          eventType: 'system',
        });
        
        // Attempt reconnection after 3 seconds
        reconnectTimeoutRef.current = window.setTimeout(() => {
          if (currentUser) {
            connect();
          }
        }, 3000);
      };
      
      wsRef.current.onerror = () => {
        setConnectionState('error');
        addSystemEvent({
          message: 'Connection error occurred',
          timestamp: new Date().toISOString(),
          eventType: 'system',
        });
      };
    } catch (error) {
      setConnectionState('error');
      console.error('Failed to connect:', error);
    }
  }, [MOCK_MODE, mockConnect, handleMessage, sendMessage, stopHeartbeat, addSystemEvent, currentUser]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (MOCK_MODE) {
      mockDisconnect();
      return;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    stopHeartbeat();
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setConnectionState('disconnected');
    setCurrentUser(null);
    setCurrentRoom(null);
  }, [MOCK_MODE, mockDisconnect, stopHeartbeat]);

  // Join a room
  const joinRoom = useCallback((username: string, roomId: string) => {
    if (MOCK_MODE) {
      if (connectionState !== 'connected') {
        mockConnect();
        setTimeout(() => mockJoinRoom(username, roomId), 600);
      } else {
        mockJoinRoom(username, roomId);
      }
      return;
    }

    if (connectionState !== 'connected') {
      connect();
    }
    
    sendMessage(MessageType.JOIN, { username, roomId });
    startHeartbeat();
  }, [MOCK_MODE, connectionState, mockConnect, mockJoinRoom, connect, sendMessage, startHeartbeat]);

  // Leave current room
  const leaveRoom = useCallback(() => {
    if (MOCK_MODE) {
      mockLeaveRoom();
      return;
    }

    if (currentUser && currentRoom) {
      sendMessage(MessageType.LEAVE, {
        username: currentUser.username,
        roomId: currentRoom.id,
      });
    }
    stopHeartbeat();
    setCurrentUser(null);
    setCurrentRoom(null);
  }, [MOCK_MODE, mockLeaveRoom, currentUser, currentRoom, sendMessage, stopHeartbeat]);

  // Request online users
  const requestOnlineUsers = useCallback(() => {
    if (MOCK_MODE) return;
    sendMessage(MessageType.ONLINE_USERS, {});
  }, [MOCK_MODE, sendMessage]);

  // Request room presence
  const requestRoomPresence = useCallback((roomId: string) => {
    if (MOCK_MODE) {
      mockRequestRoomPresence(roomId);
      return;
    }
    sendMessage(MessageType.ROOM_PRESENCE, { roomId });
  }, [MOCK_MODE, mockRequestRoomPresence, sendMessage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // Poll for updates while connected (only in real mode)
  useEffect(() => {
    if (MOCK_MODE) return;
    
    let pollInterval: number | null = null;
    
    if (connectionState === 'connected') {
      pollInterval = window.setInterval(() => {
        requestOnlineUsers();
        if (currentRoom) {
          requestRoomPresence(currentRoom.id);
        }
      }, 5000);
    }
    
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [MOCK_MODE, connectionState, currentRoom, requestOnlineUsers, requestRoomPresence]);

  return {
    connectionState,
    isConnected: connectionState === 'connected',
    currentUser,
    onlineUsers,
    rooms,
    currentRoom,
    systemEvents,
    joinRoom,
    leaveRoom,
    requestOnlineUsers,
    requestRoomPresence,
    connect,
    disconnect,
  };
}
