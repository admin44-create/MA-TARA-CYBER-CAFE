import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bot, 
  Sparkles, 
  X, 
  Send, 
  RotateCcw, 
  MessageCircle, 
  ArrowRight, 
  CreditCard, 
  Truck, 
  FileText,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { getWhatsAppChatUrl, buildTrackingInquiryMessage } from '../utils/whatsapp';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  source?: string;
  suggestedAction?: {
    type: 'open_order' | 'track_order' | 'open_whatsapp' | 'register_customer';
    label: string;
    payload?: any;
  };
}

const QUICK_PROMPTS = [
  { label: '🪪 New PAN Card Docs', query: 'প্যান কার্ডের জন্য কী কী ডকুমেন্টস লাগে এবং খরচ কত?' },
  { label: '🗳️ Voter Card Form 6', query: 'নতুন ভোটার কার্ড Form 6 কীভাবে আবেদন করবো?' },
  { label: '📜 Caste Certificate', query: 'SC/ST/OBC জাতিগত সার্টিফিকেট পেতে কী কী কাগজ প্রয়োজন?' },
  { label: '📦 Track My PVC Order', query: 'আমি আমার পিভিসি কার্ড অর্ডার কীভাবে ট্র্যাক করবো?' },
  { label: '⚡ WBSEDCL Bill Receipt', query: 'বিদ্যুৎ বিল দিলে কী আসল রশিদ পাওয়া যাবে?' },
  { label: '💬 WhatsApp Assistance', query: 'আমি কি সরাসরি হোয়াটসঅ্যাপে ডকুমেন্ট পাঠিয়ে অর্ডার করতে পারবো?' }
];

export const AiAssistant: React.FC = () => {
  const { 
    siteSettings, 
    services, 
    orders, 
    currentUser, 
    openOrderForService, 
    openTrackingForOrder,
    setAuthModalOpen,
    setAuthModalTab
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `নমস্কার${currentUser ? ` ${currentUser.fullName}` : ''}! 🙏 আমি **EzySeva AI মিত্র (ডিজিটাল সেবা সহায়ক)**।\n\nযেকোনো সরকারি অনলাইন ফর্ম, নতুন প্যান কার্ড, ভোটার কার্ড, স্মার্ট পিভিসি কার্ড (Aadhaar/Voter/PAN), জাতিগত সার্টিফিকেট (OBC/SC/ST) বা অর্ডার ট্র্যাকিং সংক্রান্ত যে কোনো প্রশ্ন আমাকে করুন। আমি বাংলা, English এবং हिंदी তে উত্তর দিতে পারি!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen, isMinimized]);

  // Handle local quick checks for order IDs or Customer IDs
  const checkForLocalOrderMatch = (query: string): string | null => {
    const clean = query.trim().toUpperCase();
    const orderMatch = orders.find(o => 
      o.id.toUpperCase() === clean || 
      o.customerCode.toUpperCase() === clean ||
      o.tracking?.trackingNumber?.toUpperCase() === clean
    );

    if (orderMatch) {
      return `📦 **Live Order Found:**\n- **Order ID:** \`${orderMatch.id}\`\n- **Customer:** ${orderMatch.customerName} (${orderMatch.customerCode})\n- **Service:** ${orderMatch.serviceTitle} (Qty: ${orderMatch.quantity})\n- **Status:** **${orderMatch.status}**\n- **Consignment Tracking:** \`${orderMatch.tracking?.trackingNumber || 'Pending'}\`\n- **Courier:** ${orderMatch.tracking?.courierPartner || 'Speed Post'}\n- **Delivery To:** ${orderMatch.shippingAddress.district}, ${orderMatch.shippingAddress.state} (${orderMatch.shippingAddress.pinCode})`;
    }
    return null;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    // Check if query is looking up an Order or Customer code directly
    const localOrderResult = checkForLocalOrderMatch(query);
    if (localOrderResult) {
      setIsLoading(false);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: localOrderResult,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'local_database',
          suggestedAction: {
            type: 'track_order',
            label: 'Open Full Tracking Timeline & Map',
            payload: query
          }
        }
      ]);
      return;
    }

    try {
      // Call server-side Gemini API endpoint
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: query,
          conversationHistory: messages.map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      const replyText = data.reply || 'দুঃখিত, কোনো উত্তর পাওয়া যায়নি। দয়া করে আবার চেষ্টা করুন।';

      // Detect if this mentions a service that user could order
      let suggestedAction: ChatMessage['suggestedAction'] = undefined;
      const lowerReply = replyText.toLowerCase();

      if (lowerReply.includes('pvc') || lowerReply.includes('aadhaar') || lowerReply.includes('pan')) {
        const matchingService = services.find(s => 
          (lowerReply.includes('aadhaar') && s.id === 'srv-aadhaar-pvc') ||
          (lowerReply.includes('pan') && s.id === 'srv-pan-pvc') ||
          (lowerReply.includes('voter') && s.id === 'srv-voter-pvc')
        );
        if (matchingService) {
          suggestedAction = {
            type: 'open_order',
            label: `Order ${matchingService.title} (₹${matchingService.price})`,
            payload: matchingService
          };
        }
      }

      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: data.source,
          suggestedAction
        }
      ]);
    } catch (err) {
      console.error('AI assistant error:', err);
      // Fallback
      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `নমস্কার! আমাদের পোর্টালের সকল সার্ভিস ও পিভিসি কার্ড সংক্রান্ত যেকোনো তথ্যের জন্য আপনি সরাসরি আমাদের অফিসিয়াল হোয়াটসঅ্যাপে যোগাযোগ করতে পারেন। আমাদের প্রতিনিধি সরাসরি আপনার আবেদন ও ডকুমেন্টস যাচাই করে দেবেন।`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'knowledge_base_fallback',
          suggestedAction: {
            type: 'open_whatsapp',
            label: 'Chat on WhatsApp with Agent',
            payload: siteSettings.contactWhatsApp
          }
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        text: `নমস্কার! চ্যাট রিসেট করা হয়েছে। আপনি কী জানতে চান বলুন (বাংলা, English অথবা हिंदी তে)?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const executeAction = (action: NonNullable<ChatMessage['suggestedAction']>) => {
    if (action.type === 'open_order' && action.payload) {
      openOrderForService(action.payload);
      setIsOpen(false);
    } else if (action.type === 'track_order') {
      openTrackingForOrder(action.payload || '');
      setIsOpen(false);
    } else if (action.type === 'open_whatsapp') {
      const url = getWhatsAppChatUrl(siteSettings.contactWhatsApp, 'Hello EzySeva, I need help regarding online services.');
      window.open(url, '_blank');
    } else if (action.type === 'register_customer') {
      setAuthModalTab('register');
      setAuthModalOpen(true);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 group">
          {/* Helpful Tooltip Pill */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-slate-700 animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Seva Mitra • বাংলা / Eng</span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-2xl shadow-xl hover:shadow-2xl border-2 border-white transition-all transform active:scale-95"
            aria-label="Open AI Seva Mitra Assistant"
          >
            <div className="relative">
              <Bot className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-blue-600 animate-pulse" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-black tracking-tight leading-tight flex items-center gap-1">
                <span>AI Assistant</span>
                <span className="bg-blue-500 text-[9px] px-1 rounded uppercase font-bold text-white">Live</span>
              </div>
              <div className="text-[10px] text-blue-100 font-medium">Ask questions & track orders</div>
            </div>
          </button>
        </div>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div 
          className={`fixed z-50 transition-all duration-300 ${
            isMinimized 
              ? 'bottom-6 right-6 w-80 h-16' 
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[92vw] sm:w-96 md:w-[420px] h-[580px] max-h-[85vh]'
          }`}
        >
          <div className="geometric-card shadow-2xl flex flex-col h-full overflow-hidden border-2 border-slate-200 bg-white p-0">
            
            {/* Header */}
            <div className="bg-slate-950 text-white p-3.5 px-4 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs sm:text-sm tracking-tight text-white">
                      EzySeva AI Mitra
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-extrabold px-1.5 py-0.2 rounded border border-emerald-500/30">
                      Active
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Online Assistant • বাংলা / English / हिंदी
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-400">
                <button
                  onClick={handleResetChat}
                  title="Reset conversation"
                  className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? 'Expand' : 'Minimize'}
                  className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close Assistant"
                  className="p-1.5 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body (Hidden when minimized) */}
            {!isMinimized && (
              <>
                {/* Notice & WhatsApp Quick Action Bar */}
                <div className="bg-blue-50/70 border-b border-blue-100/60 px-3 py-1.5 flex items-center justify-between text-[11px] text-blue-900 shrink-0">
                  <span className="flex items-center gap-1 font-medium">
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    Powered by Gemini AI & Kendra Docs
                  </span>
                  <a
                    href={getWhatsAppChatUrl(siteSettings.contactWhatsApp, 'Hello EzySeva Team, I need assistance.')}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <MessageCircle className="w-3 h-3 text-emerald-600" />
                    <span>WhatsApp Desk</span>
                  </a>
                </div>

                {/* Messages Scroll Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                  {messages.map((msg) => {
                    const isAi = msg.sender === 'ai';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}
                      >
                        <div
                          className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                            isAi
                              ? 'bg-white border border-slate-200/80 text-slate-800'
                              : 'bg-blue-600 text-white font-medium'
                          }`}
                        >
                          <div className="whitespace-pre-line break-words">
                            {msg.text}
                          </div>

                          {/* Suggested Direct Action Button */}
                          {msg.suggestedAction && (
                            <div className="mt-2.5 pt-2 border-t border-slate-100">
                              <button
                                onClick={() => executeAction(msg.suggestedAction!)}
                                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-blue-200"
                              >
                                <span>{msg.suggestedAction.label}</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>

                        <span className="text-[9px] text-slate-400 mt-1 px-1">
                          {msg.timestamp}
                        </span>
                      </div>
                    );
                  })}

                  {isLoading && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-2xl border border-slate-200 max-w-[70%]">
                      <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-.3s]" />
                      <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-.5s]" />
                      <span className="text-[11px] font-medium text-slate-600">AI মিত্র ভাবছে...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts Carousel */}
                <div className="p-2 border-t border-slate-100 bg-white shrink-0 overflow-x-auto scrollbar-none flex gap-1.5">
                  {QUICK_PROMPTS.map((qp, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(qp.query)}
                      disabled={isLoading}
                      className="text-[10px] font-bold text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
                    >
                      {qp.label}
                    </button>
                  ))}
                </div>

                {/* Chat Input Field */}
                <div className="p-3 border-t border-slate-200 bg-white shrink-0">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="এখানে লিখুন (বাংলা / English / हिंदी)..."
                      className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />

                    <button
                      type="submit"
                      disabled={!inputMessage.trim() || isLoading}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all shadow-sm shrink-0"
                      aria-label="Send message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                  <div className="text-[10px] text-slate-400 text-center mt-1.5">
                    Order ID বা Customer ID লিখলে সরাসরি স্ট্যাটাস দেখতে পারবেন
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
};
