"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Stethoscope, Shirt, GraduationCap, Home, BookOpen, BookHeart } from "lucide-react";
import TakeActionSection from "../components/TakeActionSection";

const projects = [
  {
    title: "Rural Medical Outreaches",
    description: "We believe that the one and only God is Spirit, self-existing, infinite, personal, immutable and eternal in His being. We believe in His perfect holiness, love, justice, goodness, wisdom and truth, omnipotence, Omniscience, and Omnipresence. We believe that God is the Creator and sustainer of the universe, and that He is eternally existent in three persons, one in substance and co- equal in power and glory- Father, Son and Holy Spirit.",
    icon: Stethoscope,
    color: "bg-[#e8f0e8]",
    iconColor: "text-[#2d5a3d]",
    image: "/md.jpg"
  },
  {
    title: "Clothing",
    description: "We believe that everyone irrespective of creed, tribe and gender deserve to be decently clothed. We accept donations from any part of the world.",
    icon: Shirt,
    color: "bg-[#f0e8e8]",
    iconColor: "text-[#8b4513]",
    image: "/hero4.jpg"
  },
  {
    title: "Students' Assistance",
    description: "You can sponsor a Secondary School Student from Senior year through University. Most young people in rural secondary schools do not get through senior year to university, your support can assist in ensuring the university education of a child.",
    icon: GraduationCap,
    color: "bg-[#e8e8f0]",
    iconColor: "text-[#4a4a8a]",
    image: "/sa.jpg"
  },
  {
    title: "Build habitable homes for Widows",
    description: "We are committed to building low cost habitable homes for very poor widows. You can help us build a home for one widow at a time by donating building materials or financial donation of any amount.",
    icon: Home,
    color: "bg-[#f0f0e8]",
    iconColor: "text-[#6b6b2d]",
    image: "/hero4.jpg"
  },
  {
    title: "Back to School Program",
    description: "In order to promote education in poor communities, Children and students are given free books, writing tools, school bags and shoes that will last them throughout an academic session.",
    icon: BookOpen,
    color: "bg-[#e8f0e8]",
    iconColor: "text-[#2d5a3d]",
    image: "/hero2.jpg"
  },
  {
    title: "Donate Bibles to rural Churches",
    description: "We support rural churches by donating bibles and evangelism materials in local languages and renovating of church building. For just $10 you can donate, a bible or building materials for rural churches support",
    icon: BookHeart,
    color: "bg-[#f0e8e8]",
    iconColor: "text-[#8b4513]",
    image: "/hero6.jpg"
  }
];

export default function ProjectsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen font-sans bg-[#F5F5F5]">
      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-2 md:py-1 flex items-center justify-between bg-white/80 backdrop-blur-md md:bg-transparent md:backdrop-blur-none">
        <div className="flex items-center gap-2 md:gap-3 group cursor-pointer">
          <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
            <Image src="/logo.svg" alt="8th Mile Project" fill className="object-contain" />
          </div>
        </div>

        <nav className="hidden md:flex items-center bg-white rounded-full px-2 py-2 shadow-sm">
          {["Home", "Projects", "Partners", "Our Faith", "Contact"].map((item) => (
            <a
              key={item}
              href={item === "Home" ? "/" : item === "Our Faith" ? "/our-faith" : item === "Partners" ? "/partners" : item === "Projects" ? "/projects" : "#"}
              className={`px-4 lg:px-6 py-2 text-sm font-medium transition-all duration-300 rounded-full ${item === "Projects" ? "bg-[#e8f0e8] text-[#1a3d2e]" : "text-gray-600 hover:text-[#1a3d2e]"}`}
            >
              {item}
            </a>
          ))}
        </nav>

        <a
          href="/donate"
          className="hidden bg-white md:block px-6 lg:px-8 py-2.5 lg:py-3 text-sm font-semibold border-2 border-[#ffffff] text-[#1a3d2e] rounded-full hover:bg-[#1a3d2e] hover:text-white transition-all duration-300"
        >
          Donate Now
        </a>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {mobileMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>

        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden py-4 px-4">
            <nav className="flex flex-col gap-2">
              {["Home", "Projects", "Partners", "Our Faith", "Contact"].map((item) => (
                <a
                  key={item}
                  href={item === "Home" ? "/" : item === "Our Faith" ? "/our-faith" : item === "Partners" ? "/partners" : item === "Projects" ? "/projects" : "#"}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg ${item === "Projects" ? "bg-[#e8f0e8] text-[#1a3d2e]" : "text-gray-600 hover:text-[#1a3d2e] hover:bg-gray-50"}`}
                >
                  {item}
                </a>
              ))}
              <a
                href="/donate"
                className="mt-2 w-full px-4 py-3 text-sm font-semibold bg-[#1a3d2e] text-white rounded-lg hover:bg-[#143324] transition-all duration-300 text-center block"
              >
                Donate Now
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/pj.jpg" alt="Our Projects" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a3d2e]/90 via-[#1a3d2e]/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-6 mx-auto">
            <span className="w-2 h-2 rounded-full bg-[#4ade80]" />
            <span className="text-xs font-bold tracking-wider text-white uppercase">Touching Lives</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
            Our <span className="text-[#4ade80]">Projects</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            The 8th Mile is volunteer and partnership based, our objectives are realised through YWAP centres that are spread across Nigeria. We mobilize and connect the hearts, skills and resources of local and international partners who believe in our goals.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-48 sm:h-64 bg-gradient-to-t from-[#F5F5F5] via-[#F5F5F5]/80 to-transparent" />
      </section>

      {/* --- TAKE ACTION SECTION --- */}
      <TakeActionSection />

      {/* --- OUR PROJECTS SECTION --- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a3d2e]/10 rounded-full text-[#1a3d2e] text-xs font-bold tracking-wider uppercase mb-6">
              Our Initiatives
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What We Do
            </h2>
          </div>

          <div className="space-y-24">
            {projects.map((project, index) => {
              const IconComponent = project.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={project.title}
                  className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center group`}
                >
                  {/* Image Side */}
                  <div className="w-full lg:w-1/2">
                    <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-500">
                      <Image src={project.image} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                      <div className={`absolute top-6 ${isEven ? 'left-6' : 'right-6'} w-16 h-16 ${project.color} backdrop-blur-md bg-opacity-90 rounded-2xl flex items-center justify-center shadow-lg`}>
                        <IconComponent className={`w-8 h-8 ${project.iconColor}`} />
                      </div>
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className="w-full lg:w-1/2 space-y-6 px-4 lg:px-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a3d2e]/5 rounded-full">
                      <span className="text-[#1a3d2e] font-bold text-sm tracking-wider uppercase">Initiative 0{index + 1}</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                      {project.title}
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {project.description}
                    </p>
                    <a href="/donate" className="inline-flex items-center gap-2 text-[#2d5a3d] font-bold text-lg hover:gap-4 transition-all duration-300 mt-4">
                      Support this project
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1a3d2e] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4ade80]/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4ade80]/10 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Help Us Make A Change
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
            By donating, you are supporting all our projects and interventions and helping to bring about long lasting change to the lives of many.
          </p>
          <a
            href="/donate"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#4ade80] text-[#1a3d2e] rounded-full font-bold text-lg hover:bg-[#3ec46e] transition-all"
          >
            Donate Now
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#0f261c] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-12 h-12">
                  <Image src="/logo.svg" alt="8th Mile Project" fill className="object-contain" />
                </div>
                <span className="text-white font-bold text-lg">8th Mile Project</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                The missions&apos; arm of YWAP, caring for people in need as instructed in Matthew 25:35-40.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { label: "Home", href: "/" },
                  { label: "About Us", href: "#" },
                  { label: "Our Projects", href: "/projects" },
                  { label: "Our Faith", href: "/our-faith" },
                  { label: "Contact", href: "#" }
                ].map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-white/60 hover:text-white transition-colors text-sm">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Our Programs</h4>
              <ul className="space-y-3">
                {[
                  { label: "Medical Outreaches", href: "/projects" },
                  { label: "Student Support", href: "/projects" },
                  { label: "Back to School", href: "/projects" },
                  { label: "Homes for Widows", href: "/projects" },
                  { label: "Bible Donation", href: "/projects" }
                ].map((program) => (
                  <li key={program.label}>
                    <a href={program.href} className="text-white/60 hover:text-white transition-colors text-sm">{program.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Contact Us</h4>
              <ul className="space-y-3 text-white/60 text-sm">
                <li><a href="mailto:info@the8thmileproject.org" className="hover:text-white transition-colors">info@the8thmileproject.org</a></li>
                <li><a href="tel:+2347039550499" className="hover:text-white transition-colors">+234 703 955 0499</a></li>
                <li>Abuja, Nigeria</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">The 8th Mile Project © 2026. All rights reserved.</p>
            <div className="flex gap-6">
              {["Facebook", "Twitter", "Youtube"].map((social) => (
                <a key={social} href="#" className="text-white/40 hover:text-white transition-colors text-sm">{social}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
