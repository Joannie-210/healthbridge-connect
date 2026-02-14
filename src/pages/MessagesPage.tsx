import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { mockMessages } from '@/data/mockData';
import { Send, Circle } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function MessagesPage() {
  const { user } = useAuth();
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // Get unique contacts
  const contacts = Array.from(
    new Map(
      mockMessages.map((m) => {
        const isMe = m.senderId === user?.id;
        const contactId = isMe ? m.receiverId : m.senderId;
        const contactName = isMe ? m.receiverName : m.senderName;
        const unread = !isMe && !m.read;
        return [contactId, { id: contactId, name: contactName, unread }];
      })
    ).values()
  );

  const conversation = mockMessages.filter(
    (m) =>
      (m.senderId === selectedContact && m.receiverId === user?.id) ||
      (m.senderId === user?.id && m.receiverId === selectedContact)
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground text-sm">Secure doctor-patient communication</p>
        </div>

        <div className="flex gap-4 h-[calc(100vh-240px)] bg-card rounded-xl border shadow-card overflow-hidden">
          {/* Contacts */}
          <div className="w-72 border-r flex flex-col shrink-0">
            <div className="p-3 border-b">
              <Input placeholder="Search contacts..." className="text-sm" />
            </div>
            <div className="flex-1 overflow-y-auto">
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact.id)}
                  className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors flex items-center gap-3 ${
                    selectedContact === contact.id ? 'bg-muted/70' : ''
                  }`}
                >
                  <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-xs shrink-0">
                    {contact.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{contact.name}</p>
                  </div>
                  {contact.unread && <Circle className="w-2.5 h-2.5 fill-primary text-primary shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="flex-1 flex flex-col">
            {selectedContact ? (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {conversation.map((msg) => {
                    const isMe = msg.senderId === user?.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                            isMe
                              ? 'gradient-primary text-primary-foreground rounded-br-md'
                              : 'bg-muted text-foreground rounded-bl-md'
                          }`}
                        >
                          <p>{msg.content}</p>
                          <p className={`text-[10px] mt-1 ${isMe ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-3 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <button className="p-2.5 rounded-lg gradient-primary text-primary-foreground hover:opacity-90 transition-opacity">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                Select a contact to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
