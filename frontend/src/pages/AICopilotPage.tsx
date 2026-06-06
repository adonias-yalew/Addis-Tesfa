import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Plus,
  Trash2,
  MessageSquare,
  Loader,
  Sparkles,
  Copy,
  Check,
  Zap,
  BookOpen,
  BriefcaseIcon,
  Trophy,
  Search as SearchIcon
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

const AICopilotPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('ai_conversations');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    {
      icon: Zap,
      title: 'Career Guidance',
      description: 'Get advice on career planning and professional development'
    },
    {
      icon: BriefcaseIcon,
      title: 'Project Support',
      description: 'Get help with project ideas and technical implementations'
    },
    {
      icon: Trophy,
      title: 'Interview Prep',
      description: 'Prepare for interviews with practice questions and tips'
    },
    {
      icon: BookOpen,
      title: 'Learning Help',
      description: 'Get explanations and resources for learning new concepts'
    },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (currentConversationId) {
      const conv = conversations.find(c => c.id === currentConversationId);
      if (conv) {
        setMessages(conv.messages);
      }
    }
  }, [currentConversationId, conversations]);

  const startNewChat = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations([newConversation, ...conversations]);
    setCurrentConversationId(newConversation.id);
    setMessages([]);
    setInput('');
  };

  const deleteConversation = (id: string) => {
    const updated = conversations.filter(c => c.id !== id);
    setConversations(updated);
    localStorage.setItem('ai_conversations', JSON.stringify(updated));
    
    if (currentConversationId === id) {
      if (updated.length > 0) {
        setCurrentConversationId(updated[0].id);
      } else {
        startNewChat();
      }
    }
  };

  const generateTitle = (firstMessage: string) => {
    return firstMessage.substring(0, 50).split('\n')[0] || 'New Chat';
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    let conversationId = currentConversationId;
    
    if (!conversationId) {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: generateTitle(input),
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setConversations([newConversation, ...conversations]);
      conversationId = newConversation.id;
      setCurrentConversationId(conversationId);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          conversationId,
          history: messages
        })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'I understand. How can I help you further?',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      const updatedConversations = conversations.map(c =>
        c.id === conversationId
          ? {
              ...c,
              messages: [...c.messages, userMessage, assistantMessage],
              title: c.title === 'New Chat' ? generateTitle(input) : c.title,
              updatedAt: new Date(),
            }
          : c
      );
      setConversations(updatedConversations);
      localStorage.setItem('ai_conversations', JSON.stringify(updatedConversations));
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-[calc(100vh-72px)] flex gap-4 bg-gradient-to-br from-white via-slate-50 to-emerald-50/30">
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'w-64' : 'w-0'
      } transition-all duration-300 border-r border-slate-200/80 bg-white/60 backdrop-blur-sm flex flex-col overflow-hidden`}>
        <div className="p-4 border-b border-slate-200/80">
          <button
            onClick={startNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`group p-3 rounded-lg cursor-pointer transition-all ${
                currentConversationId === conv.id
                  ? 'bg-emerald-50 border border-emerald-200'
                  : 'hover:bg-slate-100 border border-transparent'
              }`}
              onClick={() => setCurrentConversationId(conv.id)}
            >
              <p className="text-sm font-medium text-slate-900 truncate mb-1">
                {conv.title}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  {conv.messages.length} messages
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(conv.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b border-slate-200/80 bg-white/60 backdrop-blur-sm flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-all lg:hidden"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-slate-950 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                AI Copilot
              </h1>
              <p className="text-xs text-slate-500">Career guidance & professional support</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && !currentConversationId ? (
            <div className="h-full flex flex-col items-center justify-center space-y-8">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-950">Welcome to AI Copilot</h2>
                <p className="text-slate-600 max-w-md">
                  Get career guidance, project support, interview preparation, and professional advice from our AI assistant.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                {suggestedPrompts.map((prompt, idx) => {
                  const Icon = prompt.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setInput(prompt.title);
                        handleSuggestedPrompt(prompt.title);
                      }}
                      className="p-4 text-left border border-slate-200 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {prompt.title}
                          </p>
                          <p className="text-xs text-slate-600 mt-1">
                            {prompt.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xl px-4 py-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {msg.content}
                    </p>
                    <p className={`text-xs mt-2 ${
                      msg.role === 'user' ? 'text-emerald-100' : 'text-slate-500'
                    }`}>
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all mt-2"
                      title="Copy message"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                    <Loader className="w-4 h-4 text-emerald-600 animate-spin" />
                    <p className="text-sm text-slate-600">Thinking...</p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-200/80 bg-white/60 backdrop-blur-sm p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="max-w-4xl mx-auto flex gap-3"
          >
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for career guidance, project help, interview prep..."
                disabled={isLoading}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 transition-all"
              />
              <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center gap-2"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AICopilotPage;
