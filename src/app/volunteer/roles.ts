export interface CustomQuestion {
  id: string;
  type: "text" | "select" | "radio" | "textarea";
  label: string;
  placeholder?: string;
  options?: string[];
  required: boolean;
}

export interface VolunteerRole {
  id: string;
  title: string;
  about: string;
  responsibilities: string[];
  requirements: string[];
  commitment: string[];
  gains: string[];
  customQuestions: CustomQuestion[];
}

export const volunteerRoles: VolunteerRole[] = [
  {
    id: "medical-unit",
    title: "Medical Unit",
    about: "We welcome qualified healthcare professionals and students to join our medical outreaches. You will provide direct patient care, health education, and support to underserved communities.",
    responsibilities: [
      "Conduct basic health assessments and triage patients",
      "Administer treatments under proper supervision",
      "Provide health education on hygiene and disease prevention",
      "Maintain accurate patient records during outreaches"
    ],
    requirements: [
      "Medical/Nursing license or currently enrolled in a healthcare program",
      "Basic clinical knowledge and patient care skills",
      "Ability to work in challenging, low-resource environments",
      "Strong interpersonal skills and empathy"
    ],
    commitment: ["On-site (Outreach locations)", "1-3 days per month during outreach weekends", "Duration: Flexible, ongoing"],
    gains: [
      "Direct impact on vulnerable populations' health",
      "Clinical experience in global health settings",
      "Mentorship from experienced healthcare professionals",
      "Certificate of service and recommendation"
    ],
    customQuestions: [
      { id: "medicalStatus", type: "select", label: "What is your current professional status? *", options: ["Licensed Physician", "Licensed / Registered Nurse", "Medical/Nursing Student", "Recently Graduated", "Other Healthcare Professional"], required: true },
      { id: "licenseNumber", type: "text", label: "License / Registration Number (if applicable)", placeholder: "Leave blank if still a student", required: false },
      { id: "clinicalExperience", type: "select", label: "Years of clinical experience *", options: ["No clinical experience yet", "Less than 1 year", "1–3 years", "3–5 years", "5+ years"], required: true },
      { id: "hasRuralExperience", type: "radio", label: "Have you worked in a rural or low-resource setting before? *", options: ["Yes", "No"], required: true }
    ]
  },
  {
    id: "relief-and-welfare",
    title: "Relief and welfare unit",
    about: "The Relief and Welfare unit coordinates the sourcing, storage, and distribution of vital relief materials. We ensure that fortified food, clothing, and everyday essentials reach those who need them most.",
    responsibilities: [
      "Coordinate sourcing and storage of relief materials",
      "Organize the distribution of food, grains, and clothing",
      "Assess household and individual welfare needs on-ground",
      "Maintain inventory records and distribution logs"
    ],
    requirements: [
      "Strong organizational and teamwork skills",
      "Comfortable with physical tasks (lifting, packing)",
      "Empathy and a respectful approach to beneficiaries",
      "Ability to adapt quickly in dynamic environments"
    ],
    commitment: ["On-site and Hybrid", "Estimated time: 5–10 hours per week", "Available for weekend distributions"],
    gains: [
      "Hands-on experience in humanitarian relief operations",
      "Direct engagement with communities",
      "Logistics and inventory management skills",
      "Certificate of service"
    ],
    customQuestions: [
      { id: "reliefExperience", type: "radio", label: "Do you have prior experience in relief distribution or community welfare? *", options: ["Yes", "No"], required: true },
      { id: "physicallyFit", type: "radio", label: "Are you comfortable with physical tasks such as packing boxes and lifting supplies? *", options: ["Yes", "No"], required: true },
      { id: "logisticsSkills", type: "textarea", label: "Describe any skills you have related to inventory, logistics, or crowd control", placeholder: "Your skills...", required: false }
    ]
  },
  {
    id: "education-and-school",
    title: "Education and School support",
    about: "Our Education unit focuses on improving access to quality learning. We support schools, run back-to-school drives, and provide direct tutoring and mentorship to students in marginalized communities.",
    responsibilities: [
      "Provide tutoring, literacy support, and mentoring to students",
      "Assist in distributing school supplies and educational materials",
      "Help organize and facilitate educational workshops and camps",
      "Support local teachers with resources and classroom activities"
    ],
    requirements: [
      "Passion for education and youth development",
      "Patience, creativity, and excellent communication skills",
      "Background in education, child psychology, or tutoring is an advantage",
      "Ability to engage with children of varying ages"
    ],
    commitment: ["Hybrid (Schools and remote prep)", "Estimated time: 4–8 hours per week", "Duration: Minimum 3 months"],
    gains: [
      "Impacting the future of children through education",
      "Developing teaching and facilitation skills",
      "Experience in youth mentorship and program design",
      "Certificate of service"
    ],
    customQuestions: [
      { id: "teachingExperience", type: "select", label: "What is your level of teaching or tutoring experience? *", options: ["None", "Beginner (informal tutoring)", "Intermediate (1-2 years)", "Advanced (Professional Teacher/Educator)"], required: true },
      { id: "preferredAgeGroup", type: "select", label: "Which age group do you prefer to work with? *", options: ["Early Childhood (Ages 3-5)", "Primary (Ages 6-11)", "Secondary (Ages 12-17)", "Any age group"], required: true },
      { id: "subjectExpertise", type: "text", label: "Are there specific subjects you excel at teaching?", placeholder: "e.g., Mathematics, English, Sciences...", required: false }
    ]
  },
  {
    id: "volunteers-management",
    title: "Volunteers management Unit",
    about: "Volunteers are the heartbeat of our organization. This unit manages the volunteer lifecycle—recruiting, onboarding, training, and retaining the passionate individuals who drive our mission forward.",
    responsibilities: [
      "Lead recruitment campaigns and review volunteer applications",
      "Conduct onboarding sessions and orientations",
      "Track volunteer engagement, hours, and performance",
      "Organize volunteer appreciation events and welfare initiatives"
    ],
    requirements: [
      "Strong background in HR, administration, or team management",
      "Excellent interpersonal and conflict resolution skills",
      "Highly organized and detail-oriented",
      "Ability to motivate and inspire teams"
    ],
    commitment: ["Remote/Hybrid", "Estimated time: 8–10 hours per week", "Duration: Minimum 6 months"],
    gains: [
      "High-level experience in HR and talent management",
      "Leadership and organizational development",
      "Networking across all units of the organization",
      "Certificate of service"
    ],
    customQuestions: [
      { id: "hrExperience", type: "radio", label: "Do you have formal experience in Human Resources or Volunteer Management? *", options: ["Yes", "No"], required: true },
      { id: "managementYears", type: "select", label: "Years of team management experience *", options: ["None", "0–1 years", "2–3 years", "4+ years"], required: true },
      { id: "conflictResolution", type: "textarea", label: "Briefly describe how you would handle an unengaged or difficult volunteer *", placeholder: "Your approach...", required: true }
    ]
  },
  {
    id: "prayerroom",
    title: "Prayerroom",
    about: "The Prayerroom provides the spiritual foundation for our work. This unit offers intercessory prayer, spiritual support, and counseling for both our team members and the communities we serve.",
    responsibilities: [
      "Organize and lead regular prayer sessions for the organization's goals",
      "Provide spiritual guidance and a listening ear to volunteers and beneficiaries",
      "Maintain a prayer request log and follow up on spiritual needs",
      "Support the pastoral care aspect of community outreaches"
    ],
    requirements: [
      "Strong spiritual foundation and active faith life",
      "High level of empathy, compassion, and active listening",
      "Strict adherence to confidentiality and trust",
      "Prior experience in ministry or counseling is a strong advantage"
    ],
    commitment: ["Hybrid", "Estimated time: 3–5 hours per week", "Duration: Flexible"],
    gains: [
      "Spiritual growth and deep community connection",
      "Experience in pastoral care and emotional support",
      "Opportunity to serve the team in a foundational way",
      "Certificate of service"
    ],
    customQuestions: [
      { id: "faithBackground", type: "textarea", label: "Briefly describe your faith journey and why you want to serve in the Prayerroom *", placeholder: "Your background...", required: true },
      { id: "counselingExperience", type: "radio", label: "Do you have any formal training or experience in pastoral care or counseling? *", options: ["Yes", "No"], required: true },
      { id: "confidentialityAgreement", type: "radio", label: "Do you agree to maintain absolute confidentiality regarding prayer requests and counseling sessions? *", options: ["Yes, I agree", "No"], required: true }
    ]
  },
  {
    id: "partnership-and-resource",
    title: "Partnership and resource mobilization",
    about: "We rely on strategic partnerships and resources to maximize our impact. This unit is dedicated to identifying sponsors, writing grants, and building relationships that sustain our programs.",
    responsibilities: [
      "Identify and approach potential corporate sponsors and donors",
      "Assist in writing grant proposals and funding applications",
      "Maintain a database of partners and handle donor communications",
      "Develop innovative fundraising campaigns"
    ],
    requirements: [
      "Experience in fundraising, sales, or business development",
      "Exceptional written and verbal communication skills",
      "Strategic thinking and strong networking abilities",
      "Comfortable pitching ideas and making 'asks'"
    ],
    commitment: ["Remote", "Estimated time: 5–10 hours per week", "Duration: Minimum 6 months"],
    gains: [
      "Real-world experience in nonprofit fundraising and grant writing",
      "Building a robust professional network",
      "Strategic planning and corporate relations skills",
      "Certificate of service"
    ],
    customQuestions: [
      { id: "fundraisingExperience", type: "select", label: "Years of experience in fundraising, grants, or sales *", options: ["None", "Less than 1 year", "1–3 years", "3+ years"], required: true },
      { id: "proposalWriting", type: "radio", label: "Have you ever written a grant proposal or sponsorship pitch deck? *", options: ["Yes", "No"], required: true },
      { id: "networkStrength", type: "textarea", label: "Describe your experience with networking or building professional partnerships *", placeholder: "Your experience...", required: true }
    ]
  },
  {
    id: "monitoring-and-evaluation",
    title: "Monitoring and Evaluation",
    about: "To ensure our interventions are truly effective, the M&E unit tracks progress, collects vital data, and measures the long-term impact of our projects across all communities.",
    responsibilities: [
      "Design surveys and data collection tools (e.g., KoboToolbox)",
      "Collect and clean data from field outreaches",
      "Analyze metrics to evaluate program effectiveness",
      "Prepare clear, actionable impact reports for stakeholders"
    ],
    requirements: [
      "Strong analytical and data management skills",
      "Familiarity with M&E frameworks and data collection tools",
      "High attention to detail and accuracy",
      "Ability to translate complex data into readable reports"
    ],
    commitment: ["Remote/Hybrid", "Estimated time: 5–10 hours per week", "Duration: Minimum 6 months"],
    gains: [
      "Practical experience in impact measurement",
      "Advanced data analysis and reporting skills",
      "Exposure to NGO evaluation standards",
      "Certificate of service"
    ],
    customQuestions: [
      { id: "dataTools", type: "text", label: "List the data collection/analysis tools you are proficient in (e.g., Excel, SPSS, KoboToolbox) *", placeholder: "e.g., Advanced Excel, PowerBI...", required: true },
      { id: "meExperience", type: "select", label: "Years of experience in Monitoring & Evaluation or Data Analysis *", options: ["None", "0-1 years", "2-3 years", "4+ years"], required: true },
      { id: "reportWriting", type: "radio", label: "Are you comfortable writing analytical reports based on data? *", options: ["Yes", "No"], required: true }
    ]
  },
  {
    id: "media-and-communications",
    title: "Media and Communications",
    about: "The Media and Communications unit is the voice of the organization. We amplify our impact through compelling storytelling, photography, videography, and strategic digital marketing.",
    responsibilities: [
      "Create engaging content for social media, newsletters, and blogs",
      "Capture and edit photos and videos from outreaches",
      "Design graphics for campaigns and reports",
      "Manage social media platforms and public relations"
    ],
    requirements: [
      "Creative eye for storytelling and visual design",
      "Proficiency in relevant tools (e.g., Canva, Adobe Creative Suite, CapCut)",
      "Strong copywriting and editing skills",
      "Ability to meet deadlines in a fast-paced environment"
    ],
    commitment: ["Remote/Hybrid", "Estimated time: 8–12 hours per week", "Duration: Minimum 3 months"],
    gains: [
      "Building a professional portfolio with real-world impact content",
      "Hands-on experience in digital marketing and PR",
      "Networking with media professionals",
      "Certificate of service"
    ],
    customQuestions: [
      { id: "mediaSpecialty", type: "select", label: "What is your primary area of expertise? *", options: ["Photography", "Videography/Editing", "Graphic Design", "Copywriting/Content", "Social Media Management", "Multiple Areas"], required: true },
      { id: "softwareSkills", type: "text", label: "What creative software are you proficient in? *", placeholder: "e.g., Premiere Pro, Photoshop, Canva...", required: true },
      { id: "portfolioLink", type: "text", label: "Link to your portfolio or sample work (Highly recommended)", placeholder: "https://...", required: false }
    ]
  },
  {
    id: "operations-and-logistics",
    title: "Operations and Logistics",
    about: "Our outreaches require meticulous planning and execution on the ground. The Operations unit ensures everything runs seamlessly, from transportation to supply chain management and venue setup.",
    responsibilities: [
      "Coordinate transportation and route planning for outreach teams",
      "Manage the inventory of supplies, equipment, and outreach gear",
      "Oversee venue preparation, crowd control, and site safety",
      "Handle procurement and vendor relations when necessary"
    ],
    requirements: [
      "Exceptional organizational and problem-solving skills",
      "Ability to work well under pressure and adapt quickly",
      "Reliability, punctuality, and a proactive mindset",
      "Valid driver's license is an advantage but not strictly required"
    ],
    commitment: ["On-site (Outreach locations)", "Available for outreach weekends", "Duration: Flexible"],
    gains: [
      "Hands-on event management and operations experience",
      "Leadership and rapid problem-solving skills",
      "Direct involvement in successful community interventions",
      "Certificate of service"
    ],
    customQuestions: [
      { id: "logisticsExperience", type: "select", label: "Years of experience in event planning, logistics, or operations *", options: ["None", "0-1 years", "2-3 years", "4+ years"], required: true },
      { id: "hasDriversLicense", type: "radio", label: "Do you have a valid driver's license? *", options: ["Yes", "No"], required: true },
      { id: "pressureHandling", type: "textarea", label: "Describe a time when a plan went wrong and how you quickly resolved it *", placeholder: "Your experience...", required: true }
    ]
  },
  {
    id: "finance-unit",
    title: "Finance Unit",
    about: "The Finance unit ensures transparency, accountability, and the financial health of our programs. We handle budgeting, expense tracking, and comprehensive financial reporting.",
    responsibilities: [
      "Assist with program budgeting and financial forecasting",
      "Track daily expenses, process reimbursements, and file receipts",
      "Prepare monthly and quarterly financial reports",
      "Ensure compliance with organizational financial policies"
    ],
    requirements: [
      "Background in accounting, finance, or business administration",
      "High attention to detail and numerical accuracy",
      "Proficiency in Excel and familiarity with accounting software",
      "Strong ethical compass and integrity"
    ],
    commitment: ["Remote/Hybrid", "Estimated time: 5–8 hours per week", "Duration: Minimum 6 months"],
    gains: [
      "Practical experience in NGO financial management",
      "Budgeting and compliance skills",
      "Understanding of non-profit accounting standards",
      "Certificate of service"
    ],
    customQuestions: [
      { id: "financeExperience", type: "select", label: "Years of experience in accounting or finance *", options: ["None", "0-1 years", "2-3 years", "4+ years"], required: true },
      { id: "financeTools", type: "text", label: "What financial tools or software are you comfortable using? *", placeholder: "e.g., Advanced Excel, QuickBooks...", required: true },
      { id: "attentionToDetail", type: "radio", label: "Are you comfortable handling sensitive financial data with strict confidentiality? *", options: ["Yes", "No"], required: true }
    ]
  },
  {
    id: "admin-unit",
    title: "Admin Unit",
    about: "The Admin unit provides the essential backbone of our organization, keeping everything running efficiently. This includes documentation, scheduling, and supporting all other units.",
    responsibilities: [
      "Manage organizational correspondence, emails, and schedules",
      "Maintain organized digital records and documentation",
      "Take minutes during meetings and track action items",
      "Provide general administrative support to project leads"
    ],
    requirements: [
      "Strong organizational and administrative skills",
      "Proficiency in office tools (Google Workspace, Microsoft Office)",
      "Excellent written communication skills",
      "Ability to multitask and prioritize effectively"
    ],
    commitment: ["Remote/Hybrid", "Estimated time: 5–10 hours per week", "Duration: Minimum 6 months"],
    gains: [
      "Extensive experience in office administration",
      "Exposure to the inner workings of an NGO",
      "Enhanced time management and organizational skills",
      "Certificate of service"
    ],
    customQuestions: [
      { id: "adminExperience", type: "select", label: "Years of administrative or executive assistant experience *", options: ["None", "0-1 years", "2-3 years", "4+ years"], required: true },
      { id: "officeTools", type: "text", label: "Which office tools are you highly proficient in? *", placeholder: "e.g., Google Workspace, Microsoft Word/Excel...", required: true },
      { id: "organizationSkills", type: "textarea", label: "How do you keep yourself organized when handling multiple tasks? *", placeholder: "Your methods...", required: true }
    ]
  },
  {
    id: "safeguarding-and-ethics",
    title: "Safeguarding and Ethics",
    about: "We prioritize the safety, dignity, and rights of everyone we interact with. This unit ensures our work is conducted ethically and that robust safeguarding policies are enforced.",
    responsibilities: [
      "Implement and monitor safeguarding policies during all activities",
      "Conduct ethics and compliance training for staff and volunteers",
      "Handle confidential reports, grievances, and safeguarding issues",
      "Ensure compliance with local laws and humanitarian standards"
    ],
    requirements: [
      "Deep understanding of safeguarding principles and child protection",
      "Background in law, social work, HR, or compliance is highly desirable",
      "High integrity, impartiality, and discretion",
      "Ability to handle sensitive situations calmly and professionally"
    ],
    commitment: ["Remote/Hybrid", "Estimated time: 5–8 hours per week", "Duration: Minimum 6 months"],
    gains: [
      "Experience in compliance, ethics, and safeguarding",
      "Policy implementation and training skills",
      "Contributing to a secure and accountable organizational culture",
      "Certificate of service"
    ],
    customQuestions: [
      { id: "safeguardingKnowledge", type: "radio", label: "Do you have prior knowledge or training in safeguarding and child protection? *", options: ["Yes", "No"], required: true },
      { id: "complianceExperience", type: "textarea", label: "Describe your experience with compliance, ethics, or handling sensitive reports *", placeholder: "Your experience...", required: true },
      { id: "scenarioHandling", type: "textarea", label: "Briefly explain how you would handle a report of a volunteer behaving unethically during an outreach *", placeholder: "Your approach...", required: true }
    ]
  }
];
