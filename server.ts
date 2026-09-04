import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return genAIClient;
}

// Fallback intelligent responder when GEMINI_API_KEY is not configured yet
function getRuleBasedResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('pan') || lower.includes('প্যান')) {
    return `**PAN Card Services & Requirements:**\n\n1. **New PAN Application (Form 49A):**\n   - Aadhaar Card (with matching Name & DOB)\n   - 2 Passport size recent color photos\n   - Mobile linked with Aadhaar for instant e-KYC\n2. **PAN Correction / Update:**\n   - Copy of existing PAN card\n   - Supporting proof for Name/DOB change\n3. **Smart PVC Reprint:**\n   - Only PAN number or e-PAN PDF required! Delivery via Speed Post in 24-48 hours (₹80).`;
  }

  if (lower.includes('voter') || lower.includes('ভোটার')) {
    return `**Voter ID (EPIC) Services:**\n\n- **New Voter (Form 6):** Age 18+, Passport photo, Age proof (Aadhaar/10th Admit), Address proof (Ration card/Electricity bill).\n- **Correction / Shift (Form 8):** For name, photo, or address rectification.\n- **PVC Smart Card:** We print original EC-quality water-proof PVC Voter cards with hologram and barcode for ₹60.`;
  }

  if (lower.includes('aadhaar') || lower.includes('আধার') || lower.includes('aadhar')) {
    return `**Aadhaar Card Services:**\n\n- **PVC Smart Card:** Original UIDAI format UV-coated waterproof smart card with readable QR code for ₹70. Delivered right to your home via India Post Speed Post.\n- **e-Aadhaar Download:** Can be done instantly with OTP sent to your registered mobile number.\n- **Aadhaar-PAN Link Check:** Can be verified instantly in 1 minute.`;
  }

  if (lower.includes('caste') || lower.includes('জাতি') || lower.includes('obc') || lower.includes('sc') || lower.includes('st')) {
    return `**Caste Certificate (SC/ST/OBC) Requirements:**\n\n1. Applicant's Aadhaar Card & Voter Card (or Parent's)\n2. Blood relation caste certificate (Father/Brother/Uncle) + Genealogy/Vanshavali tree\n3. Proof of Residence (1950/1971 document or ancestral land deed/khotian)\n4. Recent Passport color photograph\n5. Panchayat Pradhan / Municipal Councillor Certificate.\n\nFee: ₹150 for complete online application assistance.`;
  }

  if (lower.includes('birth') || lower.includes('death') || lower.includes('জন্ম') || lower.includes('মৃত্যু')) {
    return `**Birth & Death Certificate Services:**\n\n- Search, digital verification & print of Govt Janma-Mrityu portal certificates.\n- Requirements: Hospital discharge certificate, Mother/Father Aadhaar, or Registration Acknowledgement Slip.\n- Fee: ₹110 with high-resolution laminated or PVC print.`;
  }

  if (lower.includes('track') || lower.includes('ট্র্যাক') || lower.includes('order') || lower.includes('অর্ডার') || lower.includes('status')) {
    return `**How to Track Your Order / PVC Card:**\n\n1. Click **'Track PVC Card'** in the top navigation bar.\n2. Enter your **Customer ID** (e.g. \`EZ-829104\`) or **Order ID** (\`ORD-98241\`) or Speed Post Consignment No (\`EZTRACK-782194\`).\n3. You will see real-time updates: Order Placed -> Payment Verified -> Printing -> Dispatched via Speed Post -> Delivery.`;
  }

  if (lower.includes('whatsapp') || lower.includes('হোয়াটসঅ্যাপ') || lower.includes('contact') || lower.includes('help')) {
    return `**Direct WhatsApp Support:**\n\nYou can chat with our Seva Kendra staff directly on WhatsApp! Click the green WhatsApp button at the bottom right, or message our official WhatsApp number for instant document upload, fee calculation, and order tracking.`;
  }

  if (lower.includes('kisan') || lower.includes('pm kisan') || lower.includes('কৃষক') || lower.includes('farmer')) {
    return `**PM-Kisan Samman Nidhi (₹6,000/year):**\n\n- Requirements: Land Record (ROR / Porcha / Khatian), Aadhaar Card, Bank Passbook with NPCI/Aadhaar seeding, Mobile number.\n- We provide New Farmer Registration, Biometric/OTP eKYC, and Land Seeding resolution.`;
  }

  if (lower.includes('ration') || lower.includes('রেশন')) {
    return `**Digital Ration Card Services:**\n\n- PVC Smart Card: ₹65 with full family details & QR code.\n- Services: New digital ration card, name correction, family head change, and Aadhaar e-KYC linking.`;
  }

  return `নমস্কার! আমি **EzySeva AI সহকারী (Digital Seva Mitra)**। \n\nআমি আপনাকে নিম্নোক্ত অনলাইন সেবাগুলিতে সাহায্য করতে পারি:\n- 🪪 **Smart PVC Cards:** Aadhaar, Voter, PAN, Ayushman, Driving Licence\n- 📑 **Govt Identity:** New PAN, Voter Form 6/8, Passport Seva, Driving Licence\n- 📜 **Certificates:** Caste (SC/ST/OBC), Income, Domicile, Birth & Death Certificate\n- ⚡ **Utilities & Banking:** Electricity Bill, AEPS Banking, Money Transfer, Train & Flight Tickets\n- 📦 **Order Tracking & WhatsApp Support:** আপনার Customer ID অথবা Order ID দিলে আমি স্ট্যাটাস জানিয়ে দেব।\n\nআপনার কী ধরণের সেবা প্রয়োজন বলুন?`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Routes
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ 
      status: "ok", 
      time: new Date().toISOString(),
      service: "EzySeva Online Digital Kendra API"
    });
  });

  // AI Assistant Route using @google/genai (model: gemini-3.8-flash)
  app.post("/api/ai-assistant", async (req: Request, res: Response) => {
    try {
      const { message, conversationHistory } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: "Message is required" });
        return;
      }

      const ai = getGenAI();

      if (!ai) {
        // Safe graceful fallback if API key is not yet set in environment
        const fallbackReply = getRuleBasedResponse(message);
        res.json({
          reply: fallbackReply,
          source: "knowledge_base"
        });
        return;
      }

      const systemPrompt = `You are "EzySeva AI Mitra" (ডিজিটাল সেবা মিত্র), the official helpful AI Assistant for EzySeva Digital Seva Kendra and Smart PVC Card Portal.
You assist Indian citizens, CSC kiosk visitors, and customers in multiple languages (Bengali, English, and Hindi).
Match the language of the user! If the user writes in Bengali (or Banglish), reply in clear, polite Bengali with bullet points and emojis. If English, reply in English. If Hindi, reply in Hindi.

Key knowledge about EzySeva Portal:
1. Online Services Available:
   - Smart PVC Cards: Aadhaar (₹70), Voter ID (₹60), Instant PAN Card (₹80), Driving Licence (₹90), Ayushman Bharat PMJAY ₹5L Card (₹50), Digital Ration Card (₹65), E-Shram Card (₹50), PM Kisan Card (₹50). Printed on 800-micron waterproof, UV-coated thermal PVC with barcode/QR verification.
   - Government Certificates: SC/ST/OBC Caste Certificate (₹150), Income Certificate (₹120), Domicile/Residential (₹100), Digital Birth/Death Certificate (₹110), UDID Disability Card (₹80).
   - Identity & Govt Applications: New PAN (Form 49A, ₹160), PAN Correction (₹150), Voter Card New Apply (Form 6, ₹80) & Correction (Form 8, ₹80), Passport Seva Slot & Application (₹250), Driving Licence LL & DL Apply (₹200), Vehicle RC Duplicate & Tax (₹120), Police Verification PCC (₹150), Trade License (₹200).
   - Utilities & Banking: WBSEDCL / State Electricity Bills (₹20 service fee), Water & Property Tax, LPG Gas Booking, Grahak Seva AEPS Cash Withdrawal & Money Transfer (DMT), IRCTC Train Tickets, Bus & Flight Booking, FASTag Recharge.

2. How Ordering Works:
   - Customer MUST have a Customer ID (e.g. EZ-829104) to place an order. Registration takes 30 seconds (Name, Phone, Address, State, District, Pin Code).
   - Customers upload document PDF/image or enter document number.
   - Speed Post shipping address is confirmed with Pin Code.
   - Payment is via official UPI QR / UPI ID (ezyseva.pay@upi). Customer submits 12-digit UTR number.
   - Instant downloadable GST invoice (e.g. INV-2026-XXXXX) is generated immediately upon submission.
   - Shipped via India Post Speed Post with live tracking consignment number (e.g. EZTRACK-XXXXXX).

3. WhatsApp Support:
   - Customers can connect on official WhatsApp (+91 98765 43210) for 1-click order assistance, document review, and status updates.

Guidelines:
- Be clear, practical, and highly reassuring.
- Format responses cleanly with bold headings and bullet points.
- Always mention required documents when asked about any certificate or service.
- If asked about tracking an order, guide them to use 'Track PVC Card' with their Customer ID or Order ID.
- Keep answers focused, structured, and easy to read.`;

      const contents = [];
      if (conversationHistory && Array.isArray(conversationHistory)) {
        for (const item of conversationHistory.slice(-6)) {
          if (item.sender === 'user') {
            contents.push({ role: 'user', parts: [{ text: item.text }] });
          } else if (item.sender === 'ai') {
            contents.push({ role: 'model', parts: [{ text: item.text }] });
          }
        }
      }
      contents.push({ role: 'user', parts: [{ text: message }] });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        }
      });

      const replyText = response.text || getRuleBasedResponse(message);

      res.json({
        reply: replyText,
        source: "gemini-3.8-flash"
      });
    } catch (error) {
      console.error("AI Assistant Error:", error);
      // Fallback seamlessly so customer experience is uninterrupted
      const fallbackReply = getRuleBasedResponse(req.body?.message || "");
      res.json({
        reply: fallbackReply,
        source: "knowledge_base_fallback"
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EzySeva Online Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
