import { Radio, Zap } from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocketReturn';
import { ConnectionStatus } from '@/components/ConnectionState';
import { JoinRoomForm } from '@/components/JoinRoomFormProps';
import { OnlineUsersList } from '@/components/OnlineUsersListProps';
import { RoomList } from '@/components/RoomList';
import { RoomDetails } from '@/components/RoomDetails';
import { SystemEvents } from '@/components/SystemEventsProps';

const Index = () => {
  const {
    connectionState,
    isConnected,
    currentUser,
    onlineUsers,
    rooms,
    currentRoom,
    systemEvents,
    joinRoom,
    leaveRoom,
    requestRoomPresence,
    connect,
    disconnect,
  } = useWebSocket();

  const handleRoomClick = (roomId: string) => {
    requestRoomPresence(roomId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Radio className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  <span className="text-gradient">Presence</span>
                  <span className="text-foreground">Hub</span>
                </h1>
                <p className="text-xs text-muted-foreground">Real-Time Room Management</p>
              </div>
            </div>
            
            <ConnectionStatus
              state={connectionState}
              onConnect={connect}
              onDisconnect={disconnect}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{onlineUsers.length}</p>
                <p className="text-xs text-muted-foreground">Online Users</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Radio className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rooms.length}</p>
                <p className="text-xs text-muted-foreground">Active Rooms</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-status-online/10 flex items-center justify-center">
                <span className="status-dot status-dot-online" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {currentUser ? '1' : '0'}
                </p>
                <p className="text-xs text-muted-foreground">Your Sessions</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <span className="text-lg">📡</span>
              </div>
              <div>
                <p className="text-2xl font-bold">{systemEvents.length}</p>
                <p className="text-xs text-muted-foreground">Events</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <JoinRoomForm
              onJoin={joinRoom}
              isConnected={isConnected}
              isJoined={!!currentUser}
              onLeave={leaveRoom}
              currentUsername={currentUser?.username}
              currentRoom={currentRoom?.name}
            />
            
            <RoomList
              rooms={rooms}
              currentRoomId={currentRoom?.id}
              onRoomClick={handleRoomClick}
            />
          </div>

          {/* Center Content */}
          <div className="lg:col-span-5">
            <RoomDetails
              room={currentRoom}
              currentUsername={currentUser?.username}
            />
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <OnlineUsersList
              users={onlineUsers}
              currentUsername={currentUser?.username}
            />
            
            <SystemEvents events={systemEvents} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>
              APTECH Port Harcourt • Backend Engineering (Java / Spring Boot)
            </p>
            <p className="font-mono text-xs">
              WebSocket Presence System v1.0
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
