import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0f261c] py-16 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
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

          {/* Quick Links */}
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

          {/* Programs */}
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

          {/* Contact */}
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
  );
}
