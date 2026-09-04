import { Customer, Order, Service, SiteSettings } from '../types';

export const INITIAL_SERVICES: Service[] = [
  // 1. SMART PVC CARDS
  {
    id: 'srv-aadhaar-pvc',
    title: 'Aadhaar Smart PVC Card Print',
    category: 'pvc_card',
    price: 70,
    turnaroundTime: '24-48 Hours',
    description: 'High definition, water-proof, UV-coated smart PVC Aadhaar card with verified QR Code & microtext printing. Directly delivered via Speed Post.',
    requiredDocs: ['e-Aadhaar PDF or 12-digit Aadhaar Number', 'Registered Mobile for OTP (if needed)'],
    iconName: 'CreditCard',
    popular: true,
    active: true,
    badge: 'Best Seller'
  },
  {
    id: 'srv-voter-pvc',
    title: 'Voter ID (EPIC) PVC Card',
    category: 'pvc_card',
    price: 60,
    turnaroundTime: '24-48 Hours',
    description: 'Original color quality Election Commission PVC Voter card with high clarity photo, hologram replica, and secure barcode.',
    requiredDocs: ['Voter EPIC Number or e-EPIC PDF file'],
    iconName: 'Vote',
    popular: true,
    active: true,
    badge: 'Popular'
  },
  {
    id: 'srv-pan-pvc',
    title: 'Instant PAN Card PVC Print & Reprint',
    category: 'pvc_card',
    price: 80,
    turnaroundTime: '24 Hours',
    description: 'NSDL / UTI format physical PVC PAN Card reprint with photo, signature, and QR code on durable chip-grade plastic.',
    requiredDocs: ['10-digit PAN Number', 'e-PAN PDF copy or Photo/Signature scan'],
    iconName: 'FileCheck',
    popular: true,
    active: true,
    badge: 'PVC Smart'
  },
  {
    id: 'srv-dl-pvc',
    title: 'Driving Licence Smart PVC Card',
    category: 'pvc_card',
    price: 90,
    turnaroundTime: '24-48 Hours',
    description: 'Parivahan Sarathi standard PVC Driving Licence with blood group, endorsement categories, and microchip graphic.',
    requiredDocs: ['DL Number & Date of Birth', 'DigiLocker / Parivahan PDF copy'],
    iconName: 'Car',
    popular: false,
    active: true,
    badge: 'Smart Card'
  },
  {
    id: 'srv-ayushman-pvc',
    title: 'Ayushman Bharat (ABHA / PMJAY) PVC Card',
    category: 'pvc_card',
    price: 50,
    turnaroundTime: '24 Hours',
    description: 'Pradhan Mantri Jan Arogya Yojana (PMJAY) ₹5 Lakh medical treatment benefit card printed on durable waterproof PVC.',
    requiredDocs: ['PMJAY Family ID / ABHA Number / e-Card PDF'],
    iconName: 'ShieldAlert',
    popular: true,
    active: true,
    badge: '₹5 Lakh Health'
  },
  {
    id: 'srv-ration-pvc',
    title: 'Digital Ration Card Smart PVC',
    category: 'pvc_card',
    price: 65,
    turnaroundTime: '24-48 Hours',
    description: 'State Food & Supplies Digital Ration Card with full family member list and QR barcode on hard PVC plastic.',
    requiredDocs: ['Ration Card Number (RC No) & State/District'],
    iconName: 'Receipt',
    popular: false,
    active: true
  },
  {
    id: 'srv-eshram-pvc',
    title: 'e-Shram Smart PVC Card Print',
    category: 'pvc_card',
    price: 50,
    turnaroundTime: '24 Hours',
    description: 'Ministry of Labour e-Shram UAN Card waterproof thermal print with 12-digit UAN and barcode.',
    requiredDocs: ['e-Shram 12-digit UAN Number or PDF download'],
    iconName: 'Briefcase',
    popular: false,
    active: true,
    badge: 'Labour Portal'
  },
  {
    id: 'srv-kisan-pvc',
    title: 'PM-Kisan & KCC Smart PVC Card',
    category: 'pvc_card',
    price: 55,
    turnaroundTime: '24-48 Hours',
    description: 'Pradhan Mantri Kisan Samman Nidhi farmer registration & KCC identifier card on durable plastic.',
    requiredDocs: ['PM Kisan Registration ID or Aadhaar Number'],
    iconName: 'Landmark',
    popular: false,
    active: true
  },

  // 2. IDENTITY & GOVT ONLINE FORMS (category: document)
  {
    id: 'srv-pan-new',
    title: 'New PAN Card Application (Form 49A)',
    category: 'document',
    price: 160,
    turnaroundTime: '3-5 Working Days',
    description: 'Complete online Form 49A filing, biometric e-KYC or physical document processing with instant e-PAN and physical card delivery.',
    requiredDocs: ['Aadhaar Card (matching DOB & Name)', '2 Passport size color photographs', 'Signature on white paper'],
    iconName: 'FileText',
    popular: true,
    active: true,
    badge: 'NSDL / UTI'
  },
  {
    id: 'srv-pan-correction',
    title: 'PAN Card Correction & Name/DOB Update',
    category: 'document',
    price: 150,
    turnaroundTime: '4-7 Working Days',
    description: 'Correction of spelling mistakes in Name, Father Name, Date of Birth, or Photo/Signature mismatch on your PAN Card.',
    requiredDocs: ['Existing PAN Card copy', 'Aadhaar Card with correct details', 'Proof of change (Marriage Cert / Gazette / 10th Admit)'],
    iconName: 'FileCheck',
    popular: true,
    active: true,
    badge: 'Correction'
  },
  {
    id: 'srv-pan-aadhaar-link',
    title: 'Aadhaar-PAN Linking & Inoperative Resolution',
    category: 'document',
    price: 50,
    turnaroundTime: 'Instant (1-2 Hours)',
    description: 'Check linkage status, guide on challan penalty payment, and resolve inoperative PAN cards with the Income Tax department.',
    requiredDocs: ['10-digit PAN Number', '12-digit Aadhaar Number'],
    iconName: 'KeyRound',
    popular: false,
    active: true
  },
  {
    id: 'srv-eaadhaar-download',
    title: 'Instant e-Aadhaar Download & Color Lamination',
    category: 'document',
    price: 40,
    turnaroundTime: 'Instant (15 Mins)',
    description: 'Official UIDAI password-protected e-Aadhaar retrieval, digital signature validation, and color print with heavy pouch lamination.',
    requiredDocs: ['Aadhaar Number / Enrolment No (EID)', 'OTP from registered mobile number'],
    iconName: 'CreditCard',
    popular: true,
    active: true
  },
  {
    id: 'srv-voter-new',
    title: 'New Voter Card Registration (Form 6) & Shift',
    category: 'document',
    price: 80,
    turnaroundTime: '7-10 Working Days',
    description: 'ECI National Voter Service Portal (VHA) online form submission for new voters (18+), assembly constituency transfer (Form 8).',
    requiredDocs: ['Aadhaar Card', 'Passport size photo', 'Age proof (10th Admit/Birth Cert)', 'Current Address proof'],
    iconName: 'Vote',
    popular: false,
    active: true,
    badge: 'Form 6 / 8'
  },
  {
    id: 'srv-passport-seva',
    title: 'Passport Seva Online Appointment & Form Assist',
    category: 'document',
    price: 250,
    turnaroundTime: '1 Working Day',
    description: 'Fresh Normal/Tatkal Passport application filing, PSK / POPSK appointment slot booking, fee payment receipt generation.',
    requiredDocs: ['Aadhaar Card', 'PAN Card / Voter ID', '10th/12th Pass Certificate (for Non-ECR)', 'Bank Passbook with photo'],
    iconName: 'Compass',
    popular: true,
    active: true,
    badge: 'Passport'
  },
  {
    id: 'srv-driving-licence',
    title: 'Learner Licence (LL) & Driving Licence (DL) Slot',
    category: 'document',
    price: 200,
    turnaroundTime: '1-2 Days',
    description: 'Parivahan Sarathi online application, slot booking for Learner License test, LL approval tracking, and permanent DL slot.',
    requiredDocs: ['Aadhaar Card', 'Blood Group Report', 'Passport size photo', 'Medical Fitness Form 1A (if required)'],
    iconName: 'Car',
    popular: false,
    active: true,
    badge: 'Parivahan'
  },
  {
    id: 'srv-vehicle-rc',
    title: 'Vehicle RC Status, Duplicate RC & Road Tax',
    category: 'document',
    price: 120,
    turnaroundTime: '1-2 Days',
    description: 'Vahan portal RC search, duplicate RC application, vehicle fitness status, and state road tax online payment receipt.',
    requiredDocs: ['Vehicle Registration Number', 'Chassis Number (last 5 digits)', 'Owner Aadhaar/Insurance copy'],
    iconName: 'Car',
    popular: false,
    active: true
  },
  {
    id: 'srv-police-verification',
    title: 'Police Clearance Certificate (PCC) Online Apply',
    category: 'document',
    price: 150,
    turnaroundTime: '2 Working Days',
    description: 'Online application for Job/Passport Police Clearance Certificate with tracking reference number.',
    requiredDocs: ['Aadhaar Card', 'Passport / Job Offer Letter', 'Address Proof & Recent Photo'],
    iconName: 'ShieldAlert',
    popular: false,
    active: true
  },
  {
    id: 'srv-trade-license',
    title: 'Trade License Online Application & Renewal',
    category: 'document',
    price: 200,
    turnaroundTime: '2-3 Working Days',
    description: 'Gram Panchayat & Municipal Corporation official Trade License application, fee calculation, and certificate download.',
    requiredDocs: ['Business Proof / Shop Deed or Rent Agreement', 'Proprietor Aadhaar & PAN Card', 'Holding Tax / Electricity Bill'],
    iconName: 'Building',
    popular: false,
    active: true,
    badge: 'Business'
  },

  // 3. CERTIFICATES & GOVT WELFARE SCHEMES (category: certificate)
  {
    id: 'srv-birth-cert',
    title: 'Birth / Death Certificate Search & Print',
    category: 'certificate',
    price: 110,
    turnaroundTime: '1-2 Working Days',
    description: 'Digitally signed official municipal/panchayat birth or death certificate search, digital sign verification, and PVC/Laminated print.',
    requiredDocs: ['Registration Number / Acknowledgement Slip', 'Hospital discharge or date/place details'],
    iconName: 'Baby',
    popular: true,
    active: true,
    badge: 'Digital Sign'
  },
  {
    id: 'srv-caste-cert',
    title: 'SC / ST / OBC Caste Certificate Online Apply',
    category: 'certificate',
    price: 150,
    turnaroundTime: '3-5 Working Days',
    description: 'Backward Classes Welfare Dept application submission, pedigree/vanshavali genealogy verification assistance, and tracking.',
    requiredDocs: ['Aadhaar & Voter Card', 'Blood relation Caste Certificate (Father/Brother/Uncle)', 'Ancestral 1950/1971 proof or Land deed', 'Pradhan/Councillor certificate'],
    iconName: 'Award',
    popular: true,
    active: true,
    badge: 'OBC/SC/ST'
  },
  {
    id: 'srv-income-cert',
    title: 'Income Certificate (SDO / BDO e-District)',
    category: 'certificate',
    price: 120,
    turnaroundTime: '2-4 Working Days',
    description: 'State e-District portal application for official Income Certificate required for scholarships, admissions, and government schemes.',
    requiredDocs: ['Aadhaar Card & Ration Card', 'Salary Slip / Income proof from Panchayat Pradhan or Councillor', 'Recent Photo'],
    iconName: 'Award',
    popular: true,
    active: true,
    badge: 'e-District'
  },
  {
    id: 'srv-domicile-cert',
    title: 'Residential / Domicile Certificate Online',
    category: 'certificate',
    price: 100,
    turnaroundTime: '2-3 Working Days',
    description: 'Official District Magistrate / SDO verified Residential / Domicile certificate application for defence, army, and police recruitment.',
    requiredDocs: ['Aadhaar Card', 'Voter ID of applicant or parent', '10+ years residential proof (Electricity Bill / Land Document)'],
    iconName: 'Building',
    popular: false,
    active: true
  },
  {
    id: 'srv-udid-card',
    title: 'UDID Swavlamban Divyang Disability Card',
    category: 'certificate',
    price: 80,
    turnaroundTime: '3-5 Working Days',
    description: 'Unique Disability ID (UDID) portal online registration for Swavlamban health, travel pass, and government pension benefits.',
    requiredDocs: ['Disability Certificate issued by Medical Hospital Board', 'Aadhaar Card', 'Passport size photograph'],
    iconName: 'HeartPulse',
    popular: false,
    active: true,
    badge: 'Divyang'
  },
  {
    id: 'srv-pm-kisan',
    title: 'PM Kisan Samman Nidhi eKYC & Registration',
    category: 'certificate',
    price: 90,
    turnaroundTime: '1 Working Day',
    description: '₹6,000 yearly government assistance registration for farmers, biometric/OTP e-KYC, land mutation seed, and NPCI bank link check.',
    requiredDocs: ['Land Record (Khatian / Porcha / RoR)', 'Aadhaar Card with linked mobile', 'Bank Passbook with Aadhaar Seeding'],
    iconName: 'Landmark',
    popular: true,
    active: true,
    badge: '₹6,000 / Yr'
  },
  {
    id: 'srv-welfare-bhandar',
    title: 'Lakshmir Bhandar, Kanyashree & Rupashree Form Assist',
    category: 'certificate',
    price: 60,
    turnaroundTime: 'Same Day',
    description: 'Form filling, document indexing, Swasthyasathi linking, and status verification for women and girl welfare schemes.',
    requiredDocs: ['Swasthyasathi Card', 'Aadhaar Card', 'Bank Passbook (Single name account)'],
    iconName: 'HeartPulse',
    popular: true,
    active: true,
    badge: 'Welfare'
  },
  {
    id: 'srv-scholarship',
    title: 'Oasis, SVMCM & NSP National Scholarship Apply',
    category: 'certificate',
    price: 120,
    turnaroundTime: '1-2 Working Days',
    description: 'Swami Vivekananda Merit-cum-Means (SVMCM), Oasis SC/ST/OBC, and National Scholarship Portal (NSP) complete form submission.',
    requiredDocs: ['Last Qualifying Exam Marksheet (60%+ for SVMCM)', 'Admission Fee Receipt & Student ID', 'Income Certificate', 'Bank Passbook'],
    iconName: 'GraduationCap',
    popular: true,
    active: true,
    badge: 'Scholarship'
  },
  {
    id: 'srv-epfo-pf',
    title: 'EPFO / PF Balance Check, UAN & Claim Withdrawal',
    category: 'certificate',
    price: 150,
    turnaroundTime: '1-2 Working Days',
    description: 'EPFO Member Portal UAN activation, e-Nomination, KYC bank approval, and Form 19/10C/31 advance PF withdrawal claim submission.',
    requiredDocs: ['UAN Number & Password', 'Aadhaar Card with linked mobile', 'Cancelled Bank Cheque / Passbook copy'],
    iconName: 'Banknote',
    popular: true,
    active: true,
    badge: 'EPFO PF'
  },

  // 4. UTILITIES, BILL PAYMENTS & BANKING (category: utility)
  {
    id: 'srv-electricity-bill',
    title: 'State Electricity Bill Payment (WBSEDCL & Others)',
    category: 'utility',
    price: 20,
    turnaroundTime: 'Instant (5 Mins)',
    description: 'Pay your domestic, commercial, or agricultural electricity bills with 100% genuine instant official government receipt.',
    requiredDocs: ['Consumer ID / Installation Number'],
    iconName: 'Zap',
    popular: true,
    active: true,
    badge: 'Instant Receipt'
  },
  {
    id: 'srv-water-tax',
    title: 'Municipal Property & Water Holding Tax Payment',
    category: 'utility',
    price: 30,
    turnaroundTime: 'Instant (15 Mins)',
    description: 'Municipality holding tax, water connection cess, and corporation trade charges payment with digital challan.',
    requiredDocs: ['Assessment Number / Holding Number', 'Ward Number'],
    iconName: 'Building',
    popular: false,
    active: true
  },
  {
    id: 'srv-lpg-gas',
    title: 'LPG Gas Cylinder Booking & Ujjwala Scheme',
    category: 'utility',
    price: 30,
    turnaroundTime: 'Instant',
    description: 'Indane, HP, and Bharat Gas cylinder instant booking, subsidy status check, and PM Ujjwala free connection guidance.',
    requiredDocs: ['Consumer Number & Distributor Code', 'Registered Phone'],
    iconName: 'Fuel',
    popular: false,
    active: true
  },
  {
    id: 'srv-aeps-banking',
    title: 'Grahak Seva Kendra (CSP) AEPS Cash Withdrawal & DMT',
    category: 'utility',
    price: 25,
    turnaroundTime: 'Instant (5 Mins)',
    description: 'Biometric Aadhaar ATM cash withdrawal, mini-statement, balance inquiry, and 24x7 IMPS Domestic Money Transfer to any Indian bank.',
    requiredDocs: ['Aadhaar Number', 'Bank Name & Biometric fingerprint'],
    iconName: 'Banknote',
    popular: true,
    active: true,
    badge: 'Cash AEPS'
  },
  {
    id: 'srv-irctc-train',
    title: 'IRCTC Train Ticket Reservation & Tatkal Booking',
    category: 'utility',
    price: 60,
    turnaroundTime: 'Instant Slot',
    description: 'Authorized Indian Railways confirmed ticket booking, Tatkal / Premium Tatkal reservation, PNR status check, and cancellation refund.',
    requiredDocs: ['Passenger Names, Age, Gender', 'Train Number / Journey Date & Destination'],
    iconName: 'Train',
    popular: true,
    active: true,
    badge: 'Train Booking'
  },
  {
    id: 'srv-flight-bus',
    title: 'Domestic Flight & Interstate Luxury Bus Booking',
    category: 'utility',
    price: 100,
    turnaroundTime: 'Instant',
    description: 'Lowest airfare domestic flight comparison & booking (IndiGo, Air India) and RedBus luxury AC sleeper bus ticket booking.',
    requiredDocs: ['Passenger Government ID Names', 'Travel Date & Route'],
    iconName: 'Plane',
    popular: false,
    active: true
  },
  {
    id: 'srv-fastag',
    title: 'FASTag Purchase, Vehicle Linking & Instant Recharge',
    category: 'utility',
    price: 50,
    turnaroundTime: 'Instant (10 Mins)',
    description: 'Buy new NPCI NHAI compliant FASTag, activate against Vehicle RC, and instant UPI recharge for highway toll plazas.',
    requiredDocs: ['Vehicle RC Copy', 'Vehicle Owner Aadhaar / Phone'],
    iconName: 'Car',
    popular: false,
    active: true
  }
];

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  siteName: 'MA TARA CYBER CAFE',
  tagline: 'Online Seva Kendra, Smart PVC Cards, Government Forms & High-Speed Cyber Services',
  logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&h=200&q=80&fm=jpg',
  bannerHeadline: 'MA TARA CYBER CAFE - Smart PVC Cards & Digital Govt Services',
  bannerSubheadline: 'Doorstep Speed Post delivery for PVC Aadhaar, Voter, PAN, Ayushman cards, and online form services across all districts.',
  bannerImageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&h=600&q=80&fm=jpg',
  bannerBadge: '⚡ Over 45,000+ Happy Customers & CSC Certified',
  noticeText: '📢 Special Notice: High Speed Post delivery active to all West Bengal, Bihar, UP and Pan-India districts. Use your Customer ID to track all orders in real-time!',
  contactPhone: '+91 98765 43210',
  contactEmail: 'support@ezyseva.in',
  contactWhatsApp: '+91 98765 43210',
  supportHours: 'Mon - Sat: 9:00 AM - 8:00 PM',
  officeAddress: 'Main CSC Seva Complex, Station Road, Howrah - 711101, West Bengal, India',
  upiId: 'ezyseva.pay@upi',
  upiMerchantName: 'EzySeva Digital Services',
  upiQrImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&format=jpg&data=upi://pay?pa=ezyseva.pay@upi&pn=EzySeva%20Digital%20Services&cu=INR',
  deliveryFeePerOrder: 30 // Free on bulk, or standard speed post
};

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    customerCode: 'EZ-829104',
    fullName: 'Rahul Sharma',
    phone: '9876501234',
    email: 'rahul.sharma@example.com',
    state: 'West Bengal',
    district: 'North 24 Parganas',
    pinCode: '700124',
    address: 'Flat 3B, Greenview Enclave, Barasat Road, Near Railway Gate 2',
    createdAt: '2026-08-15T10:30:00.000Z',
    password: 'password123'
  },
  {
    id: 'cust-2',
    customerCode: 'EZ-640192',
    fullName: 'Priya Mukherjee',
    phone: '9123456789',
    email: 'priya.m@example.com',
    state: 'West Bengal',
    district: 'Kolkata',
    pinCode: '700029',
    address: '45/2 Rashbehari Avenue, Gariahat',
    createdAt: '2026-08-20T14:15:00.000Z',
    password: 'password123'
  },
  {
    id: 'cust-3',
    customerCode: 'EZ-918234',
    fullName: 'Amit Kumar Verma',
    phone: '9835012345',
    email: 'amit.verma@example.com',
    state: 'Bihar',
    district: 'Patna',
    pinCode: '800001',
    address: 'House No 12, Fraser Road, Near Dak Bungalow Chowk',
    createdAt: '2026-08-28T09:00:00.000Z',
    password: 'password123'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-98241',
    invoiceNumber: 'INV-2026-98241',
    customerId: 'cust-1',
    customerCode: 'EZ-829104',
    customerName: 'Rahul Sharma',
    customerPhone: '9876501234',
    customerEmail: 'rahul.sharma@example.com',
    serviceId: 'srv-aadhaar-pvc',
    serviceTitle: 'Aadhaar Smart PVC Card Print',
    serviceCategory: 'pvc_card',
    servicePrice: 70,
    quantity: 2,
    deliveryCharge: 30,
    totalAmount: 170,
    shippingAddress: {
      recipientName: 'Rahul Sharma',
      phone: '9876501234',
      state: 'West Bengal',
      district: 'North 24 Parganas',
      pinCode: '700124',
      fullAddress: 'Flat 3B, Greenview Enclave, Barasat Road, Near Railway Gate 2'
    },
    documentNumber: 'XXXX-XXXX-8921',
    uploadedDocumentName: 'e-Aadhaar-masked.pdf',
    status: 'Dispatched',
    payment: {
      status: 'Verified',
      method: 'UPI_QR',
      utrNumber: '428901847192',
      paidAt: '2026-09-01T11:20:00.000Z',
      verifiedAt: '2026-09-01T11:45:00.000Z'
    },
    tracking: {
      trackingNumber: 'EZTRACK-782194',
      courierPartner: 'India Post Speed Post',
      dispatchedAt: '2026-09-02T15:00:00.000Z',
      estimatedDelivery: '2026-09-05',
      currentLocation: 'Kolkata NSH (National Sorting Hub)',
      history: [
        {
          status: 'Order Placed',
          date: '2026-09-01 11:20 AM',
          location: 'EzySeva Online Portal',
          note: 'Order submitted with UPI Payment UTR 428901847192',
          completed: true
        },
        {
          status: 'Payment Verified',
          date: '2026-09-01 11:45 AM',
          location: 'EzySeva Accounts Desk',
          note: 'UPI Payment received and verified successfully',
          completed: true
        },
        {
          status: 'PVC Card Printed & QC Passed',
          date: '2026-09-02 11:00 AM',
          location: 'Central PVC Lab #3',
          note: 'Smart PVC Card printed with UV protective coating and QR verify',
          completed: true
        },
        {
          status: 'Dispatched via Speed Post',
          date: '2026-09-02 03:00 PM',
          location: 'Howrah RMS Booking Center',
          note: 'Article booked via India Post Speed Post. Consignment: EZTRACK-782194',
          completed: true
        },
        {
          status: 'In Transit',
          date: '2026-09-03 08:30 AM',
          location: 'Kolkata NSH Sorting Office',
          note: 'Bag received and forwarded to Destination Delivery Post Office',
          completed: true
        },
        {
          status: 'Out for Delivery',
          date: 'Pending',
          location: 'Barasat Sub Post Office',
          note: 'Will be sent out for doorstep delivery with postman',
          completed: false
        }
      ]
    },
    createdAt: '2026-09-01T11:20:00.000Z',
    updatedAt: '2026-09-03T08:30:00.000Z'
  },
  {
    id: 'ORD-98242',
    invoiceNumber: 'INV-2026-98242',
    customerId: 'cust-2',
    customerCode: 'EZ-640192',
    customerName: 'Priya Mukherjee',
    customerPhone: '9123456789',
    customerEmail: 'priya.m@example.com',
    serviceId: 'srv-voter-pvc',
    serviceTitle: 'Voter ID (EPIC) PVC Card',
    serviceCategory: 'pvc_card',
    servicePrice: 60,
    quantity: 1,
    deliveryCharge: 30,
    totalAmount: 90,
    shippingAddress: {
      recipientName: 'Priya Mukherjee',
      phone: '9123456789',
      state: 'West Bengal',
      district: 'Kolkata',
      pinCode: '700029',
      fullAddress: '45/2 Rashbehari Avenue, Gariahat'
    },
    documentNumber: 'WB/14/092/189201',
    uploadedDocumentName: 'epic_voter_card.pdf',
    status: 'Printing',
    payment: {
      status: 'Verified',
      method: 'UPI_QR',
      utrNumber: '429011928374',
      paidAt: '2026-09-02T16:10:00.000Z',
      verifiedAt: '2026-09-02T16:35:00.000Z'
    },
    tracking: {
      trackingNumber: 'EZTRACK-649102',
      courierPartner: 'India Post Speed Post',
      estimatedDelivery: '2026-09-06',
      history: [
        {
          status: 'Order Placed',
          date: '2026-09-02 04:10 PM',
          location: 'EzySeva Online Portal',
          note: 'Order submitted with UPI Payment UTR 429011928374',
          completed: true
        },
        {
          status: 'Payment Verified',
          date: '2026-09-02 04:35 PM',
          location: 'EzySeva Accounts Desk',
          note: 'Payment verified and sent to PVC Card printing queue',
          completed: true
        },
        {
          status: 'Printing in Progress',
          date: '2026-09-03 09:30 AM',
          location: 'Central PVC Lab',
          note: 'High-definition thermal sublimation printing underway',
          completed: true
        }
      ]
    },
    createdAt: '2026-09-02T16:10:00.000Z',
    updatedAt: '2026-09-03T09:30:00.000Z'
  },
  {
    id: 'ORD-98243',
    invoiceNumber: 'INV-2026-98243',
    customerId: 'cust-3',
    customerCode: 'EZ-918234',
    customerName: 'Amit Kumar Verma',
    customerPhone: '9835012345',
    customerEmail: 'amit.verma@example.com',
    serviceId: 'srv-pan-pvc',
    serviceTitle: 'Instant PAN Card PVC Print & Reprint',
    serviceCategory: 'pvc_card',
    servicePrice: 80,
    quantity: 1,
    deliveryCharge: 30,
    totalAmount: 110,
    shippingAddress: {
      recipientName: 'Amit Kumar Verma',
      phone: '9835012345',
      state: 'Bihar',
      district: 'Patna',
      pinCode: '800001',
      fullAddress: 'House No 12, Fraser Road, Near Dak Bungalow Chowk'
    },
    documentNumber: 'ABCDE1234F',
    uploadedDocumentName: 'e-PAN_card_copy.pdf',
    status: 'Pending',
    payment: {
      status: 'Pending',
      method: 'UPI_QR',
      utrNumber: '429188204918',
      paidAt: '2026-09-03T19:40:00.000Z'
    },
    createdAt: '2026-09-03T19:40:00.000Z',
    updatedAt: '2026-09-03T19:40:00.000Z'
  }
];
