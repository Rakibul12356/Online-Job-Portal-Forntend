import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Briefcase,
  CheckCheck,
  Check,
  Loader2,
  MessageSquare,
  Search,
  Send,
  User,
  Building2,
  Clock,
  CircleDot,
  AlertCircle,
} from 'lucide-react';
import { chatService } from '@/services';
import { useAuth } from '@/context';
import { appConfig } from '@/config/env';

const isRoomForUser = (room, userId) => {
  return (
    String(room.otherUserId) === String(userId) ||
    String(room.otherUser?.id) === String(userId) ||
    String(room.seekerId) === String(userId) ||
    String(room.employerId) === String(userId)
  );
};

export function ChatPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeRoomId = searchParams.get('room');

  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [inputMessage, setInputMessage] = useState('');
  const [wsStatus, setWsStatus] = useState('disconnected'); // 'disconnected' | 'connecting' | 'connected'

  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [typingUserName, setTypingUserName] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const wsRef = useRef(null);
  const globalWsRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const globalReconnectTimeoutRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const activeRoomIdRef = useRef(activeRoomId);

  const [globalWsStatus, setGlobalWsStatus] = useState('disconnected');

  const currentUserId = user?.id || user?._id;

  // Sync activeRoomId to ref
  useEffect(() => {
    activeRoomIdRef.current = activeRoomId;
  }, [activeRoomId]);

  // 1. Fetch Rooms list
  const fetchRooms = async () => {
    try {
      setRoomsLoading(true);
      const res = await chatService.getRooms();
      if (res.success && res.data) {
        setRooms(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching chat rooms:', err);
      setError('Could not load conversations. Please try again later.');
    } finally {
      setRoomsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // 1.5 Manage Global WebSocket Connection for inbox list notifications, unread counts, and online user statuses
  useEffect(() => {
    const connectGlobalWebSocket = () => {
      setGlobalWsStatus('connecting');

      const apiBase = appConfig.apiUrl;
      const wsProtocol = apiBase.startsWith('https') ? 'wss' : 'ws';
      const baseHostPath = apiBase.replace(/^https?:\/\//, '');

      let token = '';
      try {
        const raw = localStorage.getItem('job_portal_user');
        if (raw) {
          const parsed = JSON.parse(raw);
          token = parsed?.accessToken || '';
        }
      } catch (e) {
        console.error(
          'Failed to parse access token for global WS handshake',
          e,
        );
      }

      const wsUrl = `${wsProtocol}://${baseHostPath}/chats/ws?token=${token}`;
      console.log(
        'Connecting to Global WebSocket:',
        wsUrl.replace(token, 'TOKEN_REDACTED'),
      );

      const socket = new WebSocket(wsUrl);
      globalWsRef.current = socket;

      socket.onopen = () => {
        console.log('Global WebSocket connected successfully');
        setGlobalWsStatus('connected');
        if (globalReconnectTimeoutRef.current) {
          clearTimeout(globalReconnectTimeoutRef.current);
        }
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Global WS event received:', data);

          if (!data || typeof data !== 'object') return;

          if (data.type) {
            switch (data.type) {
              case 'message': {
                const msg = data.message;
                if (!msg) return;

                // Update sidebar unreadCount and lastMessage if this room is not active
                if (msg.roomId !== activeRoomIdRef.current) {
                  setRooms((prevRooms) =>
                    prevRooms.map((room) => {
                      if (room.id === msg.roomId) {
                        return {
                          ...room,
                          lastMessage: msg.message,
                          updatedAt: msg.createdAt,
                          unreadCount: (room.unreadCount || 0) + 1,
                        };
                      }
                      return room;
                    }),
                  );
                }
                break;
              }

              case 'user_status': {
                setRooms((prevRooms) =>
                  prevRooms.map((room) => {
                    if (isRoomForUser(room, data.userId)) {
                      return { ...room, isOnline: data.status === 'online' };
                    }
                    return room;
                  }),
                );
                break;
              }

              default:
                break;
            }
          }
        } catch (err) {
          console.error('Error handling Global WebSocket message:', err);
        }
      };

      socket.onerror = (err) => {
        console.error('Global WebSocket error:', err);
        setGlobalWsStatus('disconnected');
      };

      socket.onclose = () => {
        console.log('Global WebSocket disconnected');
        setGlobalWsStatus('disconnected');
        // Retry connection after 5 seconds
        globalReconnectTimeoutRef.current = setTimeout(
          connectGlobalWebSocket,
          5000,
        );
      };
    };

    connectGlobalWebSocket();

    return () => {
      if (globalWsRef.current) {
        globalWsRef.current.close();
      }
      if (globalReconnectTimeoutRef.current) {
        clearTimeout(globalReconnectTimeoutRef.current);
      }
    };
  }, []);

  // 2. Fetch messages when activeRoomId changes
  useEffect(() => {
    if (!activeRoomId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      setMessagesLoading(true);
      try {
        const res = await chatService.getMessages(activeRoomId);
        if (res.success && res.data) {
          setMessages(res.data || []);
        }
      } catch (err) {
        console.error('Error loading messages:', err);
      } finally {
        setMessagesLoading(false);
      }
    };

    loadMessages();
  }, [activeRoomId]);

  // 3. Manage WebSocket Connection for activeRoomId
  useEffect(() => {
    if (!activeRoomId) {
      if (wsRef.current) {
        wsRef.current.close();
      }
      return;
    }

    const connectWebSocket = () => {
      // Close previous connection if exists
      if (wsRef.current) {
        wsRef.current.close();
      }

      setWsStatus('connecting');

      // Build WebSocket URL from VITE_API_URL / appConfig.apiUrl
      const apiBase = appConfig.apiUrl;
      const wsProtocol = apiBase.startsWith('https') ? 'wss' : 'ws';
      const baseHostPath = apiBase.replace(/^https?:\/\//, '');

      let token = '';
      try {
        const raw = localStorage.getItem('job_portal_user');
        if (raw) {
          const parsed = JSON.parse(raw);
          token = parsed?.accessToken || '';
        }
      } catch (e) {
        console.error('Failed to parse access token for WS handshake', e);
      }

      const wsUrl = `${wsProtocol}://${baseHostPath}/chats/${activeRoomId}/ws?token=${token}`;
      console.log(
        'Connecting to WebSocket:',
        wsUrl.replace(token, 'TOKEN_REDACTED'),
      );

      const socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        console.log('WebSocket connected successfully');
        setWsStatus('connected');
        // Clear any pending reconnection attempts
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        // Send a seen read receipt event immediately upon connection
        try {
          socket.send(JSON.stringify({ type: 'seen' }));
        } catch (e) {
          console.error('Failed to send seen receipt on connect:', e);
        }
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WS event received:', data);

          if (!data || typeof data !== 'object') return;

          if (data.type) {
            switch (data.type) {
              case 'message': {
                const msg = data.message;
                if (!msg) return;

                if (msg.roomId === activeRoomId) {
                  setMessages((prev) => {
                    if (
                      prev.some(
                        (m) =>
                          m.id === msg.id ||
                          (m.createdAt === msg.createdAt &&
                            m.message === msg.message),
                      )
                    ) {
                      return prev;
                    }
                    return [...prev, msg];
                  });

                  // Trigger a read receipt back to the server if focus is active AND the message was sent by the other user
                  if (
                    String(msg.senderId) !== String(currentUserId) &&
                    document.hasFocus() &&
                    wsRef.current &&
                    socket.readyState === WebSocket.OPEN
                  ) {
                    socket.send(JSON.stringify({ type: 'seen' }));
                  }
                }

                // Update last message and unread count in rooms list
                setRooms((prevRooms) =>
                  prevRooms.map((room) => {
                    if (room.id === msg.roomId) {
                      return {
                        ...room,
                        lastMessage: msg.message,
                        updatedAt: msg.createdAt,
                        unreadCount:
                          room.id === activeRoomId
                            ? 0
                            : (room.unreadCount || 0) + 1,
                      };
                    }
                    return room;
                  }),
                );
                break;
              }

              case 'message_status': {
                if (data.roomId === activeRoomId) {
                  setMessages((prev) =>
                    prev.map((msg) => {
                      if (String(msg.senderId) === String(currentUserId)) {
                        return { ...msg, status: data.status };
                      }
                      return msg;
                    }),
                  );
                }
                break;
              }

              case 'typing': {
                if (String(data.senderId) !== String(currentUserId)) {
                  setIsOtherTyping(data.isTyping || false);
                  setTypingUserName(data.senderName || '');
                }
                break;
              }

              case 'user_status': {
                setRooms((prevRooms) =>
                  prevRooms.map((room) => {
                    if (isRoomForUser(room, data.userId)) {
                      return { ...room, isOnline: data.status === 'online' };
                    }
                    return room;
                  }),
                );
                break;
              }

              default:
                break;
            }
          } else {
            // Fallback for legacy format
            const legacyMsg = data;
            if (legacyMsg.roomId === activeRoomId) {
              setMessages((prev) => {
                if (
                  prev.some(
                    (m) =>
                      m.id === legacyMsg.id ||
                      (m.createdAt === legacyMsg.createdAt &&
                        m.message === legacyMsg.message),
                  )
                ) {
                  return prev;
                }
                return [...prev, legacyMsg];
              });
            }
            setRooms((prevRooms) =>
              prevRooms.map((room) => {
                if (room.id === legacyMsg.roomId) {
                  return {
                    ...room,
                    lastMessage: legacyMsg.message,
                    updatedAt: legacyMsg.createdAt,
                    unreadCount:
                      room.id === activeRoomId
                        ? 0
                        : (room.unreadCount || 0) + 1,
                  };
                }
                return room;
              }),
            );
          }
        } catch (err) {
          console.error('Error handling WebSocket message:', err);
        }
      };

      socket.onerror = (err) => {
        console.error('WebSocket encountered an error:', err);
        setWsStatus('disconnected');
      };

      socket.onclose = () => {
        console.log('WebSocket disconnected');
        setWsStatus('disconnected');

        // Retry connection after 5 seconds if the room is still active
        reconnectTimeoutRef.current = setTimeout(() => {
          if (activeRoomId) {
            console.log('Attempting to reconnect WebSocket...');
            connectWebSocket();
          }
        }, 5000);
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [activeRoomId]);

  // 4. Auto scroll message history to bottom
  useLayoutEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, messagesLoading]);

  // Reset typing states and timeouts on room change or unmount
  useEffect(() => {
    setIsOtherTyping(false);
    setTypingUserName('');
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [activeRoomId]);

  const handleTyping = () => {
    if (!wsRef.current || wsStatus !== 'connected') return;

    if (!isTyping) {
      setIsTyping(true);
      try {
        wsRef.current.send(JSON.stringify({ type: 'typing', isTyping: true }));
      } catch (err) {
        console.error('Failed to send typing indicator:', err);
      }
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      try {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({ type: 'typing', isTyping: false }),
          );
        }
      } catch (err) {
        console.error('Failed to send stop typing indicator:', err);
      }
    }, 1500);
  };

  // 5. Send message action
  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || !wsRef.current || wsStatus !== 'connected')
      return;

    try {
      const payload = {
        type: 'message',
        message: inputMessage.trim(),
      };

      wsRef.current.send(JSON.stringify(payload));

      // Clear local typing timeout and send stop typing event
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      setIsTyping(false);
      try {
        wsRef.current.send(JSON.stringify({ type: 'typing', isTyping: false }));
      } catch (err) {
        console.error('Failed to send stop typing indicator:', err);
      }

      // Clear input
      setInputMessage('');
    } catch (err) {
      console.error('Failed to send message over WebSocket:', err);
    }
  };

  // Select a room in URL query parameter
  const selectRoom = (roomId) => {
    setSearchParams({ room: roomId });
    // Reset unread count for selected room locally
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === roomId ? { ...room, unreadCount: 0 } : room,
      ),
    );
  };

  const activeRoom = rooms.find((r) => r.id === activeRoomId);
  const isOtherUserOnline = activeRoom?.isOnline || false;

  // Filter rooms by search query and sort by newest message (updatedAt) descending
  const filteredRooms = rooms
    .filter((room) =>
      room.otherUserName?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));

  // Formatting date labels
  const formatTime = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  const formatDateHeader = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString([], {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  // Group messages by day for beautiful separators
  const groupMessagesByDay = (messagesList) => {
    const groups = {};
    messagesList.forEach((msg) => {
      const dateStr = new Date(msg.createdAt).toDateString();
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(msg);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDay(messages);

  return (
    <div className="flex h-[calc(100vh-7rem)] md:h-[calc(100vh-8rem)] min-h-[400px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Rooms Sidebar */}
      <aside
        className={`w-full shrink-0 border-r border-gray-200 bg-gray-50/50 md:w-80 lg:w-96 md:block ${
          activeRoomId ? 'hidden' : 'block'
        }`}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-9 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="h-[calc(100%-6rem)] overflow-y-auto divide-y divide-gray-100">
          {roomsLoading ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500 gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-slate-600" />
              <span className="text-sm font-medium">Loading inbox...</span>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500 p-6 text-center">
              <MessageSquare className="h-8 w-8 text-gray-300 mb-2" />
              <span className="text-sm font-medium">
                No conversations found
              </span>
              <p className="text-xs text-gray-400 mt-1">
                {searchQuery
                  ? 'Try matching another name.'
                  : 'Start a chat from job detail details or candidate screens.'}
              </p>
            </div>
          ) : (
            filteredRooms.map((room) => {
              const isActive = room.id === activeRoomId;
              const hasUnread = room.unreadCount > 0;
              const initials = room.otherUserName
                ? room.otherUserName.substring(0, 2).toUpperCase()
                : '??';

              return (
                <button
                  key={room.id}
                  onClick={() => selectRoom(room.id)}
                  className={`flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-gray-100/50 ${
                    isActive ? 'bg-slate-50 border-l-4 border-slate-900' : ''
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 font-semibold text-white text-sm">
                      {initials}
                    </div>
                    {room.isOnline && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4
                        className={`text-sm truncate ${hasUnread ? 'font-bold text-black' : 'font-semibold text-gray-800'}`}
                      >
                        {room.otherUserName}
                      </h4>
                      {room.updatedAt && (
                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                          {new Date(room.updatedAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs truncate ${hasUnread ? 'font-medium text-slate-900' : 'text-gray-500'}`}
                    >
                      {room.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                  {hasUnread && (
                    <span className="shrink-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-900 px-1 text-[10px] font-bold text-white">
                      {room.unreadCount}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <section
        className={`flex-1 flex flex-col min-w-0 ${!activeRoomId ? 'hidden md:flex' : 'flex'}`}
      >
        {activeRoomId && activeRoom ? (
          <>
            {/* Active Room Header */}
            <header className="flex h-16 items-center justify-between border-b border-gray-200 px-4 md:px-6">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setSearchParams({})}
                  className="mr-1 rounded-full p-1.5 text-gray-500 hover:bg-gray-100 md:hidden"
                  title="Back to inbox"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 font-bold text-white text-xs shrink-0 relative">
                  {activeRoom.otherUserName
                    ? activeRoom.otherUserName.substring(0, 2).toUpperCase()
                    : '??'}
                  {isOtherUserOnline && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white bg-green-500" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold truncate text-slate-900 flex items-center gap-1.5">
                    {activeRoom.otherUserName}
                    {isOtherUserOnline && (
                      <span
                        className="h-2 w-2 rounded-full bg-green-500 inline-block animate-pulse"
                        title="Online"
                      />
                    )}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    {wsStatus === 'connected' ? (
                      <span className="flex items-center gap-1 text-green-600 font-medium">
                        <CircleDot className="h-2 w-2 fill-green-600" />
                        Live Connection
                      </span>
                    ) : wsStatus === 'connecting' ? (
                      <span className="flex items-center gap-1 text-amber-600 font-medium">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Connecting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-500 font-medium">
                        <AlertCircle className="h-3 w-3" />
                        Disconnected (reconnecting)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Job Reference link if present */}
              {activeRoom.jobId && (
                <Link
                  to={`/jobs/${activeRoom.jobId}`}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-slate-800 transition-colors hover:bg-gray-100"
                >
                  <Briefcase className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">View Position</span>
                </Link>
              )}
            </header>

            {/* Message Feed */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto bg-gray-50/30 p-4 space-y-6 md:p-6"
            >
              {messagesLoading && messages.length === 0 ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-6">
                  <MessageSquare className="h-10 w-10 text-gray-300 mb-2" />
                  <span className="text-sm font-semibold text-gray-700">
                    Say hello!
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    This is the start of your secure conversation regarding this
                    job.
                  </p>
                </div>
              ) : (
                Object.keys(messageGroups).map((day) => (
                  <div key={day} className="space-y-4">
                    <div className="flex justify-center">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                        {formatDateHeader(day)}
                      </span>
                    </div>

                    {messageGroups[day].map((msg) => {
                      const isSentByMe =
                        String(msg.senderId) === String(currentUserId);
                      return (
                        <div
                          key={msg.id || msg.createdAt}
                          className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`flex flex-col max-w-[75%] sm:max-w-[60%] ${isSentByMe ? 'items-end' : 'items-start'}`}
                          >
                            <div
                              className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                                isSentByMe
                                  ? 'bg-slate-900 text-white rounded-br-none'
                                  : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                              }`}
                            >
                              {msg.message}
                            </div>
                            <span className="mt-1 flex items-center gap-1 text-[10px] text-gray-400">
                              <Clock className="h-2.5 w-2.5" />
                              {formatTime(msg.createdAt)}
                              {isSentByMe && (
                                <>
                                  {(!msg.status || msg.status === 'sent') && (
                                    <Check className="ml-0.5 h-3.5 w-3.5 text-gray-400" />
                                  )}
                                  {msg.status === 'delivered' && (
                                    <CheckCheck className="ml-0.5 h-3.5 w-3.5 text-gray-400" />
                                  )}
                                  {msg.status === 'seen' && (
                                    <CheckCheck className="ml-0.5 h-3.5 w-3.5 text-blue-500" />
                                  )}
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
              {isOtherTyping && (
                <div className="flex justify-start items-center gap-2 text-xs text-gray-500 italic animate-pulse py-2 px-1">
                  <span className="flex gap-0.5 items-center shrink-0">
                    <span
                      className="h-1 w-1 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    />
                    <span
                      className="h-1 w-1 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="h-1 w-1 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </span>
                  {typingUserName || activeRoom.otherUserName} is typing...
                </div>
              )}
            </div>

            {/* Message Input Form */}
            <form
              onSubmit={handleSendMessage}
              className="border-t border-gray-200 bg-white p-4"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={
                    wsStatus === 'connected'
                      ? 'Type your message...'
                      : 'Connecting to chat room...'
                  }
                  disabled={wsStatus !== 'connected'}
                  value={inputMessage}
                  onChange={(e) => {
                    setInputMessage(e.target.value);
                    handleTyping();
                  }}
                  onFocus={() => {
                    if (wsRef.current && wsStatus === 'connected') {
                      wsRef.current.send(JSON.stringify({ type: 'seen' }));
                    }
                  }}
                  className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-slate-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-500 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={wsStatus !== 'connected' || !inputMessage.trim()}
                  className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:bg-gray-200 disabled:text-gray-400 transition-colors shrink-0"
                  title="Send Message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center bg-gray-50/50 p-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm mb-4">
              <MessageSquare className="h-8 w-8 text-slate-800" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Your Conversations
            </h3>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Select a chat room from the sidebar to view candidate information,
              check status updates, and message in real-time.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default ChatPage;
