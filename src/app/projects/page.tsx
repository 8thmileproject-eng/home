"use client";

import Image from "next/image";
import { ArrowRight, Stethoscope, Shirt, GraduationCap, Home, BookOpen, BookHeart } from "lucide-react";
import TakeActionSection from "../components/TakeActionSection";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
  return (
    <div className="relative min-h-screen font-sans bg-[#F5F5F5]">
      {/* --- HEADER --- */}
      <Header />

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
      <Footer />
    </div>
  );
}
