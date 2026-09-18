import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API, timeout: 20000 });

export const getConfig = () => api.get("/config").then((r) => r.data);
export const getCollections = () => api.get("/collections").then((r) => r.data.collections);
export const getCollection = (slug) => api.get(`/collections/${slug}`).then((r) => r.data);
export const getProductMeta = () => api.get("/products/meta").then((r) => r.data);
export const getProducts = (params) => api.get("/products", { params }).then((r) => r.data);
export const getProduct = (slug) => api.get(`/products/${slug}`).then((r) => r.data);
export const getStores = (params) => api.get("/stores", { params }).then((r) => r.data);
export const getStore = (id) => api.get(`/stores/${id}`).then((r) => r.data);
export const getTryAndBuy = () => api.get("/try-and-buy").then((r) => r.data);
export const getKnowledge = (params) => api.get("/knowledge", { params }).then((r) => r.data.articles);
export const createTicket = (payload) => api.post("/tickets", payload).then((r) => r.data);
export const lookupTicket = (ticket_number, mobile) =>
  api.get("/tickets/lookup", { params: { ticket_number, mobile } }).then((r) => r.data.ticket);
export const createLead = (payload) => api.post("/franchise-leads", payload).then((r) => r.data);
export const createContact = (payload) => api.post("/contact", payload).then((r) => r.data);

export async function streamChat(message, conversationId, { onDelta, onDone, onError }) {
  try {
    const res = await fetch(`${API}/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, conversation_id: conversationId }),
    });
    if (!res.ok || !res.body) {
      onError("The NoodleWala Assistant is temporarily unavailable. You can still contact customer care through the enquiry options.");
      return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const parts = buf.split("\n\n");
      buf = parts.pop();
      for (const part of parts) {
        const line = part.trim();
        if (!line.startsWith("data:")) continue;
        try {
          const payload = JSON.parse(line.slice(5));
          if (payload.delta) onDelta(payload.delta);
          if (payload.done) onDone(payload.conversation_id);
          if (payload.error) onError(payload.error);
        } catch { /* partial chunk */ }
      }
    }
  } catch {
    onError("The NoodleWala Assistant is temporarily unavailable. Please try again.");
  }
}

export function usePageTitle(title, description) {
  const apply = () => {
    document.title = title ? `${title} | NoodleWala.com` : "NoodleWala.com | The World of Noodles";
    const meta = document.querySelector('meta[name="description"]');
    if (meta && description) meta.setAttribute("content", description);
  };
  return apply;
}
