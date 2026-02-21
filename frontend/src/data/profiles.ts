export const EPC_COLORS: Record<string, string> = {
  A: "#00a550",
  B: "#50b747",
  C: "#b2d234",
  D: "#fff200",
  E: "#f7941d",
  F: "#f15a29",
};

export interface Profile {
  id: number;
  name: string;
  age: number;
  course: string;
  year: string;
  uni: string;
  budget: string;
  moveIn: string;
  bio: string;
  compatibility: number;
  lifestyleMatch: number;
  propertyMatch: number;
  tags: string[];
  epcGrade: string;
  floodRisk: string;
  hmoStatus: string;
  rentFairness: string;
  commuteMin: number;
  avatar: string;
  color: string;
  societies: string[];
  cleanliness: number;
  guests: string;
  lat: number;
  lng: number;
}

const UK_LOCATIONS: { lat: number; lng: number; city: string }[] = [
  { lat: 53.4808, lng: -2.2426, city: "Manchester" },
  { lat: 51.5074, lng: -0.1278, city: "London" },
  { lat: 52.4862, lng: -1.8904, city: "Birmingham" },
  { lat: 53.8008, lng: -1.5491, city: "Leeds" },
  { lat: 51.4545, lng: -2.5879, city: "Bristol" },
  { lat: 54.9783, lng: -1.6178, city: "Newcastle" },
  { lat: 53.4084, lng: -2.9916, city: "Liverpool" },
  { lat: 52.2053, lng: 0.1218, city: "Cambridge" },
  { lat: 51.7520, lng: -1.2577, city: "Oxford" },
  { lat: 55.9533, lng: -3.1883, city: "Edinburgh" },
  { lat: 51.4543, lng: -0.9781, city: "Reading" },
  { lat: 50.8225, lng: -0.1372, city: "Brighton" },
  { lat: 52.9548, lng: -1.1581, city: "Nottingham" },
  { lat: 53.3811, lng: -1.4701, city: "Sheffield" },
  { lat: 52.6309, lng: 1.2974, city: "Norwich" },
  { lat: 53.3498, lng: -6.2603, city: "Dublin" },
  { lat: 51.8985, lng: -8.4756, city: "Cork" },
  { lat: 53.2707, lng: -9.0498, city: "Galway" },
  { lat: 51.7500, lng: -1.2500, city: "Oxford" },
  { lat: 52.4064, lng: -1.5122, city: "Coventry" },
];

const FIRST_NAMES = ["Jasmine", "Marcus", "Priya", "Omar", "Emma", "Liam", "Zara", "Noah", "Ava", "Ethan", "Maya", "James", "Sofia", "Oliver", "Isla", "Leo", "Freya", "Arlo", "Ivy", "Hugo"];
const INITIALS = ["K.", "T.", "S.", "H.", "W.", "B.", "M.", "C.", "L.", "R.", "P.", "D.", "F.", "N.", "G.", "V.", "J.", "Y.", "A.", "E."];
const COURSES = ["Computer Science", "Architecture", "Medicine", "Law", "Economics", "Engineering", "Psychology", "English", "Biology", "History", "Business", "Physics", "Art", "Chemistry", "Politics", "Geography", "Maths", "Music", "Philosophy", "Sociology"];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgrad"];
const UNIS = ["University of Manchester", "UCL", "Imperial", "King's College London", "University of Edinburgh", "University of Bristol", "University of Leeds", "University of Birmingham", "University of Nottingham", "University of Sheffield", "Queen Mary London", "LSE", "University of Cambridge", "University of Oxford", "Newcastle University", "University of Liverpool", "University of Glasgow", "University of Southampton", "University of Exeter", "University of Bath"];
const BUDGETS = ["£450–£600/mo", "£500–£650/mo", "£550–£700/mo", "£600–£750/mo", "£480–£620/mo", "£520–£680/mo"];
const BIOS = [
  "Night owl coder, clean kitchen obsessive, love hosting film nights.",
  "Library warrior by day, amateur chef by night. Need quiet study space.",
  "Med student with erratic schedules. Respectful of sleep and space.",
  "Gym in the morning, books at night. Looking for chill housemates.",
  "Love cooking and board games. Prefer a tidy shared space.",
  "Quiet final year. Need a desk and good WiFi.",
  "Sociable but respect boundaries. Big on recycling.",
  "Early bird. Coffee is sacred. Happy to share tips.",
  "Into sustainability and cycling. Minimal noise after 10pm.",
  "Film and music nerd. Always up for a takeaway night.",
  "Sporty and outgoing. Clean bathroom is non-negotiable.",
  "Bookworm with a plant addiction. Pet-friendly preferred.",
  "Work from home sometimes. Need a quiet corner.",
  "Love hosting dinners. Kitchen must stay clean.",
  "Chill vibes only. No drama, just good company.",
  "Study group enthusiast. Need a calm environment.",
  "Outdoor person. Rarely in, but tidy when I am.",
  "Gaming and coding. Flexible on noise if you are too.",
  "Organised and friendly. Looking for similar energy.",
  "New to the city. Excited to meet housemates.",
];
const TAG_SETS = [
  ["Night Owl", "Clean Freak", "Social", "Cyclist"],
  ["Early Bird", "Chef", "Quiet", "Gym Goer"],
  ["Eco-Conscious", "Plant Mum", "Clean", "Introvert"],
  ["Social", "Gamer", "Flexible", "Cook"],
  ["Quiet", "Studious", "Tidy", "Runner"],
  ["Outgoing", "Music Lover", "Respectful", "Driver"],
  ["Work From Home", "Organised", "Friendly", "Reader"],
  ["Sporty", "Early Riser", "Minimal", "Cyclist"],
  ["Film Buff", "Night Owl", "Chill", "Foodie"],
  ["Bookworm", "Pet Lover", "Calm", "Gardener"],
  ["Gym Goer", "Chef", "Social", "Clean"],
  ["Introvert", "Gamer", "Quiet", "Tech"],
  ["Sustainable", "Cyclist", "Tidy", "Outdoor"],
  ["Host", "Cook", "Social", "Organised"],
  ["Chill", "Flexible", "Friendly", "Minimal"],
  ["Studious", "Quiet", "Respectful", "Reader"],
  ["Outdoor", "Sporty", "Tidy", "Early Bird"],
  ["Gaming", "Coding", "Flexible", "Night Owl"],
  ["Organised", "Friendly", "Clean", "Social"],
  ["New", "Curious", "Chill", "Friendly"],
];
const SOCIETY_SETS = [
  ["Hackathon Society", "Film Club"],
  ["Architecture Society", "Food Society"],
  ["MedSoc", "Environmental Society"],
  ["Tech Society", "Running Club"],
  ["Debate", "Chess Club"],
  ["Music Society", "Drama"],
  ["Investment Society", "Networking"],
  ["Sports", "Volunteering"],
  ["Film Society", "Book Club"],
  ["Wildlife", "Photography"],
  ["Football", "Cooking Club"],
  ["Gaming", "Code Club"],
  ["Cycling", "Green Society"],
  ["Wine Tasting", "Cultural"],
  ["Yoga", "Mindfulness"],
  ["Law Society", "Mooting"],
  ["Hiking", "Outdoor Club"],
  ["AI Society", "Robotics"],
  ["Careers", "Alumni Network"],
  ["International", "Language Exchange"],
];
const COLORS = ["#FF6B6B", "#4ECDC4", "#A29BFE", "#74b9ff", "#ffeaa7", "#fd79a8", "#00b894", "#e17055", "#0984e3", "#6c5ce7", "#00cec9", "#fdcb6e", "#e84393", "#2d3436", "#636e72", "#b2bec3", "#55efc4", "#81ecec", "#fab1a0", "#a29bfe"];

function buildProfiles(): Profile[] {
  return Array.from({ length: 20 }, (_, i) => {
    const loc = UK_LOCATIONS[i % UK_LOCATIONS.length];
    return {
      id: i + 1,
      name: `${FIRST_NAMES[i]} ${INITIALS[i]}`,
      age: 18 + (i % 5),
      course: COURSES[i],
      year: YEARS[i % YEARS.length],
      uni: UNIS[i],
      budget: BUDGETS[i % BUDGETS.length],
      moveIn: i % 2 === 0 ? "Sept 2025" : "Aug 2025",
      bio: BIOS[i],
      compatibility: 70 + (i % 26),
      lifestyleMatch: 72 + (i % 25),
      propertyMatch: 75 + (i % 22),
      tags: TAG_SETS[i],
      epcGrade: ["A", "B", "C", "B", "A", "C", "B", "B", "A", "C"][i % 10],
      floodRisk: "Low",
      hmoStatus: i % 5 === 0 ? "Restricted Zone" : "Approved Zone",
      rentFairness: ["+2% avg", "-4% avg", "+6% avg", "+1% avg", "-2% avg"][i % 5],
      commuteMin: 5 + (i % 12),
      avatar: FIRST_NAMES[i].slice(0, 1) + INITIALS[i].slice(0, 1),
      color: COLORS[i],
      societies: SOCIETY_SETS[i],
      cleanliness: (i % 5) + 1,
      guests: i % 3 === 0 ? "Rarely" : i % 3 === 1 ? "Occasionally" : "Often",
      lat: loc.lat + (i * 0.002 - 0.01),
      lng: loc.lng + (i * 0.002 - 0.01),
    };
  });
}

export const PROFILES: Profile[] = buildProfiles();
