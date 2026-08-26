export type VerticalId = "dentists" | "restaurants" | "hotels";

export type NodeType = "greet" | "ask" | "tool" | "confirm" | "transfer" | "end";

export type FlowNode = {
  id: string;
  type: NodeType;
  label: string;
  say: string;
};

export type Turn = { role: "ai" | "caller"; text: string };

export type Template = {
  id: string;
  vertical: VerticalId;
  name: string;
  summary: string;
  adoptHint: string;
  nodes: FlowNode[];
  sample: Turn[];
};

export const brand = {
  name: "Helora",
  tagline: "The front desk that thinks.",
  promise: "Your existing number. An AI that actually thinks.",
};

export const verticals: Record<
  VerticalId,
  {
    id: VerticalId;
    label: string;
    eyebrow: string;
    headline: string;
    lede: string;
    pains: string[];
    wins: string[];
    href: string;
  }
> = {
  dentists: {
    id: "dentists",
    label: "Dentists",
    eyebrow: "Clinics & dental",
    headline: "Every new-patient call answered. Even at 9pm.",
    lede: "Helora books hygiene, triages emergencies, and takes a complete intake — then warm-transfers with a chart-ready summary.",
    pains: [
      "Front desk on the phone while a patient is in the chair",
      "After-hours emergencies going to voicemail",
      "New patients who hang up instead of leaving a message",
    ],
    wins: [
      "Same-day emergency slots filled automatically",
      "Insurance and new-patient questions handled without a callback",
      "Owner gets a summary, not a raw voicemail",
    ],
    href: "/dentists",
  },
  restaurants: {
    id: "restaurants",
    label: "Restaurants",
    eyebrow: "Dining rooms",
    headline: "The line rings. Tables fill. The host never leaves the floor.",
    lede: "Helora takes reservations, manages the waitlist, and answers menu questions so your hosts stay with guests — not the phone.",
    pains: [
      "Hosts juggling a ringing phone and a full waiting list",
      "No-shows from half-captured reservations",
      "Private dining inquiries that die in voicemail",
    ],
    wins: [
      "Reservations confirmed by SMS before the caller hangs up",
      "Large parties routed to the right book, not a sticky note",
      "Hours, allergens, and parking answered instantly",
    ],
    href: "/restaurants",
  },
  hotels: {
    id: "hotels",
    label: "Hotels",
    eyebrow: "Hospitality",
    headline: "A night manager on every ring. Without a night manager.",
    lede: "Helora covers the front desk after hours: rooms, late checkout, local recommendations, and a clean handoff to staff when a guest needs a person.",
    pains: [
      "Overnight calls waking a skeleton staff",
      "Walk-up bookings lost because nobody picked up",
      "Concierge questions that never make it to a note",
    ],
    wins: [
      "24/7 availability and amenity answers",
      "Group and event leads captured with dates and headcount",
      "Warm transfer to the duty manager with context",
    ],
    href: "/hotels",
  },
};

export const templates: Template[] = [
  {
    id: "dental-new-patient",
    vertical: "dentists",
    name: "New patient & emergency",
    summary: "Triage pain, book the first available chair, capture insurance and a callback.",
    adoptHint:
      "If they say cracked tooth, swelling, or bleeding, offer the next emergency slot today. Otherwise book a new-patient exam.",
    nodes: [
      { id: "g", type: "greet", label: "Greet", say: "Practice name, Helora speaking. How can I help?" },
      { id: "a1", type: "ask", label: "Triage", say: "Are you in pain right now, and is this a current patient?" },
      { id: "t1", type: "tool", label: "Open schedule", say: "Checking emergency and new-patient openings." },
      { id: "a2", type: "ask", label: "Intake", say: "Name, phone, insurance, and a short note on what happened." },
      { id: "c", type: "confirm", label: "Confirm", say: "Booked Thursday 4:20pm with Dr. Shah. Text on the way." },
      { id: "x", type: "end", label: "Close", say: "We’ll see you then. Call back if the pain gets worse." },
    ],
    sample: [
      { role: "ai", text: "Cedar Park Comfort Dentistry, this is Helora. How can I help you today?" },
      { role: "caller", text: "I think I cracked a tooth. Can I get in today?" },
      { role: "ai", text: "I’m sorry you’re dealing with that. Are you in pain right now, and have you been here before?" },
      { role: "caller", text: "Yeah it hurts when I bite. I’m new." },
      { role: "ai", text: "I have an emergency opening at 4:20 this afternoon with Dr. Shah. Shall I hold it?" },
      { role: "caller", text: "Yes please." },
      { role: "ai", text: "Locked in. I’ll text the address and a short new-patient form. See you at 4:20." },
    ],
  },
  {
    id: "dental-hygiene",
    vertical: "dentists",
    name: "Hygiene recall & reschedule",
    summary: "Move cleanings, fill last-minute openings, and remind without sounding like a robot.",
    adoptHint:
      "Offer two times, then a waitlist if both miss. Never read a phone tree.",
    nodes: [
      { id: "g", type: "greet", label: "Greet", say: "Helora at the practice. Want to move a cleaning or book the next one?" },
      { id: "t1", type: "tool", label: "Lookup", say: "Find the patient and the original slot." },
      { id: "a1", type: "ask", label: "Offer times", say: "I can do Tuesday 9:00 or Friday 1:30 with Maya." },
      { id: "c", type: "confirm", label: "Confirm", say: "Moved. Calendar invite and reminder text sent." },
      { id: "x", type: "end", label: "Close", say: "You’re set. Anything else for the front desk?" },
    ],
    sample: [
      { role: "ai", text: "Hi, this is Helora at Brightside Dental. I can help reschedule." },
      { role: "caller", text: "I can’t make Thursday. Next week?" },
      { role: "ai", text: "I have Tuesday at 9 with Maya, or Friday at 1:30. Which is easier?" },
      { role: "caller", text: "Friday." },
      { role: "ai", text: "Done. Friday 1:30. I’ll text a reminder the day before." },
    ],
  },
  {
    id: "dental-faq",
    vertical: "dentists",
    name: "Insurance & office FAQ",
    summary: "PPO, hours, parking, and what to bring — then book if they’re ready.",
    adoptHint:
      "Answer from the uploaded fee and insurance sheet. If they want a quote for a crown, take a message for the coordinator.",
    nodes: [
      { id: "g", type: "greet", label: "Greet", say: "Helora at the desk. Questions or a booking?" },
      { id: "t1", type: "tool", label: "Knowledge", say: "Pull hours, accepted plans, and new-patient packet." },
      { id: "a1", type: "ask", label: "Offer book", say: "Want me to put a new-patient exam on the calendar while we’re here?" },
      { id: "tr", type: "transfer", label: "Transfer", say: "Billing questions go to Sara with a summary." },
      { id: "x", type: "end", label: "Close", say: "Packet is in your texts. See you soon." },
    ],
    sample: [
      { role: "caller", text: "Do you take Delta Dental PPO?" },
      { role: "ai", text: "Yes, we are in-network for Delta PPO. I can also book a new-patient exam if you’d like." },
      { role: "caller", text: "What should I bring?" },
      { role: "ai", text: "ID, insurance card, and a list of medications. I’ll text the forms so you can skip the clipboard." },
    ],
  },
  {
    id: "resto-reservations",
    vertical: "restaurants",
    name: "Reservations",
    summary: "Party size, time, allergies, special occasion — confirmed before they hang up.",
    adoptHint:
      "Saturday after 7 is a two-hour seating. Parties of 7+ go to the private dining book.",
    nodes: [
      { id: "g", type: "greet", label: "Greet", say: "Good evening, this is Helora at the restaurant. Reservation?" },
      { id: "a1", type: "ask", label: "Details", say: "Night, time, party size, and any allergies." },
      { id: "t1", type: "tool", label: "Book", say: "Check the book and hold the table." },
      { id: "c", type: "confirm", label: "Confirm", say: "Saturday 7:30 for four, patio, under Patel. Confirmation text sent." },
      { id: "x", type: "end", label: "Close", say: "We hold the table 15 minutes. See you Saturday." },
    ],
    sample: [
      { role: "ai", text: "Evenfall, this is Helora. How can I help?" },
      { role: "caller", text: "Table for four, Saturday around 7:30." },
      { role: "ai", text: "I have 7:30 on the patio or 8:00 in the dining room. Patio?" },
      { role: "caller", text: "Patio. One of us is gluten-free." },
      { role: "ai", text: "Noted for the kitchen. Booked Saturday 7:30 for four under Patel. I’ll text the confirmation." },
    ],
  },
  {
    id: "resto-waitlist",
    vertical: "restaurants",
    name: "Waitlist & walk-in",
    summary: "Quote a wait, take a mobile number, text when the table is ready.",
    adoptHint:
      "If the wait is over 45 minutes, offer the bar or a later reservation.",
    nodes: [
      { id: "g", type: "greet", label: "Greet", say: "Helora at the host stand — waitlist or a reservation?" },
      { id: "t1", type: "tool", label: "Quote wait", say: "Current wait is 35 minutes for two." },
      { id: "a1", type: "ask", label: "Capture", say: "Name, party size, mobile for the text." },
      { id: "c", type: "confirm", label: "Text ready", say: "You’re on the list. I’ll text when your table is 5 minutes out." },
      { id: "x", type: "end", label: "Close", say: "Bar is open if you want to wait here." },
    ],
    sample: [
      { role: "caller", text: "We’re two, can we get in tonight?" },
      { role: "ai", text: "Walk-in wait is about 35 minutes. I can put you on the list and text you." },
      { role: "caller", text: "Do it. It’s Maya, 512…" },
      { role: "ai", text: "You’re on the list, Maya, party of two. I’ll text when we’re five minutes out." },
    ],
  },
  {
    id: "resto-private",
    vertical: "restaurants",
    name: "Private dining & catering",
    summary: "Capture date, headcount, budget, and a callback for the events lead.",
    adoptHint:
      "Never quote a custom menu on the call. Collect the brief and book a tasting if they want one.",
    nodes: [
      { id: "g", type: "greet", label: "Greet", say: "Helora — private dining or catering?" },
      { id: "a1", type: "ask", label: "Brief", say: "Date, headcount, seated or cocktail, budget range." },
      { id: "t1", type: "tool", label: "Hold room", say: "Check the event calendar and hold the room 24 hours." },
      { id: "tr", type: "transfer", label: "Events lead", say: "Warm transfer or a same-day callback with notes." },
      { id: "x", type: "end", label: "Close", say: "Room is held. You’ll hear from Priya this afternoon." },
    ],
    sample: [
      { role: "caller", text: "Rehearsal dinner for 22, first Saturday in October." },
      { role: "ai", text: "The back room holds 24 seated. I can hold it 24 hours. Any dietary needs I should flag?" },
      { role: "caller", text: "Two vegetarians. Can someone call me about the wine pairing?" },
      { role: "ai", text: "Held, and I’m sending this to Priya on events. She’ll call you today." },
    ],
  },
  {
    id: "hotel-rooms",
    vertical: "hotels",
    name: "Room booking",
    summary: "Dates, room type, rate, and a hold — or a warm transfer to reservations.",
    adoptHint:
      "Quote the flexible rate first. AAA and government need an ID note on the folio.",
    nodes: [
      { id: "g", type: "greet", label: "Greet", say: "Front desk, Helora speaking. Checking in, or a reservation?" },
      { id: "a1", type: "ask", label: "Stay", say: "Arrival, nights, guests, king or two queens." },
      { id: "t1", type: "tool", label: "Availability", say: "Pull rates and remaining rooms." },
      { id: "c", type: "confirm", label: "Hold", say: "King, Oct 12–14, flexible rate. Confirmation by SMS." },
      { id: "x", type: "end", label: "Close", say: "We’re on Congress. Parking is $18 overnight." },
    ],
    sample: [
      { role: "ai", text: "The Alden Austin, this is Helora at the front desk." },
      { role: "caller", text: "Need a king, October 12th, two nights." },
      { role: "ai", text: "I have a king at the flexible rate, free cancel until 4pm the day before. Shall I hold it?" },
      { role: "caller", text: "Yes. Do you have parking?" },
      { role: "ai", text: "On-site, $18 a night. You’re confirmed Oct 12–14. I’ll text the reservation." },
    ],
  },
  {
    id: "hotel-concierge",
    vertical: "hotels",
    name: "Concierge & guest requests",
    summary: "Late checkout, extra towels, restaurant bookings, airport timing.",
    adoptHint:
      "Late checkout is complimentary until 1pm if occupancy allows, otherwise $40. Housekeeping tickets go to the board.",
    nodes: [
      { id: "g", type: "greet", label: "Greet", say: "Helora at the desk. What can I do for your stay?" },
      { id: "a1", type: "ask", label: "Room", say: "Name and room number." },
      { id: "t1", type: "tool", label: "Ticket", say: "Open a housekeeping or concierge ticket." },
      { id: "tr", type: "transfer", label: "Duty manager", say: "Escalate complaints with a summary." },
      { id: "x", type: "end", label: "Close", say: "Towels are on the way. Anything else?" },
    ],
    sample: [
      { role: "caller", text: "Room 412. Can we do a late checkout and a 6am cab to AUS?" },
      { role: "ai", text: "I can do 1pm checkout on 412, no charge tonight. I’ll arrange a car for 6am — sedan or SUV?" },
      { role: "caller", text: "Sedan is fine." },
      { role: "ai", text: "Checkout extended, car booked. I’ll text the driver details tonight." },
    ],
  },
  {
    id: "hotel-groups",
    vertical: "hotels",
    name: "Groups & events",
    summary: "Room blocks, meeting space, and a qualifying brief for sales.",
    adoptHint:
      "10+ rooms is a block. Hold nothing without a decision-maker name and email.",
    nodes: [
      { id: "g", type: "greet", label: "Greet", say: "Helora — group rooms or an event?" },
      { id: "a1", type: "ask", label: "Brief", say: "Dates, peak rooms, meeting space, decision-maker." },
      { id: "t1", type: "tool", label: "Hold", say: "Soft-hold inventory for 48 hours." },
      { id: "tr", type: "transfer", label: "Sales", say: "Pass the brief to the sales manager." },
      { id: "x", type: "end", label: "Close", say: "Soft-held. Maya in sales will send a proposal today." },
    ],
    sample: [
      { role: "caller", text: "Wedding block, 18 rooms, second weekend in May." },
      { role: "ai", text: "I can soft-hold a block for 48 hours. Who should Maya in sales send the proposal to?" },
      { role: "caller", text: "Neha Patel, neha@… and we’ll need a Friday rehearsal space." },
      { role: "ai", text: "Noted — 18 rooms plus Friday space. Maya will write you this afternoon." },
    ],
  },
];

export const steps = [
  {
    n: "01",
    title: "Keep the number you already have",
    body: "Port it, forward it, or add a local line. Helora answers first. Your staff picks up only when they should.",
  },
  {
    n: "02",
    title: "Adopt a template — or rewrite it in English",
    body: "Dentists, restaurants, and hotels share one product. You start from a conversation flow built for your floor, then change it in a sentence.",
  },
  {
    n: "03",
    title: "It talks, books, and hands off",
    body: "Multi-turn voice. Calendar, SMS, and your knowledge base. When a human is needed, they get a summary — not a cold transfer.",
  },
];

export const faqs = [
  {
    q: "Do we have to change our phone number?",
    a: "No. Keep the number on the door, the Google listing, and the business cards. Helora answers on that line.",
  },
  {
    q: "Is this an IVR?",
    a: "No menus, no “press 2 for appointments.” It is a conversation with memory, tools, and a clean handoff.",
  },
  {
    q: "One product for dentists, restaurants, and hotels?",
    a: "Yes. Same engine. Different templates. Adopt one, then edit it in plain English so it sounds like your desk.",
  },
  {
    q: "What about clinic privacy?",
    a: "Helora is designed for clinic privacy from day one — least-privilege tools, no training on your call audio, and a path to HIPAA when you need it.",
  },
  {
    q: "How long to go live?",
    a: "A template, your hours, and a calendar connection. Most desks can take a live test call the same day.",
  },
];

export function templatesFor(vertical: VerticalId) {
  return templates.filter((t) => t.vertical === vertical);
}

export const nodeTone: Record<NodeType, string> = {
  greet: "Greet",
  ask: "Ask",
  tool: "Tool",
  confirm: "Confirm",
  transfer: "Transfer",
  end: "End",
};
