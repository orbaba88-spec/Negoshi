export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAFAF7]">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 h-16 bg-[#FAFAF7]/90 backdrop-blur border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1A9E6E] flex items-center justify-center text-white font-black text-sm">N</div>
          <span className="font-black text-xl text-gray-900">Negoshi</span>
        </div>
        <div className="flex items-center gap-8">
          <a href="#deals" className="text-sm font-medium text-gray-600 hover:text-[#1A9E6E]">Deals</a>
          <a href="#how" className="text-sm font-medium text-gray-600 hover:text-[#1A9E6E]">How it works</a>
          <a href="#community" className="text-sm font-medium text-gray-600 hover:text-[#1A9E6E]">Community</a>
          <a href="#community" className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-[#1A9E6E] transition">Join free</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-10 pt-36 pb-20">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-[#E8F8F2] border border-[#C5EDD9] text-[#1A9E6E] rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1A9E6E] animate-pulse"></span>
            Updated daily · Australia-wide
          </div>
          <h1 className="text-6xl font-black text-gray-900 leading-tight tracking-tight mb-5">
            Real deals.<br />
            <span className="text-[#1A9E6E]">No BS.</span><br />
            Just savings.
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-xl">
            We cut through the noise and find the best mobile and internet plans in Australia. No paid placements. No dodgy fine print. Just honest picks — and the more of us, the better we negotiate.
          </p>
          <div className="flex items-center gap-4">
            <a href="#deals" className="bg-[#1A9E6E] text-white px-8 py-4 rounded-full font-bold text-base hover:shadow-lg transition">See today&apos;s deals</a>
            <a href="#community" className="border border-gray-200 text-gray-900 px-7 py-4 rounded-full font-semibold text-base hover:border-gray-400 transition">Join the community</a>
          </div>
          <div className="flex items-center gap-3 mt-8">
            <div className="flex">
              {["JR","TL","SA","ML"].map((i) => (
                <div key={i} className="w-7 h-7 rounded-full bg-[#1A9E6E] border-2 border-[#FAFAF7] flex items-center justify-center text-white text-xs font-bold -mr-2">{i}</div>
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-3">Joined by <strong className="text-gray-900">2,400+</strong> Australians this month</span>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="bg-white border-y border-gray-200 py-5 px-10 flex items-center justify-center gap-16 flex-wrap">
        {[
          { icon: "✅", text: "No paid placements — ever" },
          { icon: "🔄", text: "Updated every day" },
          { icon: "🤝", text: "Collective buying power" },
          { icon: "📧", text: "Deals delivered to your inbox" },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-3 text-sm font-semibold text-gray-600">
            <span>{item.icon}</span>
            {item.text}
          </div>
        ))}
      </div>

      {/* DEALS */}
      <section id="deals" className="max-w-6xl mx-auto px-10 py-20">
        <p className="text-xs font-bold tracking-widest text-[#1A9E6E] uppercase mb-3">Current deals</p>
        <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-3">Today&apos;s best picks</h2>
        <p className="text-gray-500 mb-10">Hand-picked. Verified. Updated daily. These are the plans we&apos;d actually tell our mates to get.</p>
        <div className="grid grid-cols-3 gap-5">
          {[
            { carrier: "ALB", name: "Aldimobile", type: "Mobile · 28-day", price: "15", color: "#FF6600", badge: "Negoshi Pick", specs: ["20GB data", "Unlimited calls & SMS", "Telstra network", "No lock-in contract"] },
            { carrier: "OPT", name: "Optus", type: "Mobile · Monthly", price: "29", color: "#FF0000", badge: "Hot deal", specs: ["40GB data", "Unlimited calls & SMS", "5G included", "No contract"] },
            { carrier: "TPG", name: "TPG", type: "Internet · NBN 100", price: "59", color: "#0000CC", badge: "", specs: ["NBN 100/20 Mbps", "Unlimited data", "Free modem included", "No contract"] },
          ].map((deal) => (
            <div key={deal.name} className={`bg-[#FAFAF7] border-2 rounded-2xl p-6 hover:border-[#1A9E6E] hover:-translate-y-1 transition cursor-pointer relative ${deal.badge === "Negoshi Pick" ? "border-[#1A9E6E] bg-[#E8F8F2]" : "border-gray-200"}`}>
              {deal.badge && (
                <span className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full ${deal.badge === "Negoshi Pick" ? "bg-[#1A9E6E] text-white" : "bg-[#F06A2A] text-white"}`}>{deal.badge}</span>
              )}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xs font-black" style={{ background: deal.color }}>{deal.carrier}</div>
                <div>
                  <div className="font-black text-gray-900">{deal.name}</div>
                  <div className="text-xs text-gray-500">{deal.type}</div>
                </div>
              </div>
              <div className="text-4xl font-black text-gray-900 mb-4">${deal.price}<span className="text-sm font-medium text-gray-400">/mo</span></div>
              <div className="space-y-2 mb-5">
                {deal.specs.map(s => (
                  <div key={s} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-[#1A9E6E]">●</span>{s}
                  </div>
                ))}
              </div>
              <button className={`w-full py-3 rounded-xl text-sm font-bold transition ${deal.badge === "Negoshi Pick" ? "bg-[#1A9E6E] text-white hover:bg-gray-900" : "bg-gray-900 text-white hover:bg-[#1A9E6E]"}`}>Get this deal →</button>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-10">
          <p className="text-xs font-bold tracking-widest text-[#1A9E6E] uppercase mb-3">How it works</p>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-3">Simple. Honest.<br />Built for you.</h2>
          <p className="text-gray-500 mb-12 max-w-lg">No algorithm pushing the most profitable deal to the top. We do the research, you save the money.</p>
          <div className="grid grid-cols-3 gap-6">
            {[
              { num: "01", title: "We find the best deals", desc: "Our team researches and hand-picks the genuinely best mobile and internet plans in Australia. If it's not good, we don't show it." },
              { num: "02", title: "You browse with confidence", desc: "Every deal on Negoshi is there on its own merit. No sponsored spots, no hidden affiliate games. What you see is what we actually recommend." },
              { num: "03", title: "Together we negotiate better", desc: "The bigger our community grows, the more leverage we have to unlock exclusive deals that aren't available anywhere else." },
            ].map((step) => (
              <div key={step.num} className="bg-[#FAFAF7] border border-gray-200 rounded-2xl p-8 hover:-translate-y-1 hover:shadow-lg transition">
                <div className="text-5xl font-black text-[#C5EDD9] mb-5">{step.num}</div>
                <h3 className="font-black text-gray-900 text-lg mb-3">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section id="community" className="bg-gray-900 py-24 px-10 text-center relative overflow-hidden">
        <div className="max-w-xl mx-auto relative">
          <div className="inline-flex items-center gap-2 bg-[#1A9E6E]/20 border border-[#1A9E6E]/40 text-[#5ECDA3] rounded-full px-4 py-1.5 text-sm font-semibold mb-7">
            🤝 Join the Negoshi community
          </div>
          <h2 className="text-5xl font-black text-white leading-tight tracking-tight mb-5">
            More of us.<br /><span className="text-[#5ECDA3]">Better deals.</span>
          </h2>
          <p className="text-white/60 text-lg leading-relaxed mb-10">Sign up free and get the best Australian mobile and internet deals delivered to your inbox. No noise, no BS — just the good stuff.</p>
          <div className="flex gap-3 max-w-md mx-auto mb-4">
            <input type="email" placeholder="your@email.com" className="flex-1 bg-white/10 border border-white/20 rounded-full px-5 py-4 text-white placeholder-white/30 text-sm outline-none focus:border-[#5ECDA3]" />
            <button className="bg-[#1A9E6E] text-white px-7 py-4 rounded-full font-bold text-sm hover:-translate-y-0.5 transition whitespace-nowrap">Join free →</button>
          </div>
          <p className="text-white/30 text-xs">Free forever. Unsubscribe any time. We hate spam too.</p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="flex">
              {["JR","TL","SA","ML","PK"].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-[#1A9E6E] border-2 border-gray-900 flex items-center justify-center text-white text-xs font-bold -mr-2">{i}</div>
              ))}
            </div>
            <span className="text-white/50 text-sm ml-3"><strong className="text-white">2,400+ Australians</strong> already in the community</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 px-10 py-8 flex items-center justify-between flex-wrap gap-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#1A9E6E] flex items-center justify-center text-white font-black text-xs">N</div>
          <span className="font-black text-gray-900">Negoshi</span>
        </div>
        <div className="flex gap-7">
          {["About","How it works","Privacy","Contact"].map(l => (
            <a key={l} href="#" className="text-sm text-gray-400 hover:text-[#1A9E6E]">{l}</a>
          ))}
        </div>
        <p className="text-xs text-gray-400">© 2026 Negoshi. Built for Australians, by Australians.</p>
      </footer>
    </main>
  );
}