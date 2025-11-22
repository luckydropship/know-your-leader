import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <header className="text-center mb-12 pt-8">
          <div className="inline-block mb-6">
            <div className="text-8xl mb-4 animate-bounce">🇺🇸</div>
          </div>
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-white mb-4 drop-shadow-2xl tracking-tight">
            Know Your Leaders
          </h1>
          <div className="h-2 w-32 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full mb-6"></div>
          <p className="text-2xl sm:text-3xl md:text-4xl text-blue-100 font-bold mb-3">
            Democracy Through Transparency
          </p>
          <p className="text-lg sm:text-xl text-purple-200 max-w-2xl mx-auto">
            Empowering citizens with real-time campaign finance data and legislative tracking
          </p>
        </header>

        {/* Mission Statement - Glassmorphism Card */}
        <div className="mb-12">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/20">
            <div className="flex items-center justify-center mb-6">
              <div className="h-1 w-12 bg-yellow-400 rounded-full"></div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mx-4">Our Mission</h2>
              <div className="h-1 w-12 bg-yellow-400 rounded-full"></div>
            </div>
            <div className="space-y-4 text-lg text-white/90 leading-relaxed max-w-4xl mx-auto">
              <p className="text-center">
                <strong className="text-yellow-300">Democracy thrives on informed citizens.</strong> We provide comprehensive, 
                accurate, and accessible information about the people who represent you and those who seek to lead our nation.
              </p>
              <p className="text-center">
                From <span className="text-blue-300 font-semibold">presidential candidates</span> to your <span className="text-green-300 font-semibold">local congressional representatives</span>, 
                we believe transparency and knowledge are the cornerstones of a healthy democracy.
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mt-6 border border-white/10">
                <p className="text-center text-sm text-white/80">
                  📊 Official data from <strong>Congress.gov</strong> and the <strong>Federal Election Commission</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Presidential Candidates Card */}
          <Link href="/presidential-candidates" className="block">
            <div className="group relative bg-gradient-to-br from-red-500 to-pink-600 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 cursor-pointer overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative z-10">
                <div className="text-7xl mb-6 transform group-hover:scale-110 transition-transform duration-500">🎯</div>
                <h3 className="text-4xl font-black text-white mb-4 group-hover:text-yellow-300 transition-colors">
                  Presidential Candidates
                </h3>
                <p className="text-white/90 text-lg mb-6 leading-relaxed">
                  Explore detailed profiles, campaign finance data, voting records, and policy positions. 
                  Follow the money and understand who&apos;s running for the highest office.
                </p>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-white">
                      📊 Live Data
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-white">
                      💰 Finance Tracking
                    </div>
                  </div>
                  <div className="text-white text-2xl group-hover:translate-x-2 transition-transform">→</div>
                </div>
              </div>
            </div>
          </Link>

          {/* Congress Members Card */}
          <Link href="/congress" className="block">
            <div className="group relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 cursor-pointer overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative z-10">
                <div className="text-7xl mb-6 transform group-hover:scale-110 transition-transform duration-500">🏛️</div>
                <h3 className="text-4xl font-black text-white mb-4 group-hover:text-yellow-300 transition-colors">
                  Congress Members
                </h3>
                <p className="text-white/90 text-lg mb-6 leading-relaxed">
                  Discover your senators and representatives. Track voting records, committee assignments, 
                  sponsored legislation, and see how they represent you.
                </p>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-white">
                      🗳️ Voting Records
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-white">
                      📋 Legislation
                    </div>
                  </div>
                  <div className="text-white text-2xl group-hover:translate-x-2 transition-transform">→</div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl mb-12">
          <h2 className="text-4xl sm:text-5xl font-black text-white text-center mb-12">
            Transparency Tools
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                icon: '📊', 
                title: 'Voting Records', 
                desc: 'Complete transparency on legislative votes',
                color: 'from-blue-500 to-cyan-500'
              },
              { 
                icon: '💰', 
                title: 'Campaign Finance', 
                desc: 'Follow the money with detailed contribution data',
                color: 'from-green-500 to-emerald-500'
              },
              { 
                icon: '📋', 
                title: 'Committee Roles', 
                desc: 'Track committee assignments and responsibilities',
                color: 'from-purple-500 to-pink-500'
              },
              { 
                icon: '📜', 
                title: 'Legislation', 
                desc: 'Monitor bills and sponsored legislation',
                color: 'from-orange-500 to-red-500'
              },
              { 
                icon: '👤', 
                title: 'Biographies', 
                desc: 'Learn about backgrounds and experience',
                color: 'from-indigo-500 to-purple-500'
              },
              { 
                icon: '🔍', 
                title: 'Official Data', 
                desc: 'Verified government database information',
                color: 'from-teal-500 to-cyan-500'
              }
            ].map((feature, idx) => (
              <div 
                key={idx} 
                className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/10 cursor-pointer"
              >
                <div className={`inline-block p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <div className="text-4xl">{feature.icon}</div>
                </div>
                <h4 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors">
                  {feature.title}
                </h4>
                <p className="text-white/80 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-8 sm:p-12 text-center shadow-2xl mb-12 transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            Every Vote Matters
          </h2>
          <p className="text-xl text-gray-800 mb-8 max-w-2xl mx-auto">
            Make informed decisions with real-time data and comprehensive analysis
          </p>
          <Link 
            href="/presidential-candidates"
            className="inline-block bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-110"
          >
            Explore Candidates Now →
          </Link>
        </div>

        {/* Footer */}
        <footer className="text-center text-white/80 py-8 border-t border-white/10">
          <p className="text-2xl font-bold mb-2 text-white">Know Your Leaders</p>
          <p className="text-white/60 mb-1">A project dedicated to democratic transparency</p>
          <p className="text-sm text-white/50 mt-4">
            Data sourced from Congress.gov, FEC, and official government databases
          </p>
        </footer>
      </div>
    </div>
  );
}