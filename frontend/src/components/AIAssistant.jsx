import { useEffect, useRef, useState } from "react";
import { MessageCircle, RotateCcw, Send, Ticket, X } from "lucide-react";
import { streamChat } from "@/lib/api";
import TicketDialog from "@/components/TicketDialog";

const WELCOME = "Hi! I'm the NoodleWala Assistant. I can help you explore noodles, find stores, learn about Try & Buy, understand franchise enquiries, or create a customer care request. How can I help you today?";

const QUICK_ACTIONS = [
  { label: "Explore Noodles", msg: "Tell me about the noodle collections at NoodleWala." },
  { label: "Find a Store", msg: "How do I find a NoodleWala store near me?" },
  { label: "Try & Buy", msg: "How does Try & Buy sampling work?" },
  { label: "Franchise Enquiry", msg: "I want to know about the NoodleWala franchise opportunity." },
  { label: "Product Question", msg: "I have a question about a product." },
];

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [lastMsg, setLastMsg] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("nw:open-ai", handler);
    return () => window.removeEventListener("nw:open-ai", handler);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

  const send = (text) => {
    const msg = (text ?? input).trim();
    if (!msg || typing) return;
    setError(null);
    setLastMsg(msg);
    setInput("");
    setMessages((m) => [...m, { role: "user", content: msg }]);
    setTyping(true);
    let acc = "";
    let started = false;
    streamChat(msg, conversationId, {
      onDelta: (d) => {
        acc += d;
        if (!started) { started = true; setTyping(false); setMessages((m) => [...m, { role: "assistant", content: acc }]); }
        else setMessages((m) => [...m.slice(0, -1), { role: "assistant", content: acc }]);
      },
      onDone: (cid) => setConversationId(cid),
      onError: (e) => { setTyping(false); if (!started) setError(e); },
    });
  };

  const clear = () => { setMessages([]); setConversationId(null); setError(null); };

  return (
    <>
      <button onClick={() => setOpen(!open)} aria-label="Open NoodleWala Assistant" data-testid="ai-launcher"
        className="fixed bottom-5 right-5 z-[60] w-14 h-14 rounded-full bg-[#063B2B] text-[#C9A227] shadow-[0_8px_24px_-6px_rgba(6,59,43,0.5)] border-2 border-[#C9A227]/60 flex items-center justify-center hover:scale-105 transition-transform duration-200">
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {open && (
        <div className="fixed bottom-[84px] right-4 sm:right-5 z-[60] w-[calc(100vw-2rem)] sm:w-[380px] h-[520px] max-h-[calc(100vh-110px)] bg-white border border-[#D7E4DC] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          role="dialog" aria-label="NoodleWala Assistant chat" data-testid="ai-chat-window">
          <div className="bg-[#063B2B] px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-display font-semibold text-white">NoodleWala Assistant</p>
              <p className="text-[10px] font-mono tracking-wider text-[#C9A227] uppercase">AI assistant — not a human</p>
            </div>
            <button onClick={clear} aria-label="Clear chat" data-testid="ai-clear-button"
              className="p-1.5 text-white/70 hover:text-white transition-colors"><RotateCcw className="w-4 h-4" /></button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F7FAF6] nw-chat-scroll" data-testid="ai-messages">
            <div className="bg-white border border-[#D7E4DC] rounded-xl rounded-tl-sm px-3.5 py-2.5 text-sm text-[#123D2D] leading-relaxed max-w-[85%]">
              {WELCOME}
            </div>
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-1" data-testid="ai-quick-actions">
                {QUICK_ACTIONS.map((q) => (
                  <button key={q.label} onClick={() => send(q.msg)} data-testid={`ai-quick-${q.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                    className="text-xs font-medium text-[#00704A] bg-white border border-[#00704A]/30 rounded-full px-3 py-1.5 hover:bg-[#00704A] hover:text-white transition-colors">
                    {q.label}
                  </button>
                ))}
                <button onClick={() => setTicketOpen(true)} data-testid="ai-quick-create-ticket"
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#8a6f14] bg-[#C9A227]/10 border border-[#C9A227]/40 rounded-full px-3 py-1.5 hover:bg-[#C9A227] hover:text-[#063B2B] transition-colors">
                  <Ticket className="w-3 h-3" /> Create a Support Ticket
                </button>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user"
                ? "ml-auto bg-[#00704A] text-white rounded-xl rounded-tr-sm px-3.5 py-2.5 text-sm leading-relaxed max-w-[85%]"
                : "bg-white border border-[#D7E4DC] rounded-xl rounded-tl-sm px-3.5 py-2.5 text-sm text-[#123D2D] leading-relaxed max-w-[85%] whitespace-pre-wrap"}
                data-testid={`ai-message-${m.role}-${i}`}>
                {m.content}
              </div>
            ))}
            {typing && (
              <div className="bg-white border border-[#D7E4DC] rounded-xl rounded-tl-sm px-4 py-3 max-w-[70px] flex gap-1.5" data-testid="ai-typing" aria-label="Assistant is typing">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#1B8A63] nw-typing-dot" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-3.5 py-3 text-sm text-red-700" role="alert" data-testid="ai-error">
                {error}
                <button onClick={() => send(lastMsg)} data-testid="ai-retry-button"
                  className="block mt-2 text-xs font-semibold underline underline-offset-2">Retry</button>
              </div>
            )}
            {messages.length > 0 && (
              <button onClick={() => setTicketOpen(true)} data-testid="ai-ticket-cta"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8a6f14] bg-[#C9A227]/10 border border-[#C9A227]/40 rounded-full px-3 py-1.5 hover:bg-[#C9A227] hover:text-[#063B2B] transition-colors">
                <Ticket className="w-3 h-3" /> Need human help? Create a support ticket
              </button>
            )}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="p-3 border-t border-[#D7E4DC] bg-white">
            <div className="flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} data-testid="ai-input"
                placeholder="Ask about noodles, stores, Try & Buy..." aria-label="Message the NoodleWala Assistant"
                className="flex-1 text-sm border border-[#D7E4DC] rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00704A] bg-[#F7FAF6]" />
              <button type="submit" disabled={!input.trim() || typing} aria-label="Send message" data-testid="ai-send-button"
                className="w-10 h-10 rounded-full bg-[#00704A] text-white flex items-center justify-center hover:bg-[#063B2B] disabled:opacity-40 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-2 text-[10px] text-[#5F6F67] leading-snug px-1">
              AI responses may require confirmation. Don't share sensitive personal information. NoodleWala may review chats to improve support.
            </p>
          </form>
        </div>
      )}

      <TicketDialog open={ticketOpen} onOpenChange={setTicketOpen} conversationId={conversationId} />
    </>
  );
}
