export default function OurFaithSection() {
    return (
        <section id="our-faith" className="py-24 px-8 md:px-16 lg:px-24 bg-white overflow-hidden relative">
            {/* Decorative leaf background element */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-[#e8f0e8] rounded-full blur-3xl opacity-50 -z-10" />

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left - Visual Content */}
                    <div className="relative group animate-in fade-in slide-in-from-left-8 duration-1000">
                        <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden bg-[#1a3d2e] p-12 flex flex-col justify-center border border-brand-accent shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]">
                            <div className="mb-8 w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl">
                                ✝️
                            </div>
                            <h3 className="text-4xl font-bold text-white mb-6 uppercase tracking-tight">Our <span className="text-brand-sage">Faith</span></h3>
                            <div className="space-y-4">
                                <div className="h-1 w-20 bg-brand-sage rounded-full" />
                                <p className="text-brand-accent/80 text-lg font-medium italic">
                                    &quot;Go into all the world and preach the gospel to all creation.&quot;
                                </p>
                            </div>

                            {/* Subtle texture or pattern could go here */}
                            <div className="absolute bottom-0 right-0 p-8 text-6xl opacity-10 font-bold select-none">
                                FAITH
                            </div>
                        </div>
                    </div>

                    {/* Right - Text Content */}
                    <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
                        <div>
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a3d2e]/10 rounded-full text-[#1a3d2e] text-xs font-bold tracking-wider uppercase mb-6">
                                Statement of Faith
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
                                What We Believe
                            </h2>
                        </div>

                        <div className="space-y-10">
                            {/* The Triune God */}
                            <div className="group transition-all duration-300 hover:translate-x-2">
                                <h3 className="text-2xl font-bold text-[#1a3d2e] mb-4 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-[#e8f0e8] flex items-center justify-center text-sm">1</span>
                                    The Triune God
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    We believe that the one and only God is Spirit, self-existing, infinite, personal,
                                    immutable and eternal in His being. We believe in His perfect holiness, love, justice,
                                    goodness, wisdom and truth, omnipotence, Omniscience, and Omnipresence. We believe
                                    that God is the Creator and sustainer of the universe, and that He is eternally
                                    existent in three persons, one in substance and co-equal in power and glory—Father,
                                    Son and Holy Spirit.
                                </p>
                            </div>

                            {/* The Bible */}
                            <div className="group transition-all duration-300 hover:translate-x-2">
                                <h3 className="text-2xl font-bold text-[#1a3d2e] mb-4 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-[#e8f0e8] flex items-center justify-center text-sm">2</span>
                                    The Bible
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    We believe that the Bible, consisting of the sixty-six books of both old and new testaments,
                                    given by divine inspiration, is inherent in its original manuscripts and is the final
                                    authority in matters pertaining to faith and conduct. We accept the right and duty
                                    of personal judgment, under the illumination of the Holy Spirit, in the interpretation
                                    of the Holy Scripture. II Timothy 3:16, I Peter 1:25, II Peter 1: 21.
                                </p>
                            </div>
                        </div>

                        <div className="pt-4">
                            <a
                                href="https://8thmileproject.org/our-faith"
                                target="_blank"
                                className="inline-flex items-center gap-2 text-[#2d5a3d] font-bold text-lg hover:gap-4 transition-all duration-300 group"
                            >
                                Read our full Statement of Faith
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12,5 19,12 12,19" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
