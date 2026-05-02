"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, BookOpen } from "lucide-react";

const tenets = [
  {
    title: "The Triune God",
    description: "We believe that the one and only God is Spirit, self-existing, infinite, personal, immutable and eternal in His being. We believe in His perfect holiness, love, justice, goodness, wisdom and truth, omnipotence, Omniscience, and Omnipresence. We believe that God is the Creator and sustainer of the universe, and that He is eternally existent in three persons, one in substance and co-equal in power and glory—Father, Son and Holy Spirit.",
    num: "1"
  },
  {
    title: "The Bible",
    description: "We believe that the Bible, consisting of the sixty-six books of both old and new testaments, given by divine inspiration, is inherent in its original manuscripts and is the final authority in matters pertaining to faith and conduct. We accept the right and duty of personal judgment, under the illumination of the Holy Spirit, in the interpretation of the Holy Scripture. II Timothy 3:16, I Peter 1:25, II Peter 1: 21.",
    num: "2"
  },
  {
    title: "Man",
    description: "We believe that man was created in the image of God but fell into sin and therefore was lost and only through regeneration by the Holy Spirit can salvation and Spiritual life be obtained. Genesis 1:27, Acts 4: 12, Romans 3: 23.",
    num: "3"
  },
  {
    title: "Jesus Christ and the Work of Salvation",
    description: "We believe in Jesus as the only begotten Son of God, He is fully God and Man. We believe in the truth of His teachings and the perfect sacrifice for the sin of the world, which He offered once and for all in His death and His ascension, His intercession and His second coming in power and glory. John 1: 18, Titus 2:13, Hebrews 4:15.",
    num: "4"
  },
  {
    title: "The Holy Spirit",
    description: "We believe in the Holy Spirit as the Third Person of the God-Head. And that through His illumination, conviction and regeneration, men are brought to repentance and faith in Jesus Christ; His continuing work of sanctification in the lives of believers, and their divine preservation unto eternal; His enabling of the believer to speak in other tongues and manifest the divine gifts of the Holy spirit. Acts 1:8, 2:1-4, Romans 10: 9-10, I Corinthians 12: 1-11, Galatians 2:20, Ephesians 4, I Thessalonians 5: 24, II Thessalonians 2:13.",
    num: "5"
  },
  {
    title: "The Church",
    description: "We believe in the universal church as a body composed of all believers in the Lord Jesus Christ who have been called out from the world, separated from sin and vitally united by faith to Christ, Her Head and Sovereign Lord. We also believe in the local church as an organized body of believers who are joined together, and who meet at regular times for teaching of the word, fellowship of the saints, observation of the ordinances of baptism and holy communion, administration of discipline and love, prayer, participation in public worship and world-wide evangelism and in the divinely given ministries of apostles, prophets, evangelists, pastors, teachers as well as the manifestation of various other ministries as contained in Act 6:1-6, Romans 12: 6-8, Ephesians 4: 11-13.",
    num: "6"
  },
  {
    title: "The Last Things",
    description: "We believe in the physical second coming of Christ, which is the hope of the church, the source of her encouragement, consolation and up-building for purification, holiness and inspiration for activity and service; the resurrection of the body and the final judgment of all of men, the eternal perfection and blessedness of the saved and the eternal punishment of the lost ones. John 14:3-10, I Thessalonians 4:13-18, Hebrews 12: 5-8, Rev 21:7, 22:7.",
    num: "7"
  }
];

export default function OurFaithPage() {
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
              href={item === "Home" ? "/" : item === "Our Faith" ? "/our-faith" : item === "Partners" ? "/partners" : "#"}
              className={`px-4 lg:px-6 py-2 text-sm font-medium transition-all duration-300 rounded-full ${item === "Our Faith" ? "bg-[#e8f0e8] text-[#1a3d2e]" : "text-gray-600 hover:text-[#1a3d2e]"}`}
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
                  href={item === "Home" ? "/" : item === "Our Faith" ? "/our-faith" : item === "Partners" ? "/partners" : "#"}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg ${item === "Our Faith" ? "bg-[#e8f0e8] text-[#1a3d2e]" : "text-gray-600 hover:text-[#1a3d2e] hover:bg-gray-50"}`}
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
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/of.jpg" alt="Our Faith" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a3d2e]/90 via-[#1a3d2e]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-6 mx-auto">
            <span className="w-2 h-2 rounded-full bg-[#4ade80]" />
            <span className="text-xs font-bold tracking-wider text-white uppercase">Statement of Faith</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
            Our <span className="text-[#4ade80]">Faith</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            &quot;Go into all the world and preach the gospel to all creation.&quot;
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F5F5F5] to-transparent" />
      </section>

      {/* --- FAITH CONTENT SECTION --- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F5F5F5]">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {tenets.map((tenet, index) => (
              <div 
                key={tenet.title} 
                className="bg-white rounded-3xl p-8 md:p-12 shadow-sm hover:shadow-xl transition-all duration-500 border border-transparent hover:border-[#1a3d2e]/10 group"
              >
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-[#e8f0e8] rounded-2xl flex items-center justify-center text-2xl font-bold text-[#1a3d2e] group-hover:scale-110 group-hover:bg-[#1a3d2e] group-hover:text-white transition-all duration-300">
                      {tenet.num}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{tenet.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {tenet.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1a3d2e] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4ade80]/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4ade80]/10 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <BookOpen className="w-16 h-16 text-[#4ade80] mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Join Us in Our Mission
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
                  { label: "Our Projects", href: "#" },
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
                  { label: "Medical Outreaches", href: "/#touching-lives" },
                  { label: "Student Support", href: "/#touching-lives" },
                  { label: "Back to School", href: "/#touching-lives" },
                  { label: "Homes for Widows", href: "/#touching-lives" },
                  { label: "Bible Donation", href: "/#touching-lives" }
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
                <li><a href="mailto:info@8thmileproject.org" className="hover:text-white transition-colors">info@8thmileproject.org</a></li>
                <li><a href="tel:+2347039550499" className="hover:text-white transition-colors">+234 703 955 0499</a></li>
                <li>Kaduna, Nigeria</li>
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
