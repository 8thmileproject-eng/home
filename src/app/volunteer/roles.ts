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
    id: "communications-manager",
    title: "Volunteer Communications Manager",
    about: "The Volunteer Communications Manager will lead the development and execution of communication strategies to promote our work, engage audiences, and amplify our impact. We are seeking a passionate and skilled individual to support the 8thMile mission by strengthening our visibility, storytelling, and stakeholder engagement.",
    responsibilities: [
      "Develop and implement a communications strategy",
      "Manage social media platforms and digital presence",
      "Create engaging content (articles, posts, newsletters, reports)",
      "Document activities through photos, videos, and storytelling",
      "Support branding and visibility of projects",
      "Liaise with partners and stakeholders on communication needs",
      "Assist in producing reports and communication materials"
    ],
    requirements: [
      "Background in Communications, Media, Public Relations, or related field",
      "Strong writing and editing skills",
      "Experience managing social media platforms",
      "Basic graphic design skills (e.g., Canva) is an advantage",
      "Ability to work independently and meet deadlines",
      "Passion for social impact and community development"
    ],
    commitment: ["Remote/Hybrid (depending on location)", "Estimated time: 8–12 hours per week", "Duration: 3–6 months, renewable"],
    gains: ["Hands-on experience in nonprofit communications", "Opportunity to contribute to impactful programs", "Professional development and networking opportunities", "Certificate of service upon successful completion"],
    customQuestions: [
      { id: "hasCommsExperience", type: "radio", label: "Do you have experience in communications, media, or related fields? *", options: ["Yes", "No"], required: true },
      { id: "commsTools", type: "text", label: "List any tools you are proficient in (e.g., Canva, Adobe Suite, social media platforms)", placeholder: "Canva, Instagram, Mailchimp...", required: false },
      { id: "writingSkills", type: "select", label: "How would you rate your writing skills? *", options: ["Beginner", "Intermediate", "Advanced"], required: true },
      { id: "socialMediaSkills", type: "select", label: "How would you rate your social media management skills? *", options: ["Beginner", "Intermediate", "Advanced"], required: true }
    ]
  },

  // {
  //   id: "volunteer-nurse",
  //   title: "Volunteer Nurse",
  //   about: "We welcome both qualified nurses and nursing students to join our rural medical outreaches. You will provide direct patient care, health education, and support to underserved communities. Students will work under the supervision of licensed professionals and gain invaluable hands-on clinical experience.",
  //   responsibilities: ["Conduct basic health assessments and triage patients", "Administer medications and treatments under physician supervision", "Provide health education on hygiene, nutrition, and disease prevention", "Assist with mobile clinic setup and patient flow", "Maintain accurate patient records"],
  //   requirements: ["Nursing license (RN or equivalent) OR currently enrolled in a nursing program", "Basic clinical knowledge and patient care skills", "Ability to work in challenging, low-resource environments", "Strong communication and interpersonal skills", "Willingness to travel to rural communities"],
  //   commitment: ["On-site (Rural Communities)", "Available for weekend outreaches (1–3 days per month)", "Duration: Flexible, ongoing"],
  //   gains: ["Direct impact on the health and well-being of vulnerable populations", "Clinical experience in global health / resource-limited settings", "Mentorship from licensed healthcare professionals", "Certificate of service and letter of recommendation"],
  //   customQuestions: [
  //     { id: "nurseStatus", type: "select", label: "What is your current professional status? *", options: ["Licensed / Registered Nurse", "Nursing Student (clinical year)", "Nursing Student (pre-clinical)", "Recently Graduated (awaiting license)"], required: true },
  //     { id: "licenseNumber", type: "text", label: "Nursing License Number (if applicable)", placeholder: "e.g. RN12345678 — leave blank if still a student", required: false },
  //     { id: "clinicalExperienceYears", type: "select", label: "Clinical experience *", options: ["No clinical experience yet", "Less than 1 year", "1–3 years", "3–5 years", "5+ years"], required: true },
  //     { id: "hasRuralExperience", type: "radio", label: "Have you worked in a rural or low-resource setting before?", options: ["Yes", "No"], required: false }
  //   ]
  // },
  // {
  //   id: "volunteer-doctor",
  //   title: "Volunteer Doctor",
  //   about: "We welcome qualified physicians as well as medical students to join our outreach teams. Licensed doctors will lead consultations and clinical decisions, while medical students will assist under supervision — gaining real-world experience in community health and tropical medicine.",
  //   responsibilities: ["Provide medical consultations and diagnoses in mobile clinic settings", "Prescribe appropriate medications and treatments (licensed doctors)", "Assist senior physicians and support patient flow (students)", "Refer complex cases to secondary or tertiary care facilities", "Supervise and guide nurses and other medical volunteers (licensed doctors)"],
  //   requirements: ["Medical degree (MD, DO, MBBS or equivalent) OR currently enrolled in medical school", "Ability to make or support clinical decisions in low-resource environments", "Strong leadership and teamwork skills", "Willingness to travel to remote locations"],
  //   commitment: ["On-site (Rural Communities)", "Available for weekend outreaches (1–3 days per month)", "Duration: Flexible, ongoing"],
  //   gains: ["Opportunity to save lives and make a tangible difference", "Experience in tropical medicine and resource-limited clinical care", "Leadership opportunities within the medical outreach team", "Certificate of service and formal recognition"],
  //   customQuestions: [
  //     { id: "doctorStatus", type: "select", label: "What is your current professional status? *", options: ["Licensed Physician", "Medical Resident / House Officer", "Medical Student (clinical year)", "Medical Student (pre-clinical)", "Recently Graduated (awaiting license)"], required: true },
  //     { id: "medicalLicense", type: "text", label: "Medical License / Registration Number (if applicable)", placeholder: "e.g. MD98765432 — leave blank if still a student", required: false },
  //     { id: "specialty", type: "text", label: "Specialty or Area of Interest", placeholder: "e.g. General Practice, Pediatrics, Surgery, Public Health", required: false },
  //     { id: "doctorExperienceYears", type: "select", label: "Clinical experience *", options: ["No clinical experience yet", "Less than 1 year", "1–3 years", "3–5 years", "5–10 years", "10+ years"], required: true }
  //   ]
  // },
  // {
  //   id: "volunteer-media",
  //   title: "Volunteer Media & Content Creator",
  //   about: "Help us tell the story of our impact through photos, videos, and digital content. We are looking for photographers, videographers, graphic designers, and content creators to document outreaches and amplify our mission across digital platforms.",
  //   responsibilities: ["Capture photos and videos during outreaches and events", "Edit and produce short-form and long-form video content", "Design graphics for social media, reports, and campaigns", "Support the creation of newsletters and impact reports", "Maintain a media library of project documentation"],
  //   requirements: ["Experience with photography, videography, or graphic design", "Proficiency in relevant tools (e.g., Adobe Suite, Final Cut, DaVinci Resolve, Canva)", "Creative eye for storytelling and visual communication", "Own equipment is a plus but not mandatory", "Passion for social impact and community work"],
  //   commitment: ["Hybrid (on-site during outreaches, remote for editing)", "Estimated time: 5–10 hours per week", "Duration: Flexible, project-based or ongoing"],
  //   gains: ["Build a professional portfolio with real-world nonprofit content", "Hands-on experience in impact storytelling", "Networking with other creatives and media professionals", "Certificate of service upon successful completion"],
  //   customQuestions: [
  //     { id: "mediaSpecialty", type: "select", label: "What is your primary area of interest? *", options: ["Photography", "Videography", "Graphic Design", "Content Writing", "Social Media Management", "Multiple / All of the above"], required: true },
  //     { id: "mediaTools", type: "text", label: "What tools or software are you proficient in?", placeholder: "e.g. Adobe Premiere, Lightroom, Canva, Final Cut Pro...", required: false },
  //     { id: "hasEquipment", type: "radio", label: "Do you have your own equipment (camera, laptop, etc.)?", options: ["Yes", "No", "Some"], required: false },
  //     { id: "portfolioLink", type: "text", label: "Link to your portfolio or sample work (if available)", placeholder: "https://...", required: false }
  //   ]
  // },
  // {
  //   id: "volunteer-logistics",
  //   title: "Volunteer Logistics & Operations",
  //   about: "Our outreaches require careful planning and execution on the ground. We need organised and dependable individuals to help with transportation coordination, supplies management, venue setup, and general operations during field activities.",
  //   responsibilities: ["Coordinate transportation and logistics for outreach teams", "Manage inventory of supplies, equipment, and donations", "Assist with venue and site preparation before events", "Support crowd management and registration during outreaches", "Handle procurement and distribution of materials"],
  //   requirements: ["Strong organisational and problem-solving skills", "Ability to work under pressure and adapt quickly", "Reliable, punctual, and detail-oriented", "Comfortable with physical tasks (loading, setup, etc.)", "Valid driver's license is an advantage but not required"],
  //   commitment: ["On-site (event locations and communities)", "Available for outreach weekends (1–3 days per month)", "Duration: Flexible, ongoing"],
  //   gains: ["Hands-on event management and operations experience", "Leadership and coordination skills development", "Opportunity to see the direct impact of your work on communities", "Certificate of service and letter of recommendation"],
  //   customQuestions: [
  //     { id: "logisticsExperience", type: "radio", label: "Do you have experience in event planning, logistics, or operations? *", options: ["Yes", "No"], required: true },
  //     { id: "hasDriversLicense", type: "radio", label: "Do you have a valid driver's license?", options: ["Yes", "No"], required: false },
  //     { id: "physicallyFit", type: "radio", label: "Are you comfortable with physical tasks (lifting supplies, setting up venues, etc.)? *", options: ["Yes", "No"], required: true },
  //     { id: "logisticsSkills", type: "text", label: "Describe any relevant skills or experience", placeholder: "e.g. supply chain, warehouse management, event coordination...", required: false }
  //   ]
  // },
  // {
  //   id: "volunteer-counsellor",
  //   title: "Volunteer Counsellor",
  //   about: "Provide emotional support, mental health awareness, and counselling services to community members during and after outreaches. We welcome licensed counsellors, psychologists, social workers, and students in related fields who are passionate about mental health and community well-being.",
  //   responsibilities: ["Provide one-on-one and group counselling during outreaches", "Conduct mental health awareness sessions in communities", "Offer emotional first aid and trauma-informed support", "Refer individuals to professional services when needed", "Support team well-being and provide debriefing after outreaches"],
  //   requirements: ["Background in Counselling, Psychology, Social Work, or related field (degree or currently studying)", "Strong active listening and empathy skills", "Ability to maintain confidentiality and professional boundaries", "Cultural sensitivity and awareness", "Willingness to work in rural and underserved communities"],
  //   commitment: ["On-site during outreaches, with remote support options", "Available for weekend outreaches (1–3 days per month)", "Duration: Flexible, ongoing"],
  //   gains: ["Practical counselling experience in community settings", "Exposure to diverse populations and mental health challenges", "Professional development and supervised practice hours", "Certificate of service and letter of recommendation"],
  //   customQuestions: [
  //     { id: "counsellingStatus", type: "select", label: "What is your current professional status? *", options: ["Licensed Counsellor / Psychologist", "Social Worker", "Student (Counselling / Psychology / Social Work)", "Recently Graduated", "Other related background"], required: true },
  //     { id: "counsellingLicense", type: "text", label: "License or Registration Number (if applicable)", placeholder: "Leave blank if still a student", required: false },
  //     { id: "counsellingExperience", type: "select", label: "Counselling experience *", options: ["No formal experience yet", "Less than 1 year", "1–3 years", "3–5 years", "5+ years"], required: true },
  //     { id: "counsellingAreas", type: "text", label: "Areas of interest or specialisation", placeholder: "e.g. Trauma, Grief, Youth counselling, Family therapy...", required: false }
  //   ]
  // },
  // {
  //   id: "general-volunteer",
  //   title: "General Volunteer",
  //   about: "Don't see a specific role that fits? No problem! We always need extra hands during outreaches. Whether it's helping with registration, distributing items, setting up, interacting with community members, or any other task — every contribution counts. No special qualifications needed, just a willing heart.",
  //   responsibilities: ["Assist with registration and crowd management during outreaches", "Help distribute food, clothing, medical supplies, and other items", "Support setup and teardown of outreach venues", "Engage with community members and provide general assistance", "Any other tasks as directed by the team leads"],
  //   requirements: ["No specific qualifications required", "Positive attitude and willingness to help", "Ability to follow instructions and work as part of a team", "Physically able to participate in on-site activities", "Passion for community service"],
  //   commitment: ["On-site (outreach locations)", "Flexible — join for as many outreaches as you can", "Duration: Open, no minimum commitment"],
  //   gains: ["Be part of a team making a real difference in people's lives", "Meet like-minded individuals passionate about service", "Gain experience in nonprofit and community development work", "Certificate of service upon request"],
  //   customQuestions: [
  //     { id: "areasOfInterest", type: "select", label: "Which area interests you most? *", options: ["Medical outreaches", "Education & back-to-school programs", "Community building & welfare", "Anything — I'm happy to help wherever needed"], required: true },
  //     { id: "specialSkills", type: "textarea", label: "Do you have any skills or experience you'd like to share?", placeholder: "e.g. first aid training, teaching, cooking, driving, languages spoken... or just tell us about yourself!", required: false },
  //     { id: "heardAboutUs", type: "select", label: "How did you hear about The 8th Mile Project?", options: ["Social Media", "Friend / Family", "Church / YWAP", "Website", "Event / Outreach", "Other"], required: false }
  //   ]
  // },



  {
    id: "lead-outreach",
    title: "Outreach & Community Engagement Unit Lead",
    about: "We are seeking committed and value-driven individuals to serve as Volunteer Unit Leads in key functional areas. These roles are critical to strengthening programme delivery, accountability, and community impact. The Outreach & Community Engagement Lead will design and coordinate outreach programmes, build partnerships with community stakeholders, and lead awareness and mobilization campaigns.",
    responsibilities: [
      "Design and coordinate outreach programmes",
      "Build partnerships with community stakeholders",
      "Lead awareness and mobilization campaigns"
    ],
    requirements: [
      "Relevant experience in the selected unit",
      "Strong leadership and coordination skills",
      "Commitment to humanitarian/development values",
      "Ability to work collaboratively in a volunteer-driven environment"
    ],
    commitment: ["Duration: 6–12 months", "Estimated time: 5–10 hours per week", "Mode: Remote/Hybrid"],
    gains: ["Leadership experience in a growing NGO", "Opportunity to drive strategic community impact", "Professional development and networking", "Certificate of service and formal recognition"],
    customQuestions: [
      { id: "yearsExperience", type: "select", label: "Years of Relevant Experience *", options: ["0–1 years", "2–3 years", "4–5 years", "6+ years"], required: true },
      { id: "experienceDescription", type: "textarea", label: "Briefly describe your relevant experience for this role (Max 300 words) *", placeholder: "Your experience...", required: true },
      { id: "technicalSkills", type: "textarea", label: "List key skills relevant to the role (e.g., data analysis, community mobilization, safeguarding, HR management) *", placeholder: "Your skills...", required: true },
      { id: "toolsFamiliarity", type: "textarea", label: "What tools or systems are you familiar with? (e.g., Excel, KoboToolbox, DHIS2, CRM tools, etc.) *", placeholder: "Your tools...", required: true },
      { id: "leadershipSituation", type: "textarea", label: "Describe a situation where you led a team or project successfully *", placeholder: "Your leadership experience...", required: true },
      { id: "conflictResolution", type: "textarea", label: "How do you handle challenges or conflict within a team? *", placeholder: "Your approach to conflict...", required: true },
      { id: "roleSpecificOutreach", type: "textarea", label: "Describe your experience engaging communities or stakeholders *", placeholder: "Your specific outreach experience...", required: true }
    ]
  },
  {
    id: "lead-relief",
    title: "Relief and Welfare Unit Lead",
    about: "We are seeking committed and value-driven individuals to serve as Volunteer Unit Leads in key functional areas. These roles are critical to strengthening programme delivery, accountability, and community impact. The Relief and Welfare Unit Lead will coordinate sourcing, procurement, storage, and distribution of relief materials such as fortified food for children, grains, and clothing.",
    responsibilities: [
      "Coordinate sourcing or procurement and storage of relief materials such as Fortified food for children, grains, clothing and any other relevant relief materials",
      "Coordinate distribution of fortified food for Children, grains to households and clothing to individuals"
    ],
    requirements: [
      "Relevant experience in the selected unit",
      "Strong leadership and coordination skills",
      "Commitment to humanitarian/development values",
      "Ability to work collaboratively in a volunteer-driven environment"
    ],
    commitment: ["Duration: 6–12 months", "Estimated time: 5–10 hours per week", "Mode: Remote/Hybrid"],
    gains: ["Leadership experience in a growing NGO", "Opportunity to drive strategic community impact", "Professional development and networking", "Certificate of service and formal recognition"],
    customQuestions: [
      { id: "yearsExperience", type: "select", label: "Years of Relevant Experience *", options: ["0–1 years", "2–3 years", "4–5 years", "6+ years"], required: true },
      { id: "experienceDescription", type: "textarea", label: "Briefly describe your relevant experience for this role (Max 300 words) *", placeholder: "Your experience...", required: true },
      { id: "technicalSkills", type: "textarea", label: "List key skills relevant to the role (e.g., data analysis, community mobilization, safeguarding, HR management) *", placeholder: "Your skills...", required: true },
      { id: "toolsFamiliarity", type: "textarea", label: "What tools or systems are you familiar with? (e.g., Excel, KoboToolbox, DHIS2, CRM tools, etc.) *", placeholder: "Your tools...", required: true },
      { id: "leadershipSituation", type: "textarea", label: "Describe a situation where you led a team or project successfully *", placeholder: "Your leadership experience...", required: true },
      { id: "conflictResolution", type: "textarea", label: "How do you handle challenges or conflict within a team? *", placeholder: "Your approach to conflict...", required: true },
      { id: "roleSpecificRelief", type: "textarea", label: "Describe your experience coordinating relief materials or logistics *", placeholder: "Your specific relief coordination experience...", required: true }
    ]
  },
  {
    id: "lead-volunteer-management",
    title: "Volunteer Management Unit Lead",
    about: "We are seeking committed and value-driven individuals to serve as Volunteer Unit Leads in key functional areas. These roles are critical to strengthening programme delivery, accountability, and community impact. The Volunteer Management Unit Lead will recruit, onboard, and support volunteers, develop volunteer policies and engagement strategies, and track volunteer performance and retention.",
    responsibilities: [
      "Recruit, onboard, and support volunteers",
      "Develop volunteer policies and engagement strategies",
      "Track volunteer performance and retention"
    ],
    requirements: [
      "Relevant experience in the selected unit",
      "Strong leadership and coordination skills",
      "Commitment to humanitarian/development values",
      "Ability to work collaboratively in a volunteer-driven environment"
    ],
    commitment: ["Duration: 6–12 months", "Estimated time: 5–10 hours per week", "Mode: Remote/Hybrid"],
    gains: ["Leadership experience in a growing NGO", "Opportunity to drive strategic community impact", "Professional development and networking", "Certificate of service and formal recognition"],
    customQuestions: [
      { id: "yearsExperience", type: "select", label: "Years of Relevant Experience *", options: ["0–1 years", "2–3 years", "4–5 years", "6+ years"], required: true },
      { id: "experienceDescription", type: "textarea", label: "Briefly describe your relevant experience for this role (Max 300 words) *", placeholder: "Your experience...", required: true },
      { id: "technicalSkills", type: "textarea", label: "List key skills relevant to the role (e.g., data analysis, community mobilization, safeguarding, HR management) *", placeholder: "Your skills...", required: true },
      { id: "toolsFamiliarity", type: "textarea", label: "What tools or systems are you familiar with? (e.g., Excel, KoboToolbox, DHIS2, CRM tools, etc.) *", placeholder: "Your tools...", required: true },
      { id: "leadershipSituation", type: "textarea", label: "Describe a situation where you led a team or project successfully *", placeholder: "Your leadership experience...", required: true },
      { id: "conflictResolution", type: "textarea", label: "How do you handle challenges or conflict within a team? *", placeholder: "Your approach to conflict...", required: true },
      { id: "roleSpecificVolunteer", type: "textarea", label: "Describe your experience managing or coordinating volunteers *", placeholder: "Your specific volunteer management experience...", required: true }
    ]
  },
  {
    id: "lead-safeguarding",
    title: "Safeguarding & Ethics Unit Lead",
    about: "We are seeking committed and value-driven individuals to serve as Volunteer Unit Leads in key functional areas. These roles are critical to strengthening programme delivery, accountability, and community impact. The Safeguarding & Ethics Unit Lead will ensure safeguarding policies are implemented, handle ethical concerns and reporting mechanisms, and train staff/volunteers on safeguarding standards.",
    responsibilities: [
      "Ensure safeguarding policies are implemented",
      "Handle ethical concerns and reporting mechanisms",
      "Train staff/volunteers on safeguarding standards"
    ],
    requirements: [
      "Relevant experience in the selected unit",
      "Strong leadership and coordination skills",
      "Commitment to humanitarian/development values",
      "Ability to work collaboratively in a volunteer-driven environment"
    ],
    commitment: ["Duration: 6–12 months", "Estimated time: 5–10 hours per week", "Mode: Remote/Hybrid"],
    gains: ["Leadership experience in a growing NGO", "Opportunity to drive strategic community impact", "Professional development and networking", "Certificate of service and formal recognition"],
    customQuestions: [
      { id: "yearsExperience", type: "select", label: "Years of Relevant Experience *", options: ["0–1 years", "2–3 years", "4–5 years", "6+ years"], required: true },
      { id: "experienceDescription", type: "textarea", label: "Briefly describe your relevant experience for this role (Max 300 words) *", placeholder: "Your experience...", required: true },
      { id: "technicalSkills", type: "textarea", label: "List key skills relevant to the role (e.g., data analysis, community mobilization, safeguarding, HR management) *", placeholder: "Your skills...", required: true },
      { id: "toolsFamiliarity", type: "textarea", label: "What tools or systems are you familiar with? (e.g., Excel, KoboToolbox, DHIS2, CRM tools, etc.) *", placeholder: "Your tools...", required: true },
      { id: "leadershipSituation", type: "textarea", label: "Describe a situation where you led a team or project successfully *", placeholder: "Your leadership experience...", required: true },
      { id: "conflictResolution", type: "textarea", label: "How do you handle challenges or conflict within a team? *", placeholder: "Your approach to conflict...", required: true },
      { id: "roleSpecificSafeguarding", type: "textarea", label: "Describe your experience with safeguarding, ethics, or compliance *", placeholder: "Your specific safeguarding experience...", required: true }
    ]
  }
];
