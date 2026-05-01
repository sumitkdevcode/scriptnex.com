import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Hero Section */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.png"
          alt="ScriptNex Hero"
          fill
          className="object-cover opacity-30 blur-[2px]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold gradient-text">ScriptNex</div>
          <div className="hidden md:flex space-x-8 text-sm font-medium">
            <a href="#" className="hover:text-primary transition-colors">Platform</a>
            <a href="#" className="hover:text-primary transition-colors">Solutions</a>
            <a href="#" className="hover:text-primary transition-colors">Pricing</a>
            <a href="#" className="hover:text-primary transition-colors">Docs</a>
          </div>
          <button className="px-6 py-2 rounded-full bg-primary text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/20">
            Get Started
          </button>
        </div>
      </nav>

      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20 text-center">
        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
          Automate Your <br />
          <span className="gradient-text">Workflow Reality</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          The next-generation scripting platform for developers who demand speed, 
          security, and absolute control.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-20">
          <button className="px-8 py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-slate-100 transition-all">
            Start Building Free
          </button>
          <button className="px-8 py-4 rounded-xl glass text-white font-bold text-lg hover:bg-white/10 transition-all">
            Watch Demo
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {[
            {
              title: "Lightning Fast",
              desc: "Optimized runtime for scripts that execute in milliseconds, not seconds.",
              icon: "⚡"
            },
            {
              title: "Enterprise Security",
              desc: "Bank-grade encryption and sandboxed environments for every execution.",
              icon: "🛡️"
            },
            {
              title: "Global Scale",
              desc: "Deploy scripts globally with edge-ready architecture out of the box.",
              icon: "🌐"
            }
          ].map((feature, i) => (
            <div key={i} className="glass p-8 rounded-3xl text-left hover:-translate-y-2 transition-all duration-300 group">
              <div className="text-4xl mb-4 group-hover:animate-float">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-border">
        <div className="container mx-auto px-6 text-center text-slate-500">
          <p>© 2026 ScriptNex Inc. Built for the future of development.</p>
        </div>
      </footer>
    </main>
  );
}
