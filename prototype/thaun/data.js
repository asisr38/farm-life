/* Thaun prototype: sample data.
   Everything here is illustrative. Listings, people and government valuations are invented for the prototype.
   Market bands per aana come from the May 2026 Merokalam guide cited in PORTAL_MARKET_RESEARCH.md.
   Farm figures and the two farmland plots come from the farm-life mock (mock/index.html). */
window.TH = window.TH || {};

TH.AREAS = [
  { id: 'budhanilkantha', name: 'Budhanilkantha', ne: 'बुढानीलकण्ठ', district: 'Kathmandu', center: [85.362, 27.772], band: [18, 30], gov: 9.5 },
  { id: 'baluwatar', name: 'Baluwatar', ne: 'बालुवाटार', district: 'Kathmandu', center: [85.330, 27.729], band: [40, 75], gov: 21 },
  { id: 'koteshwor', name: 'Koteshwor', ne: 'कोटेश्वर', district: 'Kathmandu', center: [85.348, 27.678], band: [25, 45], gov: 13 },
  { id: 'kirtipur', name: 'Kirtipur', ne: 'कीर्तिपुर', district: 'Kathmandu', center: [85.278, 27.673], band: [12, 22], gov: 6.5 },
  { id: 'chandragiri', name: 'Chandragiri', ne: 'चन्द्रागिरि', district: 'Kathmandu', center: [85.239, 27.690], band: [8, 15], gov: 4.2 },
  { id: 'sundarijal', name: 'Sundarijal', ne: 'सुन्दरीजल', district: 'Kathmandu', center: [85.427, 27.762], band: [6, 12], gov: 3.1 },
  { id: 'jhamsikhel', name: 'Jhamsikhel', ne: 'झम्सिखेल', district: 'Lalitpur', center: [85.306, 27.679], band: [35, 55], gov: 18 },
  { id: 'bhaisepati', name: 'Bhaisepati', ne: 'भैंसेपाटी', district: 'Lalitpur', center: [85.301, 27.652], band: [20, 35], gov: 10 },
  { id: 'imadol', name: 'Imadol', ne: 'इमाडोल', district: 'Lalitpur', center: [85.342, 27.662], band: [20, 35], gov: 21.78 },
  { id: 'godawari', name: 'Godawari', ne: 'गोदावरी', district: 'Lalitpur', center: [85.378, 27.598], band: [10, 18], gov: 5 },
  { id: 'khokana', name: 'Khokana', ne: 'खोकना', district: 'Lalitpur', center: [85.295, 27.637], band: [9, 16], gov: 4.5 },
  { id: 'lubhu', name: 'Lubhu', ne: 'लुभु', district: 'Lalitpur', center: [85.387, 27.644], band: [10, 18], gov: 5 },
  { id: 'nagarkot', name: 'Nagarkot', ne: 'नगरकोट', district: 'Bhaktapur', center: [85.521, 27.715], band: [5, 10], gov: 2.4 },
  { id: 'dhulikhel', name: 'Dhulikhel', ne: 'धुलिखेल', district: 'Kavrepalanchok', center: [85.556, 27.618], band: [6, 12], gov: 3 },
];

/* Place index for the seller's "where is your land" search: palika, ward, tole, landmark. */
TH.PLACES = [
  ...TH.AREAS.map(a => ({ label: a.name, ne: a.ne, sub: a.district, center: a.center, zoom: 15.5 })),
  { label: 'Gokarneshwar-9', ne: 'गोकर्णेश्वर-९', sub: 'Ward · Kathmandu', center: [85.425, 27.758], zoom: 16 },
  { label: 'Karyabinayak-3', ne: 'कार्यविनायक-३', sub: 'Ward · Lalitpur', center: [85.296, 27.636], zoom: 16 },
  { label: 'Bhatbhateni, Maharajgunj', ne: 'भाटभटेनी, महाराजगञ्ज', sub: 'Landmark · Kathmandu', center: [85.333, 27.737], zoom: 17 },
  { label: 'Patan Durbar Square', ne: 'पाटन दरबार क्षेत्र', sub: 'Landmark · Lalitpur', center: [85.325, 27.673], zoom: 17 },
  { label: 'Chobhar', ne: 'चोभार', sub: 'Tole · Kirtipur', center: [85.290, 27.660], zoom: 16 },
  { label: 'Thankot', ne: 'थानकोट', sub: 'Tole · Chandragiri', center: [85.205, 27.689], zoom: 16 },
  { label: 'Changunarayan', ne: 'चाँगुनारायण', sub: 'Municipality · Bhaktapur', center: [85.427, 27.716], zoom: 15 },
  { label: 'Pokhara Lakeside', ne: 'पोखरा लेकसाइड', sub: 'Tole · Kaski', center: [83.958, 28.208], zoom: 15 },
  { label: 'Bharatpur', ne: 'भरतपुर', sub: 'Metropolitan · Chitwan (Terai)', center: [84.435, 27.680], zoom: 14, terai: true },
];

/* Named peaks for the "what you'll see" calculation. Coordinates are approximate summits. */
TH.PEAKS = [
  { name: 'Manaslu', ne: 'मनास्लु', lng: 84.5597, lat: 28.5497, elev: 8163 },
  { name: 'Ganesh Himal', ne: 'गणेश हिमाल', lng: 85.1272, lat: 28.3917, elev: 7422 },
  { name: 'Langtang Lirung', ne: 'लाङटाङ लिरुङ', lng: 85.5188, lat: 28.2558, elev: 7227 },
  { name: 'Shishapangma', ne: 'शिशापाङ्मा', lng: 85.7797, lat: 28.3525, elev: 8027 },
  { name: 'Dorje Lakpa', ne: 'दोर्जे लाक्पा', lng: 85.7608, lat: 28.1731, elev: 6966 },
  { name: 'Gauri Shankar', ne: 'गौरीशंकर', lng: 86.3361, lat: 27.9533, elev: 7134 },
  { name: 'Everest', ne: 'सगरमाथा', lng: 86.9250, lat: 27.9881, elev: 8849 },
];

/* Indicative exchange rates, NPR per unit. Prototype only. */
TH.FX = {
  NPR: { rate: 1, symbol: 'रु', label: 'NPR' },
  USD: { rate: 141, symbol: '$', label: 'USD' },
  GBP: { rate: 188, symbol: '£', label: 'GBP' },
  EUR: { rate: 163, symbol: '€', label: 'EUR' },
  AUD: { rate: 92, symbol: 'A$', label: 'AUD' },
  AED: { rate: 38.4, symbol: 'AED ', label: 'AED' },
  QAR: { rate: 38.7, symbol: 'QAR ', label: 'QAR' },
  JPY: { rate: 0.93, symbol: '¥', label: 'JPY' },
};

const daysAgo = n => new Date(Date.now() - n * 864e5).toISOString();

/* area: hills units as [ropani, aana, paisa, daam]. price is NPR.
   basis: total | month | ropaniYear. verification kinds: owner, certificate, site, road, water, reconfirmed. */
TH.LISTINGS = [
  {
    id: 'nagarkot-ridge', intent: 'sale', type: 'land', areaId: 'nagarkot', center: [85.5235, 27.7128], rapd: [1, 4, 0, 0], seed: 3, rot: 18,
    title: 'Ridge plot facing the Himalaya', ne: 'हिमाल हेर्ने डाँडाको जग्गा', price: 14000000, basis: 'total',
    source: 'owner', owner: 'Sabita Shrestha', road: { type: 'motorable', widthFt: 13, toBlacktopM: 140 }, water: 'seasonal',
    verified: [['owner', 6], ['certificate', 6], ['site', 4], ['reconfirmed', 2]], posted: 9, remote: true,
    blurb: 'East-facing ridge plot above Nagarkot bazaar. Gentle terraces, clear morning sun, and a long view of the northern range on winter mornings. The motorable track is gravelled to the gate.',
  },
  {
    id: 'budhanilkantha-8aana', intent: 'sale', type: 'land', areaId: 'budhanilkantha', center: [85.3655, 27.7738], rapd: [0, 8, 0, 0], seed: 7, rot: -12,
    title: '8 aana residential plot near Narayanthan', ne: 'नारायणथान नजिक ८ आना घडेरी', price: 19600000, basis: 'total',
    source: 'agent', agent: 'Shivapuri Properties (sample)', road: { type: 'blacktop', widthFt: 20, toBlacktopM: 0 }, water: 'year-round',
    verified: [['owner', 12], ['certificate', 12], ['reconfirmed', 5]], posted: 15, remote: true,
    blurb: 'Square residential plot on a 20 ft blacktop road, five minutes from the Budhanilkantha temple. Quiet lane, municipal water line, electricity at the boundary.',
  },
  {
    id: 'godawari-12aana', intent: 'sale', type: 'land', areaId: 'godawari', center: [85.3762, 27.6003], rapd: [0, 12, 0, 0], seed: 11, rot: 34,
    title: 'Garden plot under Phulchowki', ne: 'फुलचोकी मुनिको बगैंचा जग्गा', price: 16800000, basis: 'total',
    source: 'owner', owner: 'Ramesh Lama', road: { type: 'motorable', widthFt: 13, toBlacktopM: 320 }, water: 'year-round',
    verified: [['owner', 20], ['certificate', 20], ['site', 18], ['road', 18], ['water', 18], ['reconfirmed', 3]], posted: 22, remote: true,
    blurb: 'Level plot with mature walnut and persimmon trees, a spring-fed tap and views up to the Phulchowki forest. A good fit for a family home or a small orchard.',
  },
  {
    id: 'bhaisepati-5aana', intent: 'sale', type: 'land', areaId: 'bhaisepati', center: [85.2988, 27.6537], rapd: [0, 5, 2, 0], seed: 5, rot: 4,
    title: 'Corner plot in a planned Bhaisepati lane', ne: 'भैंसेपाटीको कुनाको घडेरी', price: 15400000, basis: 'total',
    source: 'owner', owner: 'Anita Maharjan', road: { type: 'blacktop', widthFt: 20, toBlacktopM: 0 }, water: 'year-round',
    verified: [['owner', 3], ['certificate', 3]], posted: 4,
    blurb: 'Corner plot with two road frontages in an established housing area. Sewer, electricity and water lines in place.',
  },
  {
    id: 'chandragiri-2ropani', intent: 'sale', type: 'land', areaId: 'chandragiri', center: [85.2385, 27.6912], rapd: [2, 0, 0, 0], seed: 13, rot: -28,
    title: '2 ropani hillside land near Matatirtha', ne: 'मातातीर्थ नजिक २ रोपनी जग्गा', price: 32000000, basis: 'total',
    source: 'licensed', agent: 'Valley Licensed Realty (sample)', licence: 'DoLMA-2082-0047 (sample)', road: { type: 'motorable', widthFt: 16, toBlacktopM: 600 }, water: 'seasonal',
    verified: [['owner', 30], ['certificate', 30], ['site', 26], ['reconfirmed', 41]], posted: 44,
    blurb: 'Terraced hillside with views across the valley floor towards the Swayambhu ridge. Suits a retreat or a small housing project, subject to plotting permits.',
  },
  {
    id: 'dhulikhel-1ropani', intent: 'sale', type: 'land', areaId: 'dhulikhel', center: [85.5612, 27.6158], rapd: [1, 0, 0, 0], seed: 17, rot: 52,
    title: 'Dhulikhel plot with a mountain horizon', ne: 'धुलिखेलको हिमाल देखिने जग्गा', price: 8800000, basis: 'total',
    source: 'owner', owner: 'Bikash Thapa', road: { type: 'motorable', widthFt: 13, toBlacktopM: 210 }, water: 'seasonal',
    verified: [['owner', 10]], posted: 11, remote: true,
    blurb: 'North-facing plot on the old Dhulikhel road, 45 minutes from Kathmandu by the Araniko Highway.',
  },
  {
    id: 'kirtipur-6aana', intent: 'sale', type: 'land', areaId: 'kirtipur', center: [85.2755, 27.6742], rapd: [0, 6, 0, 0], seed: 19, rot: -6,
    title: '6 aana plot near Tribhuvan University', ne: 'त्रिभुवन विश्वविद्यालय नजिक ६ आना', price: 10200000, basis: 'total',
    source: 'owner', owner: 'Prakash Dangol', road: { type: 'blacktop', widthFt: 13, toBlacktopM: 0 }, water: 'year-round',
    verified: [], posted: 2,
    blurb: 'Newly listed. Not yet verified by Thaun.',
  },
  /* Farm roots: these two plots carry over from the farm-life concierge mock. */
  {
    id: 'sundarijal-rim', intent: 'lease', type: 'farmland', areaId: 'sundarijal', center: [85.4262, 27.7594], rapd: [6, 0, 0, 0], seed: 23, rot: 12,
    title: 'Sundarijal Rim: spring-fed farmland', ne: 'सुन्दरीजल रिम: मूलको पानी भएको खेत', price: 17400, basis: 'ropaniYear',
    source: 'owner', owner: 'Hari Bahadur Tamang', road: { type: 'motorable', widthFt: 10, toBlacktopM: 450 }, water: 'year-round',
    waterSource: 'Spring-fed channel plus a lined rain-harvest pond', marketKm: 14, leaseModels: ['fixed', 'bataiya'], ward: 'Gokarneshwar-9',
    verified: [['owner', 40], ['certificate', 40], ['site', 35], ['water', 35], ['reconfirmed', 6]], posted: 52, remote: true,
    blurb: 'Six ropani of terraced farmland on the Sundarijal rim. Water was checked on site in the dry season. Fourteen kilometres to the Kalimati and Balkhu markets.',
  },
  {
    id: 'khokana-field', intent: 'lease', type: 'farmland', areaId: 'khokana', center: [85.2962, 27.6352], rapd: [8, 0, 0, 0], seed: 29, rot: -20,
    title: 'Khokana Field: flat farmland, lease-to-own', ne: 'खोकना खेत: समथर खेत, लिज-टु-ओन', price: 21800, basis: 'ropaniYear',
    source: 'owner', owner: 'Sita Maharjan', road: { type: 'motorable', widthFt: 13, toBlacktopM: 200 }, water: 'unverified',
    waterSource: 'Deep tubewell claimed by owner, not yet verified on site', marketKm: 9, leaseModels: ['fixed', 'leaseToOwn'], ward: 'Karyabinayak-3',
    verified: [['owner', 14], ['certificate', 14]], posted: 14,
    blurb: 'Eight ropani of flat Bagmati-terrace farmland near the Newar village of Khokana. Water is the open question: the owner reports a deep tubewell, and Thaun has not yet visited in the dry season.',
  },
  {
    id: 'lubhu-orchard', intent: 'lease', type: 'farmland', areaId: 'lubhu', center: [85.3893, 27.6418], rapd: [4, 8, 0, 0], seed: 31, rot: 40,
    title: 'Lubhu orchard terraces', ne: 'लुभुको फलफूल बगैंचा', price: 16000, basis: 'ropaniYear',
    source: 'owner', owner: 'Gita Shrestha', road: { type: 'motorable', widthFt: 10, toBlacktopM: 380 }, water: 'seasonal',
    waterSource: 'Monsoon-fed canal; dry-season gap', marketKm: 11, leaseModels: ['fixed', 'bataiya', 'leaseToOwn'], ward: 'Mahalaxmi-8',
    verified: [['owner', 9], ['certificate', 9], ['site', 7]], posted: 9,
    blurb: 'Four and a half ropani of citrus and vegetable terraces. Suits a grower with a drip system and a dry-season plan.',
  },
  {
    id: 'baluwatar-house', intent: 'sale', type: 'house', areaId: 'baluwatar', center: [85.3302, 27.7296], rapd: [0, 6, 0, 0], seed: 37, rot: 8,
    title: '2½-storey house on 6 aana in Baluwatar', ne: 'बालुवाटारमा ६ आनामा अढाई तले घर', price: 52000000, basis: 'total',
    source: 'licensed', agent: 'Valley Licensed Realty (sample)', licence: 'DoLMA-2082-0047 (sample)', road: { type: 'blacktop', widthFt: 16, toBlacktopM: 0 }, water: 'year-round',
    beds: 5, baths: 4, floors: 2.5, built: 2072, verified: [['owner', 18], ['certificate', 18], ['site', 15], ['reconfirmed', 4]], posted: 18, remote: true,
    blurb: 'Earthquake-resistant RCC house with a garden, two kitchens and a rooftop terrace. Built 2072 BS with an approved building permit.',
  },
  {
    id: 'imadol-house', intent: 'sale', type: 'house', areaId: 'imadol', center: [85.3436, 27.6633], rapd: [0, 4, 0, 0], seed: 41, rot: -15,
    title: 'Modern family home in Imadol', ne: 'इमाडोलमा आधुनिक पारिवारिक घर', price: 27500000, basis: 'total',
    source: 'owner', owner: 'Deepak KC', road: { type: 'blacktop', widthFt: 13, toBlacktopM: 0 }, water: 'year-round',
    beds: 4, baths: 3, floors: 2.5, built: 2079, verified: [['owner', 7], ['certificate', 7], ['reconfirmed', 1]], posted: 7,
    blurb: 'Bright 4-bedroom home with solar hot water and a two-car parking area.',
  },
  {
    id: 'budhanilkantha-villa', intent: 'rent', type: 'house', areaId: 'budhanilkantha', center: [85.3584, 27.7676], rapd: [0, 10, 0, 0], seed: 43, rot: 22,
    title: 'Furnished bungalow with a garden', ne: 'बगैंचासहितको फर्निस्ड बंगला', price: 120000, basis: 'month',
    source: 'agent', agent: 'Shivapuri Properties (sample)', road: { type: 'blacktop', widthFt: 16, toBlacktopM: 0 }, water: 'year-round',
    beds: 4, baths: 4, floors: 2, furnished: true, verified: [['owner', 5], ['site', 5], ['reconfirmed', 1]], posted: 5, remote: true,
    blurb: 'Quiet bungalow with a lawn, backup power and a deep-bore water supply. Diplomatic and NGO tenants welcome.',
  },
  {
    id: 'jhamsikhel-2bhk', intent: 'rent', type: 'flat', areaId: 'jhamsikhel', center: [85.3071, 27.6788],
    title: 'Sunny 2BHK flat in Jhamsikhel', ne: 'झम्सिखेलमा उज्यालो २BHK फ्ल्याट', price: 55000, basis: 'month',
    source: 'owner', owner: 'Mira Joshi', beds: 2, baths: 2, floorNo: 3, furnished: true, brokerFee: 0, deposit: 2,
    verified: [['owner', 3], ['site', 2], ['reconfirmed', 0]], posted: 3, remote: true,
    blurb: 'Third-floor flat with a balcony, close to cafes on Jhamsikhel road. Water and internet included. No broker fee.',
  },
  {
    id: 'koteshwor-room', intent: 'rent', type: 'room', areaId: 'koteshwor', center: [85.3494, 27.6786],
    title: 'Two rooms + kitchen near Koteshwor chowk', ne: 'कोटेश्वर चोक नजिक दुई कोठा र भान्सा', price: 14000, basis: 'month',
    source: 'owner', owner: 'Laxmi Basnet', beds: 2, baths: 1, floorNo: 2, furnished: false, brokerFee: 0, deposit: 1,
    verified: [['owner', 2], ['site', 1]], posted: 1,
    blurb: 'Second-floor rooms with a shared bathroom, a five-minute walk to the Koteshwor bus stops. The owner lives downstairs. No form fees, no broker.',
  },
  {
    id: 'kupondole-3bhk', intent: 'sale', type: 'flat', areaId: 'jhamsikhel', center: [85.3158, 27.6866],
    title: '3BHK apartment with a valley view', ne: 'उपत्यका देखिने ३BHK अपार्टमेन्ट', price: 24000000, basis: 'total',
    source: 'developer', agent: 'Bagmati Residences (sample)', beds: 3, baths: 2, floorNo: 9, furnished: false,
    verified: [['owner', 25], ['certificate', 25], ['reconfirmed', 9]], posted: 25, remote: true,
    blurb: 'Ninth-floor apartment with a northern view across the Bagmati. Lift, backup power, underground parking.',
  },
];

TH.FARM = {
  scenarios: {
    base: { per: 100000, label: 'Base', note: 'Documented organic average for the Kathmandu Valley. Realistic for a careful first-timer.' },
    expected: { per: 140000, label: 'Expected', note: 'Skilled intensive cropping with tunnels and steady market access.' },
    stretch: { per: 280000, label: 'Stretch', note: 'Top decile: polytunnels, multi-cropping and a secured premium buyer. Not a base case.' },
  },
  opexPerRopani: 55000,
  setupPerRopani: 40000,
  leaseModels: {
    fixed: { name: 'Fixed lease', ne: 'निश्चित भाडा', text: 'A set rent per ropani each year. The farmer keeps the whole harvest.' },
    bataiya: { name: 'Bataiya (harvest share)', ne: 'बटैया', text: 'The traditional 50:50 harvest split. Lower cash up front, shared risk.' },
    leaseToOwn: { name: 'Lease-to-own', ne: 'लिज-टु-ओन', text: 'Part of each payment goes towards buying the land later.' },
  },
};

TH.VERIFY = {
  owner: { label: 'Owner identity checked', icon: 'user-check' },
  certificate: { label: 'Lalpurja seen and matched to the plot number', icon: 'file-check' },
  site: { label: 'Site visited, boundary walked with GPS', icon: 'footprints' },
  road: { label: 'Road access and width measured', icon: 'route' },
  water: { label: 'Water checked in the dry season', icon: 'droplets' },
  reconfirmed: { label: 'Re-confirmed still available', icon: 'refresh-cw' },
};

TH.daysAgo = daysAgo;
