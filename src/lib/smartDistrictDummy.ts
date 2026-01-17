export type LocalizedText = { bn: string; en: string };

export type District = {
  id: string;
  name: LocalizedText;
  upazilas: { id: string; name: LocalizedText }[];
};

export type TravelSpot = {
  id: string;
  districtId: string;
  upazilaId: string;
  name: LocalizedText;
  type: "Nature" | "Historical" | "Religious" | "Adventure";
  summary: LocalizedText;
  lat: number;
  lng: number;
};

export type MedicalService = {
  id: string;
  districtId: string;
  upazilaId: string;
  name: LocalizedText;
  kind:
    | "District Hospital"
    | "Upazila Health Complex"
    | "Government Hospital"
    | "Private Hospital"
    | "Diagnostic Center";
  emergencyPhone: string;
  lat: number;
  lng: number;
  /** Marked demo to avoid misrepresenting phone numbers as verified */
  isDemo?: boolean;
};

export type BloodBankService = {
  id: string;
  districtId: string;
  upazilaId: string;
  name: LocalizedText;
  phone: string;
  availability: "24/7" | "Limited";
  orgType?: "Red Crescent" | "Sandhani" | "Government" | "Private" | "NGO";
  lat: number;
  lng: number;
  isDemo?: boolean;
};

export const DISTRICTS: District[] = [
  {
    id: "bagerhat",
    name: { bn: "বাগেরহাট", en: "Bagerhat" },
    upazilas: [],
  },
  {
    id: "bandarban",
    name: { bn: "বান্দরবান", en: "Bandarban" },
    upazilas: [
      { id: "bandarban-sadar", name: { bn: "বান্দরবান সদর", en: "Bandarban Sadar" } },
      { id: "thanchi", name: { bn: "থানচি", en: "Thanchi" } },
    ],
  },
  {
    id: "barguna",
    name: { bn: "বরগুনা", en: "Barguna" },
    upazilas: [],
  },
  {
    id: "barishal",
    name: { bn: "বরিশাল", en: "Barishal" },
    upazilas: [],
  },
  {
    id: "bhola",
    name: { bn: "ভোলা", en: "Bhola" },
    upazilas: [],
  },
  {
    id: "bogura",
    name: { bn: "বগুড়া", en: "Bogura" },
    upazilas: [{ id: "bogura-sadar", name: { bn: "বগুড়া সদর", en: "Bogura Sadar" } }],
  },
  {
    id: "brahmanbaria",
    name: { bn: "ব্রাহ্মণবাড়িয়া", en: "Brahmanbaria" },
    upazilas: [],
  },
  {
    id: "chandpur",
    name: { bn: "চাঁদপুর", en: "Chandpur" },
    upazilas: [],
  },
  {
    id: "chapainawabganj",
    name: { bn: "চাঁপাইনবাবগঞ্জ", en: "Chapainawabganj" },
    upazilas: [],
  },
  {
    id: "chattogram",
    name: { bn: "চট্টগ্রাম", en: "Chattogram" },
    upazilas: [
      { id: "pahartali", name: { bn: "পাহাড়তলী", en: "Pahartali" } },
      { id: "sitakunda", name: { bn: "সীতাকুণ্ড", en: "Sitakunda" } },
      { id: "patiya", name: { bn: "পটিয়া", en: "Patiya" } },
    ],
  },
  {
    id: "chuadanga",
    name: { bn: "চুয়াডাঙ্গা", en: "Chuadanga" },
    upazilas: [],
  },
  {
    id: "coxsbazar",
    name: { bn: "কক্সবাজার", en: "Cox's Bazar" },
    upazilas: [
      { id: "coxsbazar-sadar", name: { bn: "কক্সবাজার সদর", en: "Cox's Bazar Sadar" } },
      { id: "ukhia", name: { bn: "উখিয়া", en: "Ukhia" } },
      { id: "teknaf", name: { bn: "টেকনাফ", en: "Teknaf" } },
    ],
  },
  {
    id: "cumilla",
    name: { bn: "কুমিল্লা", en: "Cumilla" },
    upazilas: [],
  },
  {
    id: "dhaka",
    name: { bn: "ঢাকা", en: "Dhaka" },
    upazilas: [
      { id: "dhanmondi", name: { bn: "ধানমন্ডি", en: "Dhanmondi" } },
      { id: "mirpur", name: { bn: "মিরপুর", en: "Mirpur" } },
      { id: "savar", name: { bn: "সাভার", en: "Savar" } },
    ],
  },
  {
    id: "dinajpur",
    name: { bn: "দিনাজপুর", en: "Dinajpur" },
    upazilas: [],
  },
  {
    id: "faridpur",
    name: { bn: "ফরিদপুর", en: "Faridpur" },
    upazilas: [],
  },
  {
    id: "feni",
    name: { bn: "ফেনী", en: "Feni" },
    upazilas: [],
  },
  {
    id: "gaibandha",
    name: { bn: "গাইবান্ধা", en: "Gaibandha" },
    upazilas: [],
  },
  {
    id: "gazipur",
    name: { bn: "গাজীপুর", en: "Gazipur" },
    upazilas: [],
  },
  {
    id: "gopalganj",
    name: { bn: "গোপালগঞ্জ", en: "Gopalganj" },
    upazilas: [],
  },
  {
    id: "habiganj",
    name: { bn: "হবিগঞ্জ", en: "Habiganj" },
    upazilas: [],
  },
  {
    id: "jamalpur",
    name: { bn: "জামালপুর", en: "Jamalpur" },
    upazilas: [],
  },
  {
    id: "jashore",
    name: { bn: "যশোর", en: "Jashore" },
    upazilas: [],
  },
  {
    id: "jhalokati",
    name: { bn: "ঝালকাঠি", en: "Jhalokati" },
    upazilas: [],
  },
  {
    id: "jhenaidah",
    name: { bn: "ঝিনাইদহ", en: "Jhenaidah" },
    upazilas: [],
  },
  {
    id: "joypurhat",
    name: { bn: "জয়পুরহাট", en: "Joypurhat" },
    upazilas: [],
  },
  {
    id: "khagrachhari",
    name: { bn: "খাগড়াছড়ি", en: "Khagrachhari" },
    upazilas: [],
  },
  {
    id: "khulna",
    name: { bn: "খুলনা", en: "Khulna" },
    upazilas: [
      { id: "khulna-sadar", name: { bn: "খুলনা সদর", en: "Khulna Sadar" } },
      { id: "dacope", name: { bn: "ডাকোপ", en: "Dacope" } },
    ],
  },
  {
    id: "kishoreganj",
    name: { bn: "কিশোরগঞ্জ", en: "Kishoreganj" },
    upazilas: [],
  },
  {
    id: "kurigram",
    name: { bn: "কুড়িগ্রাম", en: "Kurigram" },
    upazilas: [],
  },
  {
    id: "kushtia",
    name: { bn: "কুষ্টিয়া", en: "Kushtia" },
    upazilas: [],
  },
  {
    id: "lakshmipur",
    name: { bn: "লক্ষ্মীপুর", en: "Lakshmipur" },
    upazilas: [],
  },
  {
    id: "lalmonirhat",
    name: { bn: "লালমনিরহাট", en: "Lalmonirhat" },
    upazilas: [],
  },
  {
    id: "madaripur",
    name: { bn: "মাদারীপুর", en: "Madaripur" },
    upazilas: [],
  },
  {
    id: "magura",
    name: { bn: "মাগুরা", en: "Magura" },
    upazilas: [],
  },
  {
    id: "manikganj",
    name: { bn: "মানিকগঞ্জ", en: "Manikganj" },
    upazilas: [],
  },
  {
    id: "meherpur",
    name: { bn: "মেহেরপুর", en: "Meherpur" },
    upazilas: [],
  },
  {
    id: "moulvibazar",
    name: { bn: "মৌলভীবাজার", en: "Moulvibazar" },
    upazilas: [],
  },
  {
    id: "munshiganj",
    name: { bn: "মুন্সিগঞ্জ", en: "Munshiganj" },
    upazilas: [],
  },
  {
    id: "mymensingh",
    name: { bn: "ময়মনসিংহ", en: "Mymensingh" },
    upazilas: [],
  },
  {
    id: "naogaon",
    name: { bn: "নওগাঁ", en: "Naogaon" },
    upazilas: [],
  },
  {
    id: "narail",
    name: { bn: "নড়াইল", en: "Narail" },
    upazilas: [],
  },
  {
    id: "narayanganj",
    name: { bn: "নারায়ণগঞ্জ", en: "Narayanganj" },
    upazilas: [],
  },
  {
    id: "narsingdi",
    name: { bn: "নরসিংদী", en: "Narsingdi" },
    upazilas: [],
  },
  {
    id: "natore",
    name: { bn: "নাটোর", en: "Natore" },
    upazilas: [],
  },
  {
    id: "netrokona",
    name: { bn: "নেত্রকোণা", en: "Netrokona" },
    upazilas: [],
  },
  {
    id: "nilphamari",
    name: { bn: "নীলফামারী", en: "Nilphamari" },
    upazilas: [],
  },
  {
    id: "noakhali",
    name: { bn: "নোয়াখালী", en: "Noakhali" },
    upazilas: [],
  },
  {
    id: "pabna",
    name: { bn: "পাবনা", en: "Pabna" },
    upazilas: [],
  },
  {
    id: "panchagarh",
    name: { bn: "পঞ্চগড়", en: "Panchagarh" },
    upazilas: [],
  },
  {
    id: "patuakhali",
    name: { bn: "পটুয়াখালী", en: "Patuakhali" },
    upazilas: [],
  },
  {
    id: "pirojpur",
    name: { bn: "পিরোজপুর", en: "Pirojpur" },
    upazilas: [],
  },
  {
    id: "rajbari",
    name: { bn: "রাজবাড়ী", en: "Rajbari" },
    upazilas: [],
  },
  {
    id: "rajshahi",
    name: { bn: "রাজশাহী", en: "Rajshahi" },
    upazilas: [
      { id: "boalia", name: { bn: "বোয়ালিয়া", en: "Boalia" } },
      { id: "paba", name: { bn: "পবা", en: "Paba" } },
    ],
  },
  {
    id: "rangamati",
    name: { bn: "রাঙ্গামাটি", en: "Rangamati" },
    upazilas: [{ id: "rangamati-sadar", name: { bn: "রাঙ্গামাটি সদর", en: "Rangamati Sadar" } }],
  },
  {
    id: "rangpur",
    name: { bn: "রংপুর", en: "Rangpur" },
    upazilas: [],
  },
  {
    id: "satkhira",
    name: { bn: "সাতক্ষীরা", en: "Satkhira" },
    upazilas: [],
  },
  {
    id: "shariatpur",
    name: { bn: "শরীয়তপুর", en: "Shariatpur" },
    upazilas: [],
  },
  {
    id: "sherpur",
    name: { bn: "শেরপুর", en: "Sherpur" },
    upazilas: [],
  },
  {
    id: "sirajganj",
    name: { bn: "সিরাজগঞ্জ", en: "Sirajganj" },
    upazilas: [],
  },
  {
    id: "sunamganj",
    name: { bn: "সুনামগঞ্জ", en: "Sunamganj" },
    upazilas: [],
  },
  {
    id: "sylhet",
    name: { bn: "সিলেট", en: "Sylhet" },
    upazilas: [
      { id: "sylhet-sadar", name: { bn: "সিলেট সদর", en: "Sylhet Sadar" } },
      { id: "jaflong", name: { bn: "জাফলং", en: "Jaflong" } },
    ],
  },
  {
    id: "tangail",
    name: { bn: "টাঙ্গাইল", en: "Tangail" },
    upazilas: [],
  },
  {
    id: "thakurgaon",
    name: { bn: "ঠাকুরগাঁও", en: "Thakurgaon" },
    upazilas: [],
  },
];

export const TRAVEL_SPOTS: TravelSpot[] = [
  // Seeded local dataset (user-provided names). Coordinates are approximate (deterministic) for map display.
  // Dhaka
  {
    id: "spot-dhaka-1",
    districtId: "dhaka",
    upazilaId: "sadar",
    name: { bn: "লালবাগ কেল্লা", en: "Lalbagh Fort" },
    type: "Historical",
    summary: { bn: "ঢাকার ঐতিহাসিক স্থাপনা।", en: "Historic site in Dhaka." },
    lat: 23.7196,
    lng: 90.3889,
  },
  {
    id: "spot-dhaka-2",
    districtId: "dhaka",
    upazilaId: "sadar",
    name: { bn: "আহসান মঞ্জিল", en: "Ahsan Manzil" },
    type: "Historical",
    summary: { bn: "ঢাকার ঐতিহাসিক জাদুঘর ও প্রাসাদ।", en: "Historic museum and palace." },
    lat: 23.7086,
    lng: 90.4072,
  },
  {
    id: "spot-dhaka-3",
    districtId: "dhaka",
    upazilaId: "sadar",
    name: { bn: "জাতীয় সংসদ ভবন", en: "National Parliament House" },
    type: "Historical",
    summary: { bn: "ঢাকা মহানগরের বিখ্যাত স্থাপত্য নিদর্শন।", en: "Iconic architecture in Dhaka." },
    lat: 23.7629,
    lng: 90.3786,
  },

  // Gazipur
  {
    id: "spot-gazipur-1",
    districtId: "gazipur",
    upazilaId: "sadar",
    name: { bn: "ভাওয়াল জাতীয় উদ্যান", en: "Bhawal National Park" },
    type: "Nature",
    summary: { bn: "প্রাকৃতিক বনাঞ্চল ও বিনোদনের স্থান।", en: "Forest and recreation area." },
    lat: 24.0020,
    lng: 90.4250,
  },

  // Narayanganj
  {
    id: "spot-narayanganj-1",
    districtId: "narayanganj",
    upazilaId: "sadar",
    name: { bn: "সোনারগাঁও", en: "Sonargaon" },
    type: "Historical",
    summary: { bn: "প্রাচীন রাজধানী ও ঐতিহাসিক এলাকা।", en: "Ancient capital and historic area." },
    lat: 23.6516,
    lng: 90.5970,
  },
  {
    id: "spot-narayanganj-2",
    districtId: "narayanganj",
    upazilaId: "sadar",
    name: { bn: "পানাম নগর", en: "Panam City" },
    type: "Historical",
    summary: { bn: "ঐতিহাসিক নগর ও স্থাপনা।", en: "Historic town and structures." },
    lat: 23.6463,
    lng: 90.6135,
  },
  {
    id: "spot-narayanganj-3",
    districtId: "narayanganj",
    upazilaId: "sadar",
    name: { bn: "শীতলক্ষ্যা নদী", en: "Shitalakshya River" },
    type: "Nature",
    summary: { bn: "নারায়ণগঞ্জ মহানগরের পাশের নদী।", en: "River beside Narayanganj." },
    lat: 23.6200,
    lng: 90.5100,
  },

  // Narsingdi
  {
    id: "spot-narsingdi-1",
    districtId: "narsingdi",
    upazilaId: "sadar",
    name: { bn: "মনোহরদী জমিদার বাড়ি", en: "Monohardi Zamindar Bari" },
    type: "Historical",
    summary: { bn: "ঐতিহাসিক জমিদার বাড়ি।", en: "Historic zamindar house." },
    lat: 23.8680,
    lng: 90.7300,
  },

  // Munshiganj
  {
    id: "spot-munshiganj-1",
    districtId: "munshiganj",
    upazilaId: "sadar",
    name: { bn: "ইদ্রাকপুর কেল্লা", en: "Idrakpur Fort" },
    type: "Historical",
    summary: { bn: "ঐতিহাসিক কেল্লা।", en: "Historic fort." },
    lat: 23.5483,
    lng: 90.5300,
  },

  // Manikganj
  {
    id: "spot-manikganj-1",
    districtId: "manikganj",
    upazilaId: "sadar",
    name: { bn: "তেওতা জমিদার বাড়ি", en: "Teota Zamindar Bari" },
    type: "Historical",
    summary: { bn: "ঐতিহাসিক জমিদার বাড়ি।", en: "Historic zamindar house." },
    lat: 23.8600,
    lng: 90.0200,
  },

  // Tangail
  {
    id: "spot-tangail-1",
    districtId: "tangail",
    upazilaId: "sadar",
    name: { bn: "আতিয়া মসজিদ", en: "Atia Mosque" },
    type: "Religious",
    summary: { bn: "ঐতিহাসিক মসজিদ।", en: "Historic mosque." },
    lat: 24.3140,
    lng: 89.9820,
  },

  // Kishoreganj
  {
    id: "spot-kishoreganj-1",
    districtId: "kishoreganj",
    upazilaId: "sadar",
    name: { bn: "ইটনা-মিঠামইন হাওর", en: "Itna–Mithamain Haor" },
    type: "Nature",
    summary: { bn: "হাওরভিত্তিক প্রাকৃতিক এলাকা।", en: "Haor wetland area." },
    lat: 24.4300,
    lng: 91.0600,
  },

  // Faridpur
  {
    id: "spot-faridpur-1",
    districtId: "faridpur",
    upazilaId: "sadar",
    name: { bn: "পদ্মা নদীর চর এলাকা", en: "Padma River Char Area" },
    type: "Nature",
    summary: { bn: "পদ্মা নদীর চরাঞ্চল।", en: "Riverine char area." },
    lat: 23.6050,
    lng: 89.8400,
  },

  // Rajbari
  {
    id: "spot-rajbari-1",
    districtId: "rajbari",
    upazilaId: "sadar",
    name: { bn: "গোয়ালন্দ ঘাট", en: "Goalanda Ghat" },
    type: "Nature",
    summary: { bn: "নদীঘাট ও যাতায়াত কেন্দ্র।", en: "River terminal area." },
    lat: 23.7430,
    lng: 89.6480,
  },

  // Madaripur
  {
    id: "spot-madaripur-1",
    districtId: "madaripur",
    upazilaId: "sadar",
    name: { bn: "শকুনি লেক", en: "Shakuni Lake" },
    type: "Nature",
    summary: { bn: "লেক ও অবসরের স্থান।", en: "Lake and leisure spot." },
    lat: 23.1700,
    lng: 90.2000,
  },

  // Shariatpur
  {
    id: "spot-shariatpur-1",
    districtId: "shariatpur",
    upazilaId: "sadar",
    name: { bn: "পদ্মা নদীর তীর", en: "Padma River Bank" },
    type: "Nature",
    summary: { bn: "পদ্মার তীরবর্তী এলাকা।", en: "Padma river bank area." },
    lat: 23.2300,
    lng: 90.3500,
  },

  // Gopalganj
  {
    id: "spot-gopalganj-1",
    districtId: "gopalganj",
    upazilaId: "sadar",
    name: { bn: "বঙ্গবন্ধু সমাধিসৌধ (টুঙ্গিপাড়া)", en: "Bangabandhu Mausoleum (Tungipara)" },
    type: "Historical",
    summary: { bn: "জাতীয় গুরুত্বপূর্ণ স্মৃতিসৌধ।", en: "National monument." },
    lat: 22.9040,
    lng: 89.9040,
  },

  // Chattogram
  {
    id: "spot-chattogram-1",
    districtId: "chattogram",
    upazilaId: "sadar",
    name: { bn: "পতেঙ্গা সমুদ্র সৈকত", en: "Patenga Sea Beach" },
    type: "Nature",
    summary: { bn: "সমুদ্র সৈকত ও ভ্রমণের স্থান।", en: "Sea beach spot." },
    lat: 22.2470,
    lng: 91.8120,
  },

  // Cox's Bazar
  {
    id: "spot-coxsbazar-1",
    districtId: "coxsbazar",
    upazilaId: "sadar",
    name: { bn: "কক্সবাজার সমুদ্র সৈকত", en: "Cox's Bazar Sea Beach" },
    type: "Nature",
    summary: { bn: "বাংলাদেশের অন্যতম জনপ্রিয় সমুদ্র সৈকত।", en: "One of the most popular sea beaches." },
    lat: 21.4272,
    lng: 92.0058,
  },

  // Bandarban
  {
    id: "spot-bandarban-1",
    districtId: "bandarban",
    upazilaId: "sadar",
    name: { bn: "নীলগিরি", en: "Nilgiri" },
    type: "Adventure",
    summary: { bn: "পাহাড়ি ভিউ পয়েন্ট।", en: "Hill viewpoint." },
    lat: 21.8980,
    lng: 92.3100,
  },
  {
    id: "spot-bandarban-2",
    districtId: "bandarban",
    upazilaId: "sadar",
    name: { bn: "নাফাখুম", en: "Nafakhum" },
    type: "Adventure",
    summary: { bn: "ঝরনা ও প্রকৃতি ভ্রমণ।", en: "Waterfall and nature." },
    lat: 21.7830,
    lng: 92.5700,
  },

  // Rangamati
  {
    id: "spot-rangamati-1",
    districtId: "rangamati",
    upazilaId: "sadar",
    name: { bn: "কাপ্তাই লেক", en: "Kaptai Lake" },
    type: "Nature",
    summary: { bn: "লেকভিত্তিক ভ্রমণের জনপ্রিয় স্থান।", en: "Popular lake travel spot." },
    lat: 22.5000,
    lng: 92.1900,
  },

  // Khagrachhari
  {
    id: "spot-khagrachhari-1",
    districtId: "khagrachhari",
    upazilaId: "sadar",
    name: { bn: "আলুটিলা গুহা", en: "Alutila Cave" },
    type: "Adventure",
    summary: { bn: "গুহা ও পাহাড়ি ভ্রমণ।", en: "Cave and hill trip." },
    lat: 23.1100,
    lng: 91.9900,
  },

  // Cumilla
  {
    id: "spot-cumilla-1",
    districtId: "cumilla",
    upazilaId: "sadar",
    name: { bn: "ময়নামতি", en: "Mainamati" },
    type: "Historical",
    summary: { bn: "বৌদ্ধ ঐতিহ্য ও প্রত্নতাত্ত্বিক স্থান।", en: "Buddhist heritage site." },
    lat: 23.4500,
    lng: 91.1000,
  },

  // Feni
  {
    id: "spot-feni-1",
    districtId: "feni",
    upazilaId: "sadar",
    name: { bn: "মুহুরী প্রজেক্ট", en: "Muhuri Project" },
    type: "Nature",
    summary: { bn: "নদী ও প্রকল্প এলাকা।", en: "River and project area." },
    lat: 23.0200,
    lng: 91.4000,
  },

  // Noakhali
  {
    id: "spot-noakhali-1",
    districtId: "noakhali",
    upazilaId: "sadar",
    name: { bn: "নিঝুম দ্বীপ", en: "Nijhum Dwip" },
    type: "Nature",
    summary: { bn: "দ্বীপ ভ্রমণ ও প্রকৃতি।", en: "Island and nature." },
    lat: 22.0600,
    lng: 91.0200,
  },

  // Laxmipur
  {
    id: "spot-lakshmipur-1",
    districtId: "lakshmipur",
    upazilaId: "sadar",
    name: { bn: "মেঘনা নদীর চর", en: "Meghna River Char" },
    type: "Nature",
    summary: { bn: "মেঘনার চরাঞ্চল।", en: "Meghna river char." },
    lat: 22.9400,
    lng: 90.8300,
  },

  // Chandpur
  {
    id: "spot-chandpur-1",
    districtId: "chandpur",
    upazilaId: "sadar",
    name: { bn: "মেঘনা নদীর মোহনা", en: "Meghna River Estuary" },
    type: "Nature",
    summary: { bn: "নদীর মোহনা এলাকা।", en: "River estuary area." },
    lat: 23.2200,
    lng: 90.6500,
  },

  // Brahmanbaria
  {
    id: "spot-brahmanbaria-1",
    districtId: "brahmanbaria",
    upazilaId: "sadar",
    name: { bn: "তিতাস নদী", en: "Titas River" },
    type: "Nature",
    summary: { bn: "তিতাস নদীর তীরবর্তী এলাকা।", en: "Titas river area." },
    lat: 23.9800,
    lng: 91.1000,
  },

  // Sylhet
  {
    id: "spot-sylhet-1",
    districtId: "sylhet",
    upazilaId: "sadar",
    name: { bn: "জাফলং", en: "Jaflong" },
    type: "Nature",
    summary: { bn: "প্রাকৃতিক সৌন্দর্যের জন্য পরিচিত।", en: "Known for natural beauty." },
    lat: 25.1677,
    lng: 92.0172,
  },

  // Moulvibazar
  {
    id: "spot-moulvibazar-1",
    districtId: "moulvibazar",
    upazilaId: "sadar",
    name: { bn: "লাউয়াছড়া জাতীয় উদ্যান", en: "Lawachara National Park" },
    type: "Nature",
    summary: { bn: "জাতীয় উদ্যান ও বনাঞ্চল।", en: "National park and forest." },
    lat: 24.3300,
    lng: 91.7900,
  },

  // Habiganj
  {
    id: "spot-habiganj-1",
    districtId: "habiganj",
    upazilaId: "sadar",
    name: { bn: "সাতছড়ি জাতীয় উদ্যান", en: "Satchari National Park" },
    type: "Nature",
    summary: { bn: "বনাঞ্চল ও প্রকৃতি ভ্রমণ।", en: "Forest travel spot." },
    lat: 24.2800,
    lng: 91.5100,
  },

  // Sunamganj
  {
    id: "spot-sunamganj-1",
    districtId: "sunamganj",
    upazilaId: "sadar",
    name: { bn: "টাঙ্গুয়ার হাওর", en: "Tanguar Haor" },
    type: "Nature",
    summary: { bn: "হাওরভিত্তিক প্রাকৃতিক এলাকা।", en: "Haor wetland." },
    lat: 25.1200,
    lng: 91.1000,
  },

  // Rajshahi
  {
    id: "spot-rajshahi-1",
    districtId: "rajshahi",
    upazilaId: "sadar",
    name: { bn: "পুঠিয়া রাজবাড়ি", en: "Puthia Rajbari" },
    type: "Historical",
    summary: { bn: "ঐতিহাসিক রাজবাড়ি।", en: "Historic palace." },
    lat: 24.3650,
    lng: 88.8200,
  },

  // Natore
  {
    id: "spot-natore-1",
    districtId: "natore",
    upazilaId: "sadar",
    name: { bn: "নাটোর রাজবাড়ি", en: "Natore Rajbari" },
    type: "Historical",
    summary: { bn: "ঐতিহাসিক রাজবাড়ি।", en: "Historic palace." },
    lat: 24.4200,
    lng: 89.0000,
  },

  // Naogaon
  {
    id: "spot-naogaon-1",
    districtId: "naogaon",
    upazilaId: "sadar",
    name: { bn: "পাহাড়পুর বৌদ্ধ বিহার", en: "Paharpur Buddhist Vihara" },
    type: "Historical",
    summary: { bn: "ইউনেস্কো ঐতিহ্যবাহী প্রত্নস্থল।", en: "UNESCO heritage archaeological site." },
    lat: 25.0317,
    lng: 88.9721,
  },

  // Chapainawabganj (user list had Mahasthangarh; kept as given)
  {
    id: "spot-chapainawabganj-1",
    districtId: "chapainawabganj",
    upazilaId: "sadar",
    name: { bn: "মহাস্থানগড়", en: "Mahasthangarh" },
    type: "Historical",
    summary: { bn: "প্রত্নতাত্ত্বিক ঐতিহ্যবাহী স্থান।", en: "Archaeological heritage site." },
    lat: 24.8515,
    lng: 89.3600,
  },

  // Bogura
  {
    id: "spot-bogura-1",
    districtId: "bogura",
    upazilaId: "sadar",
    name: { bn: "মহাস্থানগড়", en: "Mahasthangarh" },
    type: "Historical",
    summary: { bn: "প্রত্নতাত্ত্বিক ঐতিহ্যবাহী স্থান।", en: "Archaeological heritage site." },
    lat: 24.8515,
    lng: 89.3600,
  },

  // Pabna
  {
    id: "spot-pabna-1",
    districtId: "pabna",
    upazilaId: "sadar",
    name: { bn: "হার্ডিঞ্জ ব্রিজ", en: "Hardinge Bridge" },
    type: "Historical",
    summary: { bn: "ঐতিহাসিক রেল সেতু।", en: "Historic railway bridge." },
    lat: 24.0700,
    lng: 89.0300,
  },

  // Sirajganj
  {
    id: "spot-sirajganj-1",
    districtId: "sirajganj",
    upazilaId: "sadar",
    name: { bn: "যমুনা নদী", en: "Jamuna River" },
    type: "Nature",
    summary: { bn: "যমুনা নদীর তীরবর্তী এলাকা।", en: "Jamuna river area." },
    lat: 24.4500,
    lng: 89.7000,
  },

  // Khulna
  {
    id: "spot-khulna-1",
    districtId: "khulna",
    upazilaId: "sadar",
    name: { bn: "সুন্দরবন", en: "Sundarbans" },
    type: "Nature",
    summary: { bn: "বিশ্বের বৃহত্তম ম্যানগ্রোভ বন।", en: "Largest mangrove forest." },
    lat: 22.3000,
    lng: 89.6000,
  },

  // Bagerhat
  {
    id: "spot-bagerhat-1",
    districtId: "bagerhat",
    upazilaId: "sadar",
    name: { bn: "ষাট গম্বুজ মসজিদ", en: "Sixty Dome Mosque" },
    type: "Religious",
    summary: { bn: "ঐতিহাসিক মসজিদ ও ঐতিহ্য।", en: "Historic mosque." },
    lat: 22.6740,
    lng: 89.7420,
  },

  // Jashore
  {
    id: "spot-jashore-1",
    districtId: "jashore",
    upazilaId: "sadar",
    name: { bn: "মাইকেল মধুসূদন দত্তের বাড়ি", en: "Michael Madhusudan Dutt's House" },
    type: "Historical",
    summary: { bn: "সাহিত্যিকের স্মৃতি জড়িত স্থান।", en: "Writer's memorial place." },
    lat: 23.1200,
    lng: 89.2100,
  },

  // Jhenaidah
  {
    id: "spot-jhenaidah-1",
    districtId: "jhenaidah",
    upazilaId: "sadar",
    name: { bn: "কোটচাঁদপুর গ্রামাঞ্চল", en: "Kotchandpur Countryside" },
    type: "Nature",
    summary: { bn: "গ্রামাঞ্চল ভ্রমণ।", en: "Countryside travel." },
    lat: 23.4100,
    lng: 89.0200,
  },

  // Magura
  {
    id: "spot-magura-1",
    districtId: "magura",
    upazilaId: "sadar",
    name: { bn: "নবগঙ্গা নদী", en: "Nabaganga River" },
    type: "Nature",
    summary: { bn: "নদীর তীরবর্তী এলাকা।", en: "River area." },
    lat: 23.4800,
    lng: 89.4200,
  },

  // Narail
  {
    id: "spot-narail-1",
    districtId: "narail",
    upazilaId: "sadar",
    name: { bn: "চিত্রা নদী", en: "Chitra River" },
    type: "Nature",
    summary: { bn: "নদীর তীরবর্তী এলাকা।", en: "River area." },
    lat: 23.1700,
    lng: 89.5000,
  },

  // Kushtia
  {
    id: "spot-kushtia-1",
    districtId: "kushtia",
    upazilaId: "sadar",
    name: { bn: "রবীন্দ্র কুঠিবাড়ি", en: "Rabindra Kuthibari" },
    type: "Historical",
    summary: { bn: "রবীন্দ্রনাথের স্মৃতিবিজড়িত স্থান।", en: "Rabindranath memorial site." },
    lat: 23.9100,
    lng: 89.1400,
  },

  // Chuadanga
  {
    id: "spot-chuadanga-1",
    districtId: "chuadanga",
    upazilaId: "sadar",
    name: { bn: "দর্শনা সীমান্ত এলাকা", en: "Darshana Border Area" },
    type: "Adventure",
    summary: { bn: "সীমান্ত এলাকা ভ্রমণ।", en: "Border area visit." },
    lat: 23.6500,
    lng: 88.8500,
  },

  // Meherpur
  {
    id: "spot-meherpur-1",
    districtId: "meherpur",
    upazilaId: "sadar",
    name: { bn: "মুজিবনগর স্মৃতিসৌধ", en: "Mujibnagar Memorial" },
    type: "Historical",
    summary: { bn: "ইতিহাসভিত্তিক স্মৃতিসৌধ।", en: "Historic memorial." },
    lat: 23.7600,
    lng: 88.6300,
  },

  // Satkhira
  {
    id: "spot-satkhira-1",
    districtId: "satkhira",
    upazilaId: "sadar",
    name: { bn: "সুন্দরবনের কোলঘেঁষা এলাকা", en: "Sundarbans Adjacent Area" },
    type: "Nature",
    summary: { bn: "সুন্দরবন সংলগ্ন এলাকা।", en: "Area near Sundarbans." },
    lat: 22.4500,
    lng: 89.1000,
  },

  // Barishal
  {
    id: "spot-barishal-1",
    districtId: "barishal",
    upazilaId: "sadar",
    name: { bn: "শাপলা বিল", en: "Shapla Beel" },
    type: "Nature",
    summary: { bn: "শাপলা ও প্রাকৃতিক জলাভূমি।", en: "Water lily wetland." },
    lat: 22.7000,
    lng: 90.3700,
  },

  // Patuakhali
  {
    id: "spot-patuakhali-1",
    districtId: "patuakhali",
    upazilaId: "sadar",
    name: { bn: "কুয়াকাটা সমুদ্র সৈকত", en: "Kuakata Sea Beach" },
    type: "Nature",
    summary: { bn: "সূর্যোদয়-সূর্যাস্তের জন্য বিখ্যাত।", en: "Famous for sunrise and sunset." },
    lat: 21.8160,
    lng: 90.1190,
  },

  // Bhola
  {
    id: "spot-bhola-1",
    districtId: "bhola",
    upazilaId: "sadar",
    name: { bn: "চর কুকরি-মুকরি", en: "Char Kukri-Mukri" },
    type: "Nature",
    summary: { bn: "দ্বীপ ও প্রাকৃতিক এলাকা।", en: "Island nature area." },
    lat: 22.2300,
    lng: 90.7300,
  },

  // Barguna
  {
    id: "spot-barguna-1",
    districtId: "barguna",
    upazilaId: "sadar",
    name: { bn: "সোনাকাটা সমুদ্র সৈকত", en: "Sonakata Sea Beach" },
    type: "Nature",
    summary: { bn: "সমুদ্র সৈকত ভ্রমণ।", en: "Sea beach spot." },
    lat: 21.8300,
    lng: 90.1100,
  },

  // Jhalokathi
  {
    id: "spot-jhalokathi-1",
    districtId: "jhalokathi",
    upazilaId: "sadar",
    name: { bn: "গাবখান সেতু", en: "Gabkhan Bridge" },
    type: "Historical",
    summary: { bn: "সেতু ও নদীঘেঁষা এলাকা।", en: "Bridge and river area." },
    lat: 22.6100,
    lng: 90.2000,
  },

  // Pirojpur
  {
    id: "spot-pirojpur-1",
    districtId: "pirojpur",
    upazilaId: "sadar",
    name: { bn: "বোলেশ্বর নদী", en: "Baleshwar River" },
    type: "Nature",
    summary: { bn: "নদীর তীরবর্তী এলাকা।", en: "River area." },
    lat: 22.5800,
    lng: 89.9800,
  },

  // Rangpur
  {
    id: "spot-rangpur-1",
    districtId: "rangpur",
    upazilaId: "sadar",
    name: { bn: "তাজহাট জমিদার বাড়ি", en: "Tajhat Zamindar Bari" },
    type: "Historical",
    summary: { bn: "ঐতিহাসিক জমিদার বাড়ি।", en: "Historic zamindar house." },
    lat: 25.7400,
    lng: 89.2600,
  },

  // Dinajpur
  {
    id: "spot-dinajpur-1",
    districtId: "dinajpur",
    upazilaId: "sadar",
    name: { bn: "কান্তজিউ মন্দির", en: "Kantaji Temple" },
    type: "Religious",
    summary: { bn: "ঐতিহাসিক টেরাকোটা মন্দির।", en: "Historic terracotta temple." },
    lat: 25.7000,
    lng: 88.6500,
  },

  // Thakurgaon
  {
    id: "spot-thakurgaon-1",
    districtId: "thakurgaon",
    upazilaId: "sadar",
    name: { bn: "হরিপুর রাজবাড়ি", en: "Haripur Rajbari" },
    type: "Historical",
    summary: { bn: "ঐতিহাসিক রাজবাড়ি।", en: "Historic palace." },
    lat: 26.0200,
    lng: 88.4400,
  },

  // Panchagarh
  {
    id: "spot-panchagarh-1",
    districtId: "panchagarh",
    upazilaId: "sadar",
    name: { bn: "বাংলাবান্ধা", en: "Banglabandha" },
    type: "Adventure",
    summary: { bn: "উত্তরের সীমান্ত এলাকা।", en: "Northern border point." },
    lat: 26.5500,
    lng: 88.3600,
  },

  // Nilphamari
  {
    id: "spot-nilphamari-1",
    districtId: "nilphamari",
    upazilaId: "sadar",
    name: { bn: "তিস্তা ব্যারাজ", en: "Teesta Barrage" },
    type: "Nature",
    summary: { bn: "নদী ও ব্যারাজ এলাকা।", en: "River and barrage." },
    lat: 26.1300,
    lng: 88.8700,
  },

  // Lalmonirhat
  {
    id: "spot-lalmonirhat-1",
    districtId: "lalmonirhat",
    upazilaId: "sadar",
    name: { bn: "তিস্তা নদীর চর", en: "Teesta River Char" },
    type: "Nature",
    summary: { bn: "তিস্তার চরাঞ্চল।", en: "Teesta river char." },
    lat: 25.9900,
    lng: 89.4500,
  },

  // Kurigram
  {
    id: "spot-kurigram-1",
    districtId: "kurigram",
    upazilaId: "sadar",
    name: { bn: "ধরলা নদী", en: "Dharla River" },
    type: "Nature",
    summary: { bn: "ধরলা নদীর তীরবর্তী এলাকা।", en: "Dharla river area." },
    lat: 25.8100,
    lng: 89.6500,
  },

  // Mymensingh
  {
    id: "spot-mymensingh-1",
    districtId: "mymensingh",
    upazilaId: "sadar",
    name: { bn: "ব্রহ্মপুত্র নদ", en: "Brahmaputra River" },
    type: "Nature",
    summary: { bn: "ব্রহ্মপুত্র নদীর তীর।", en: "Brahmaputra river bank." },
    lat: 24.7500,
    lng: 90.4000,
  },

  // Jamalpur
  {
    id: "spot-jamalpur-1",
    districtId: "jamalpur",
    upazilaId: "sadar",
    name: { bn: "যমুনা নদীর তীর", en: "Jamuna River Bank" },
    type: "Nature",
    summary: { bn: "নদীর তীরবর্তী এলাকা।", en: "River bank area." },
    lat: 24.9300,
    lng: 89.9000,
  },

  // Sherpur
  {
    id: "spot-sherpur-1",
    districtId: "sherpur",
    upazilaId: "sadar",
    name: { bn: "গারো পাহাড়", en: "Garo Hills" },
    type: "Adventure",
    summary: { bn: "পাহাড়ি এলাকা ভ্রমণ।", en: "Hill region travel." },
    lat: 25.0200,
    lng: 90.0600,
  },

  // Netrokona
  {
    id: "spot-netrokona-1",
    districtId: "netrokona",
    upazilaId: "sadar",
    name: { bn: "হাওর এলাকা", en: "Haor Area" },
    type: "Nature",
    summary: { bn: "হাওরভিত্তিক প্রাকৃতিক এলাকা।", en: "Haor wetland region." },
    lat: 24.8800,
    lng: 90.7200,
  },
];

const MEDICAL_SEED: Array<{
  districtId: string;
  hotline: string;
  entries: Array<{ nameEn: string; nameBn?: string; kind: MedicalService["kind"] }>;
}> = [
  {
    districtId: "dhaka",
    hotline: "999, 16263, 333",
    entries: [
      { nameEn: "Dhaka Medical College Hospital", kind: "Government Hospital" },
      { nameEn: "Popular Diagnostic", kind: "Diagnostic Center" },
      { nameEn: "Ibn Sina Diagnostic", kind: "Diagnostic Center" },
      { nameEn: "NICVD", kind: "Government Hospital" },
      { nameEn: "NITOR", kind: "Government Hospital" },
      { nameEn: "NIMH", kind: "Government Hospital" },
      { nameEn: "BSMMU Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "gazipur",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Shaheed Tajuddin Ahmad Medical College Hospital", kind: "Government Hospital" },
      { nameEn: "Popular Diagnostic Gazipur", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "narayanganj",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Narayanganj 300 Bed General Hospital", kind: "Government Hospital" },
      { nameEn: "Popular Diagnostic Narayanganj", kind: "Diagnostic Center" },
      { nameEn: "Khanpur 300 Bed Hospital", kind: "Government Hospital" },
      { nameEn: "Khanpur Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "narsingdi",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Narsingdi Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Ibn Sina Diagnostic Narsingdi", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "munshiganj",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Munshiganj Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Munshiganj Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "manikganj",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Manikganj Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Manikganj Diagnostic Center", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "tangail",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Tangail Medical College Hospital", kind: "Government Hospital" },
      { nameEn: "Popular Diagnostic Tangail", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "kishoreganj",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Shaheed Syed Nazrul Islam Medical College Hospital", kind: "Government Hospital" },
      { nameEn: "Kishoreganj Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "faridpur",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Faridpur Medical College Hospital", kind: "Government Hospital" },
      { nameEn: "Faridpur Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "rajbari",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Rajbari Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Rajbari Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "madaripur",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Madaripur Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Madaripur Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "shariatpur",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Shariatpur Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Shariatpur Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "gopalganj",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Bangabandhu Sheikh Mujib Medical College Hospital", kind: "Government Hospital" },
      { nameEn: "Gopalganj Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "chattogram",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Chattogram Medical College Hospital", kind: "Government Hospital" },
      { nameEn: "Chevron Diagnostic", kind: "Diagnostic Center" },
      { nameEn: "Epic Health Care", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "coxsbazar",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Cox’s Bazar Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Cox’s Bazar Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "bandarban",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Bandarban Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Bandarban Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "rangamati",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Rangamati General Hospital", kind: "District Hospital" },
      { nameEn: "Rangamati Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "khagrachhari",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Khagrachari Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Khagrachari Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "cumilla",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Cumilla Medical College Hospital", kind: "Government Hospital" },
      { nameEn: "Popular Diagnostic Cumilla", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "feni",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Feni General Hospital", kind: "District Hospital" },
      { nameEn: "Feni Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "noakhali",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Noakhali Medical College Hospital", kind: "Government Hospital" },
      { nameEn: "Noakhali Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "lakshmipur",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Lakshmipur Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Lakshmipur Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "chandpur",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Chandpur Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Chandpur Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "brahmanbaria",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Brahmanbaria Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Brahmanbaria Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "sylhet",
    hotline: "999, 16263",
    entries: [
      { nameEn: "MAG Osmani Medical College Hospital", kind: "Government Hospital" },
      { nameEn: "Ibn Sina Diagnostic Sylhet", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "moulvibazar",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Moulvibazar Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Moulvibazar Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "habiganj",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Habiganj Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Habiganj Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "sunamganj",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Sunamganj Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Sunamganj Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "rajshahi",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Rajshahi Medical College Hospital", kind: "Government Hospital" },
      { nameEn: "Popular Diagnostic Rajshahi", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "natore",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Natore Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Natore Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "naogaon",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Naogaon Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Naogaon Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "chapainawabganj",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Chapainawabganj Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Chapainawabganj Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "bogura",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Shaheed Ziaur Rahman Medical College Hospital", kind: "Government Hospital" },
      { nameEn: "TMSS Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "pabna",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Pabna Medical College Hospital", kind: "Government Hospital" },
      { nameEn: "Pabna Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "sirajganj",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Sirajganj Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Sirajganj Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "khulna",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Khulna Medical College Hospital", kind: "Government Hospital" },
      { nameEn: "Gazi Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "bagerhat",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Bagerhat Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Bagerhat Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "jashore",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Jessore General Hospital", kind: "District Hospital" },
      { nameEn: "Popular Diagnostic Jessore", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "jhenaidah",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Jhenaidah Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Jhenaidah Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "magura",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Magura Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Magura Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "narail",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Narail Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Narail Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "kushtia",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Kushtia Medical College Hospital", kind: "Government Hospital" },
      { nameEn: "Kushtia Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "chuadanga",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Chuadanga Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Chuadanga Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "meherpur",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Meherpur Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Meherpur Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "satkhira",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Satkhira Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Satkhira Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "barishal",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Sher-e-Bangla Medical College Hospital", kind: "Government Hospital" },
      { nameEn: "Popular Diagnostic Barishal", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "patuakhali",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Patuakhali Medical College Hospital", kind: "Government Hospital" },
      { nameEn: "Patuakhali Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "bhola",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Bhola Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Bhola Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "barguna",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Barguna Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Barguna Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "jhalokati",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Jhalokathi Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Jhalokathi Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "pirojpur",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Pirojpur Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Pirojpur Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "rangpur",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Rangpur Medical College Hospital", kind: "Government Hospital" },
      { nameEn: "Popular Diagnostic Rangpur", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "dinajpur",
    hotline: "999, 16263",
    entries: [
      { nameEn: "M Abdur Rahim Medical College Hospital", kind: "Government Hospital" },
      { nameEn: "Dinajpur Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "thakurgaon",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Thakurgaon Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Thakurgaon Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "panchagarh",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Panchagarh Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Panchagarh Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "nilphamari",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Nilphamari Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Nilphamari Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "lalmonirhat",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Lalmonirhat Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Lalmonirhat Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "kurigram",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Kurigram Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Kurigram Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "mymensingh",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Mymensingh Medical College Hospital", kind: "Government Hospital" },
      { nameEn: "Mymensingh Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "jamalpur",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Jamalpur Medical College Hospital", kind: "Government Hospital" },
      { nameEn: "Jamalpur Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "sherpur",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Sherpur Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Sherpur Diagnostic", kind: "Diagnostic Center" },
    ],
  },
  {
    districtId: "netrokona",
    hotline: "999, 16263",
    entries: [
      { nameEn: "Netrokona Sadar Hospital", kind: "District Hospital" },
      { nameEn: "Netrokona Diagnostic", kind: "Diagnostic Center" },
    ],
  },
];

function coordsForDistrict(districtId: string) {
  const spot = TRAVEL_SPOTS.find((x) => x.districtId === districtId);
  return spot ? { lat: spot.lat, lng: spot.lng } : { lat: 23.685, lng: 90.3563 };
}

function spreadCoords(
  base: { lat: number; lng: number },
  idx: number,
  total: number
): { lat: number; lng: number } {
  if (total <= 1) return base;

  const angle = (idx / total) * Math.PI * 2;
  // ~3–6km-ish visual separation depending on latitude; just for map readability.
  const radius = Math.min(0.06, 0.03 + total * 0.002);
  const lat = base.lat + radius * Math.cos(angle);
  const lng = base.lng + radius * Math.sin(angle);
  return { lat, lng };
}

export const MEDICAL_SERVICES: MedicalService[] = MEDICAL_SEED.flatMap((g) => {
  const total = g.entries.length;
  return g.entries.map((e, idx) => {
    const base = coordsForDistrict(g.districtId);
    const c = spreadCoords(base, idx, total);
    return {
      id: `med-${g.districtId}-${idx + 1}`,
      districtId: g.districtId,
      upazilaId: "sadar",
      name: { bn: e.nameBn ?? e.nameEn, en: e.nameEn },
      kind: e.kind,
      emergencyPhone: g.hotline,
      lat: c.lat,
      lng: c.lng,
    };
  });
});

export const BLOOD_BANKS: BloodBankService[] = [];




export function getDistrictName(id: string, lang: "bn" | "en") {
  const d = DISTRICTS.find((x) => x.id === id);
  return d ? d.name[lang] : "";
}

export function getUpazilaName(districtId: string, upazilaId: string, lang: "bn" | "en") {
  const d = DISTRICTS.find((x) => x.id === districtId);
  const u = d?.upazilas.find((x) => x.id === upazilaId);
  return u ? u.name[lang] : "";
}
