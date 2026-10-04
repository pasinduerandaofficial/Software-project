import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { messageService } from '../../services/messageService';
import { MessageSquare, X, Send, User, ChevronLeft } from 'lucide-react';

export default function AdminChatbox({ isOpen, onClose }) {
  const { user, selectedDepartment } = useAuth();
  
  const [conversations, setConversations] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [showContacts, setShowContacts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Load contacts when chatbox opens
  useEffect(() => {
    if (isOpen && !selectedContact && !showContacts) {
      loadConversations();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && showContacts && allContacts.length === 0) {
      loadAllContacts();
    }
  }, [isOpen, showContacts]);

  // Polling for messages when a thread is active
  useEffect(() => {
    let interval;
    if (isOpen && selectedContact) {
      loadThread(selectedContact.id); // initial load
      interval = setInterval(() => {
        loadThread(selectedContact.id, true);
      }, 5000); // Poll every 5s
    }
    return () => clearInterval(interval);
  }, [isOpen, selectedContact]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const res = await messageService.getConversations();
      if (res.success) setConversations(res.conversations);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadAllContacts = async () => {
    setLoading(true);
    try {
      const res = await messageService.getContacts();
      if (res.success) setAllContacts(res.contacts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (c) => {
    if (c.role === 'admin' && !c.department) return 'System Admin';
    if (c.role === 'admin') return `${c.department} Admin`;
    if (c.role === 'lecturer') return 'Lecturer';
    return 'Student';
  };

  const getRoleColor = (c) => {
    if (c.role === 'admin' && !c.department) return 'bg-red-500/20 text-red-400 border-red-500/20';
    if (c.role === 'admin' && c.department === 'SUGEO') return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20';
    if (c.role === 'admin' && c.department === 'RS_GIS') return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/20';
    if (c.role === 'lecturer') return 'bg-purple-500/20 text-purple-400 border-purple-500/20';
    return 'bg-neutral-800 text-neutral-400 border-neutral-700';
  };

  const loadThread = async (otherUserId, silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await messageService.getThread(otherUserId);
      if (res.success) {
        setMessages(res.messages);
        window.dispatchEvent(new Event('messagesRead'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;

    const text = newMessage;
    setNewMessage('');
    
    // Optimistic update
    const tempMsgId = Date.now();
    const tempMsg = {
      id: tempMsgId,
      sender_id: user.id,
      receiver_id: selectedContact.id,
      message_text: text,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      await messageService.sendMessage(selectedContact.id, text);
      // Background poll will catch it next tick or we can force refresh
      loadThread(selectedContact.id, true);
    } catch (err) {
      console.error('Failed to send message', err);
      // Revert optimistic update
      setMessages(prev => prev.filter(m => m.id !== tempMsgId));
      if (err.response && err.response.status === 403) {
        alert(err.response.data.message || 'You are not permitted to send this message.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] max-h-[80vh] bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 shadow-2xl shadow-black/50 rounded-2xl flex flex-col z-50 overflow-hidden font-sans">
      
      {/* Header */}
      <div className="px-4 py-3 border-b border-neutral-800 flex justify-between items-center bg-neutral-950/50">
        <div className="flex items-center gap-2">
          {(selectedContact || showContacts) && (
            <button onClick={() => { setSelectedContact(null); setShowContacts(false); loadConversations(); }} className="text-neutral-400 hover:text-white mr-1 transition-colors">
              <ChevronLeft size={20} />
            </button>
          )}
          <MessageSquare size={18} className="text-orange-500" />
          <h3 className="font-bold text-neutral-200">
            {selectedContact ? selectedContact.name : showContacts ? 'New Message' : 'Messages'}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {!selectedContact && !showContacts && (
            <button onClick={() => setShowContacts(true)} className="text-neutral-400 hover:text-orange-400 transition-colors bg-neutral-900 rounded-lg p-1 border border-neutral-800 hover:bg-neutral-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
          )}
          <button onClick={onClose} className="text-neutral-400 hover:text-red-400 transition-colors ml-2">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative bg-neutral-950/20">
        
        {loading && !selectedContact && (
          <div className="absolute inset-0 flex items-center justify-center text-neutral-500">
            <span className="animate-pulse">Loading...</span>
          </div>
        )}

        {!selectedContact ? (
          showContacts ? (
            /* Contact List (All Users) */
            <div className="flex-1 overflow-y-auto flex flex-col p-2">
              <div className="px-2 pb-2 sticky top-0 bg-neutral-950/20 z-10 pt-2 border-b border-neutral-800/50 mb-2">
                <input
                  type="text"
                  placeholder="Search name, reg number or role..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              {allContacts
                .filter(c => 
                  c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  c.reg_no.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  getRoleLabel(c).toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(c => (
                <button
                  key={c.id}
                  onClick={() => { setSelectedContact(c); setShowContacts(false); }}
                  className="w-full text-left p-3 hover:bg-neutral-800/50 rounded-xl transition-all flex items-center gap-3 border border-transparent hover:border-neutral-700/50 group"
                >
                  <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/10 group-hover:text-orange-400 transition-colors">
                    <User size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-semibold text-neutral-200 truncate">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`px-1.5 py-0.5 rounded-md border text-[9px] font-bold uppercase tracking-wider ${getRoleColor(c)}`}>
                        {getRoleLabel(c)}
                      </span>
                      {c.role !== 'admin' && (
                        <span className="text-neutral-500 truncate">{c.reg_no}</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* Conversations List (Recent Chats) */
            <div className="flex-1 overflow-y-auto p-2">
              {conversations.length === 0 && !loading && (
                <div className="text-center p-6 text-neutral-500 text-sm">
                  No conversations yet. Click the + icon to start chatting.
                </div>
              )}
              {conversations.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedContact(c)}
                  className="w-full text-left p-3 hover:bg-neutral-800/50 rounded-xl transition-all flex items-center gap-3 border border-transparent hover:border-neutral-700/50 group"
                >
                  <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/10 group-hover:text-orange-400 transition-colors">
                    <User size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-semibold text-neutral-200 truncate">{c.name}</span>
                      {c.unread_count > 0 && (
                        <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {c.unread_count}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`px-1.5 py-0.5 rounded-md border text-[9px] font-bold uppercase tracking-wider ${getRoleColor(c)}`}>
                        {getRoleLabel(c)}
                      </span>
                      <span className="text-neutral-500 truncate flex-1">{c.latest_message || 'No messages'}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )
        ) : (
          /* Chat Thread */
          <>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {messages.map(msg => {
                const isMine = msg.sender_id === user.id;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] px-4 py-2 rounded-2xl ${
                      isMine 
                        ? 'bg-orange-600/80 text-white rounded-br-sm' 
                        : 'bg-neutral-800 text-neutral-200 rounded-bl-sm'
                    }`}>
                      <p className="text-sm break-words">{msg.message_text}</p>
                    </div>
                    <span className="text-[10px] text-neutral-600 mt-1 mx-1">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 bg-neutral-950/80 border-t border-neutral-800 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
              <button 
                type="submit"
                disabled={!newMessage.trim()}
                className="w-10 h-10 rounded-xl bg-orange-600 hover:bg-orange-500 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
