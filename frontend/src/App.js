import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Collections from "@/pages/Collections";
import CollectionDetail from "@/pages/CollectionDetail";
import TryAndBuy from "@/pages/TryAndBuy";
import Stores from "@/pages/Stores";
import Franchise from "@/pages/Franchise";
import About from "@/pages/About";
import CustomerCare from "@/pages/CustomerCare";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAF6]">
      <BrowserRouter>
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/collections/:slug" element={<CollectionDetail />} />
            <Route path="/try-and-buy" element={<TryAndBuy />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/franchise" element={<Franchise />} />
            <Route path="/about" element={<About />} />
            <Route path="/customer-care" element={<CustomerCare />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <AIAssistant />
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </div>
  );
}

export default App;
