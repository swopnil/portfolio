import React, { useState, useEffect } from 'react';
import { ChevronRight, Code, Database, Shield, Zap, Users, Rocket, Star, Award, Heart, Terminal, Bug, Lock, Scan, Building, Lightbulb } from 'lucide-react';

const VertexJourney = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isRocketAnimating, setIsRocketAnimating] = useState(false);
  const [showRocket, setShowRocket] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const vertexColors = {
    primary: '#00447C',
    secondary: '#0072CE', 
    accent: '#00B4D8',
    light: '#F8FCFF',
    dark: '#002A4D'
  };

  const slides = [
    {
      id: 'intro',
      title: "Welcome to My Vertex Journey",
      subtitle: "From Campus Discovery to Full-Stack Developer",
      content: (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20 max-w-4xl w-full mx-4">
            <div className="text-center mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                <span className="text-4xl font-bold text-white">SP</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">A Brief Personal Introduction</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500">
                  <p className="text-xl"><strong className="text-blue-700">Name:</strong> Swopnil Panday</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500">
                  <p className="text-xl"><strong className="text-blue-700">College:</strong> Rising Senior at Villanova</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500">
                  <p className="text-xl"><strong className="text-blue-700">Major:</strong> CS, Math (Minor)</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl">
                  <h4 className="text-lg font-bold text-green-800 mb-3">🌟 How I Found Vertex</h4>
                  <p className="text-gray-700">Came to know about Vertex Inc as it was nearby campus and through our strong alumni network.</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                  <h4 className="text-lg font-bold text-purple-800 mb-3">💻 My Passion</h4>
                  <p className="text-gray-700">Really into software development since young age - Python, JS, and building small solutions for small organizations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      buttonText: "🚀 Start My Vertex Journey",
      buttonStyle: "rocket-launch"
    },
    {
      id: 'teams',
      title: "Certificate Center Mission",
      subtitle: "Three Elite Squads, One Powerful Mission",
      content: (
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="max-w-6xl w-full mx-4">
            <div className="bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20 mb-8">
              <div className="text-center mb-8">
                <Building className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Manager: Rhonda Shaw</h3>
                <p className="text-xl text-gray-700">Our mission: Manage tax exemption certificates for customers with nonprofit or exemption status</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="group bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-8 transform hover:scale-105 transition-all duration-300 shadow-xl border-2 border-purple-300">
                <div className="text-center">
                  <Users className="w-16 h-16 text-purple-600 mx-auto mb-4 group-hover:animate-pulse" />
                  <h3 className="text-2xl font-bold text-purple-800 mb-3">🌙 Night Watch</h3>
                  <p className="text-purple-700 text-lg">Vigilant guardians of the night shift</p>
                </div>
              </div>
              
              <div className="group bg-gradient-to-br from-red-100 to-red-200 rounded-2xl p-8 transform hover:scale-105 transition-all duration-300 shadow-xl border-4 border-red-400">
                <div className="text-center">
                  <Shield className="w-16 h-16 text-red-600 mx-auto mb-4 group-hover:animate-pulse" />
                  <h3 className="text-2xl font-bold text-red-800 mb-3">🐉 Dragon Keepers</h3>
                  <p className="text-red-700 text-lg">My starting team - Elite certificate protectors</p>
                </div>
              </div>
              
              <div className="group bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 transform hover:scale-105 transition-all duration-300 shadow-xl border-2 border-blue-300">
                <div className="text-center">
                  <Zap className="w-16 h-16 text-blue-600 mx-auto mb-4 group-hover:animate-pulse" />
                  <h3 className="text-2xl font-bold text-blue-800 mb-3">⚡ Delta Force</h3>
                  <p className="text-blue-700 text-lg">Rapid deployment specialists</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-2xl border-2 border-yellow-300">
              <p className="text-xl text-center text-yellow-800">
                <strong>🚀 My Multi-team Journey:</strong> Started with Dragon Keepers, then joined Night Watch for downtime work - gaining immense full-stack experience across multiple teams!
              </p>
            </div>
          </div>
        </div>
      ),
      buttonText: "🔥 Let's Start Coding for Cert Center",
      buttonStyle: "rocket-launch"
    },
    {
      id: 'dashboard',
      title: "DataDog Dashboard Mission",
      subtitle: "Building Developer-Friendly API Monitoring",
      content: (
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="max-w-6xl w-full mx-4">
            <div className="bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20 mb-8">
              <div className="text-center mb-8">
                <Database className="w-20 h-20 text-blue-600 mx-auto mb-6 animate-pulse" />
                <h3 className="text-3xl font-bold text-gray-800 mb-4">🎯 Developer Convenience Dashboard</h3>
                <p className="text-xl text-gray-700 mb-4"><strong>Mentor:</strong> Matthew Dickens</p>
                <p className="text-lg text-gray-600">Built alongside another intern to display Cert Center API endpoints data especially for developers convenience</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl p-8 shadow-xl border-2 border-green-300">
                <div className="text-center mb-4">
                  <Database className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h4 className="text-2xl font-bold text-green-800 mb-4">Key Metrics Tracked</h4>
                </div>
                <ul className="space-y-3 text-green-700">
                  <li className="flex items-center"><span className="text-2xl mr-3">📊</span>P95 & P99 Performance</li>
                  <li className="flex items-center"><span className="text-2xl mr-3">📈</span>SQL Line Graph Analysis</li>
                  <li className="flex items-center"><span className="text-2xl mr-3">🔢</span>Request Count Monitoring</li>
                  <li className="flex items-center"><span className="text-2xl mr-3">⚠️</span>Error Rate Tracking</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-purple-100 to-pink-200 rounded-2xl p-8 shadow-xl border-2 border-purple-300">
                <div className="text-center mb-4">
                  <Shield className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                  <h4 className="text-2xl font-bold text-purple-800 mb-4">Advanced Features</h4>
                </div>
                <ul className="space-y-3 text-purple-700">
                  <li className="flex items-center"><span className="text-2xl mr-3">🎯</span>SLO Implementation</li>
                  <li className="flex items-center"><span className="text-2xl mr-3">📱</span>Real-time Monitoring</li>
                  <li className="flex items-center"><span className="text-2xl mr-3">🚨</span>Alert Systems</li>
                  <li className="flex items-center"><span className="text-2xl mr-3">📋</span>Developer Experience Focus</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-2xl border-2 border-yellow-300">
              <p className="text-xl text-center text-yellow-800">
                <strong>💡 Key Learning:</strong> Understanding the critical importance of performance metrics in development environments and how monitoring shapes better software!
              </p>
            </div>

            <div className="mt-8 bg-gray-100 border-2 border-dashed border-gray-300 p-6 rounded-xl">
              <p className="text-center text-gray-600 italic text-lg">
                📸 Dashboard screenshots and monitoring visuals will be displayed here
              </p>
            </div>
          </div>
        </div>
      ),
      buttonText: "📊 Submit the Dashboard",
      buttonStyle: "rocket-launch"
    },
    {
      id: 'terraform',
      title: "Not Yet! Terraform Evolution",
      subtitle: "Infrastructure as Code Migration",
      content: (
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="max-w-6xl w-full mx-4">
            <div className="bg-gradient-to-br from-red-100 to-red-200 border-4 border-red-400 rounded-3xl p-12 shadow-2xl mb-8">
              <div className="text-center">
                <div className="text-6xl mb-4">🚫</div>
                <h3 className="text-4xl font-bold text-red-700 mb-4">Hold Up!</h3>
                <p className="text-2xl text-red-600">The dashboard needed to evolve into proper infrastructure!</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20 mb-8">
              <div className="text-center mb-8">
                <Building className="w-20 h-20 text-blue-600 mx-auto mb-6 animate-bounce" />
                <h3 className="text-3xl font-bold text-gray-800 mb-4">🏗️ Terraform Migration Mission</h3>
                <p className="text-xl text-gray-600">We had to take the dashboard to Terraform - moved monitors and SLOs to Terraform for proper infrastructure management</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-blue-100 to-cyan-200 rounded-2xl p-8 shadow-xl border-2 border-blue-300">
                  <div className="text-center mb-4">
                    <Code className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h4 className="text-2xl font-bold text-blue-800 mb-4">Infrastructure as Code</h4>
                  </div>
                  <ul className="space-y-3 text-blue-700">
                    <li className="flex items-center"><span className="text-2xl mr-3">🔧</span>Terraform Implementation</li>
                    <li className="flex items-center"><span className="text-2xl mr-3">📊</span>Monitor Migration</li>
                    <li className="flex items-center"><span className="text-2xl mr-3">🎯</span>SLO Configuration</li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl p-8 shadow-xl border-2 border-green-300">
                  <div className="text-center mb-4">
                    <Star className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h4 className="text-2xl font-bold text-green-800 mb-4">Benefits Achieved</h4>
                  </div>
                  <ul className="space-y-3 text-green-700">
                    <li className="flex items-center"><span className="text-2xl mr-3">🚀</span>Easy Future Maintenance</li>
                    <li className="flex items-center"><span className="text-2xl mr-3">🏗️</span>Scalable Infrastructure</li>
                    <li className="flex items-center"><span className="text-2xl mr-3">📈</span>Build Foundation</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-2xl border-2 border-yellow-300">
              <p className="text-xl text-center text-yellow-800">
                <strong>🎯 Mission:</strong> Observability infrastructure for easy future maintenance and building upon it!
              </p>
            </div>
          </div>
        </div>
      ),
      buttonText: "✅ Submit the Dashboard Now",
      buttonStyle: "rocket-launch"
    },
    {
      id: 'springboot',
      title: "Spring Into Action!",
      subtitle: "First Spring Boot Adventure & Form Wizard Fix",
      content: (
        <div className="space-y-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">🌱 Spring Boot Backend Challenge</h3>
            <p className="text-lg mb-6">Night Watch mission: Fix form issues in Cert Center wizard</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-100 to-lime-100 rounded-xl p-6">
              <Code className="w-10 h-10 text-green-600 mb-3" />
              <h4 className="text-lg font-bold text-green-800">The Learning Journey</h4>
              <ul className="text-left space-y-2 text-green-700">
                <li>❓ Asked countless questions</li>
                <li>🧠 Deep Spring Boot learning</li>
                <li>🤝 Connected with team members</li>
                <li>📚 One ticket = massive knowledge</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl p-6">
              <Shield className="w-10 h-10 text-blue-600 mb-3" />
              <h4 className="text-lg font-bold text-blue-800">New Skills Unlocked</h4>
              <ul className="text-left space-y-2 text-blue-700">
                <li>🧪 Test Case Writing</li>
                <li>🔍 Understanding Importance</li>
                <li>🚀 Backend Development</li>
                <li>👥 Team Collaboration</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg">
            <p className="text-lg"><strong>💡 Revelation:</strong> Test cases are crucial in development - something I hadn't prioritized before!</p>
          </div>
        </div>
      ),
      buttonText: "🔧 Submit My First PR"
    },
    {
      id: 'npe-bug',
      title: "💥 Hit My First NPE",
      subtitle: "The Bug That Taught Everything",
      content: (
        <div className="space-y-6">
          <div className="bg-red-100 border-2 border-red-300 rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-red-700 mb-4">🐛 The NullPointerException Chronicles</h3>
            <p className="text-lg text-red-600 mb-4">There wouldn't be a ticket that teaches you so much, and this one did!</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-6">🔍 The Debug Journey</h3>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <span className="text-3xl mb-2 block">🔍</span>
                <h4 className="font-bold text-red-800">Found It Myself</h4>
                <p className="text-sm text-red-600">Self-discovery mode</p>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <span className="text-3xl mb-2 block">💭</span>
                <h4 className="font-bold text-yellow-800">Took Ownership</h4>
                <p className="text-sm text-yellow-600">Realized the mistake</p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <span className="text-3xl mb-2 block">🔧</span>
                <h4 className="font-bold text-green-800">Fixed It</h4>
                <p className="text-sm text-green-600">Problem solved!</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-xl">
              <h4 className="text-lg font-bold text-purple-800 mb-3">🎯 The Ultimate Lesson</h4>
              <p className="text-lg text-purple-700">
                <strong>Understanding everything thoroughly is crucial for delivering perfect results.</strong>
              </p>
            </div>
          </div>
        </div>
      ),
      buttonText: "🙏 Submit My First PR (with prayer emoji)"
    },
    {
      id: 'success',
      title: "🎉 It Worked!",
      subtitle: "Security Champion Mode Activated",
      content: (
        <div className="space-y-6">
          <div className="bg-green-100 border-2 border-green-300 rounded-2xl p-6 text-center">
            <h3 className="text-3xl font-bold text-green-700 mb-4">✅ SUCCESS!</h3>
            <p className="text-xl text-green-600">First PR merged successfully!</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-6">🛡️ Security Vulnerabilities Mission</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-xl p-6">
                <Shield className="w-10 h-10 text-red-600 mb-3" />
                <h4 className="text-lg font-bold text-red-800">Security Fixes</h4>
                <ul className="text-left space-y-2 text-red-700 mt-3">
                  <li>🔍 Identified vulnerabilities</li>
                  <li>🔧 Implemented solutions</li>
                  <li>🧪 Thoroughly tested fixes</li>
                  <li>✅ Quality assurance</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl p-6">
                <Database className="w-10 h-10 text-blue-600 mb-3" />
                <h4 className="text-lg font-bold text-blue-800">Repository Mastery</h4>
                <ul className="text-left space-y-2 text-blue-700 mt-3">
                  <li>📚 Explored multiple repos</li>
                  <li>🎯 Understood contributions</li>
                  <li>🔗 Mapped dependencies</li>
                  <li>🌐 Big picture thinking</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      buttonText: "🔥 Get Things Serious"
    },
    {
      id: 'ocr',
      title: "🤖 One of a Kind: OCR Project",
      subtitle: "AI-Powered Innovation from Scratch",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-purple-700 mb-4">🚀 Crucial Phase: OCR Revolution</h3>
            <p className="text-lg text-purple-600">One-of-a-kind project at Vertex - bringing AI benefits to customers, built from scratch!</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-6">📚 The Learning Intensive</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-bold text-blue-800 mb-2">🎯 Deep Involvement</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Attended every meeting</li>
                    <li>• Watched work distribution</li>
                    <li>• Observed execution strategies</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-bold text-green-800 mb-2">📖 Research & Learning</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Extensive reading & research</li>
                    <li>• Devoted genuine interest</li>
                    <li>• Read every PR thoroughly</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl p-6">
                <Star className="w-10 h-10 text-orange-600 mb-3" />
                <h4 className="text-lg font-bold text-orange-800">Impact & Growth</h4>
                <ul className="text-left space-y-2 text-orange-700 mt-3">
                  <li>🧠 Understood PR importance</li>
                  <li>📈 Absorbed maximum knowledge</li>
                  <li>🤝 Limited backend changes</li>
                  <li>🎯 Strategic learning approach</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg">
            <p className="text-lg"><strong>🎓 Key Insight:</strong> Sometimes the biggest learning comes from observing and understanding the complete process!</p>
          </div>
        </div>
      ),
      buttonText: "💻 Start OCR UI Foundation"
    },
    {
      id: 'ocr-ui',
      title: "🎨 OCR UI Foundation Work",
      subtitle: "Frontend Innovation & Mock Server Mastery",
      content: (
        <div className="space-y-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-6">🏗️ Foundation Builder Role</h3>
            <p className="text-lg mb-6">Got the frontend foundation role in OCR project due to extensive frontend and mock server experience</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl p-6">
              <Code className="w-10 h-10 text-cyan-600 mb-3" />
              <h4 className="text-lg font-bold text-cyan-800">Core Challenges</h4>
              <ul className="text-left space-y-2 text-cyan-700">
                <li>🔧 Built validation systems</li>
                <li>⚠️ Error handling framework</li>
                <li>🔄 Non-disruptive UI flow</li>
                <li>🎯 Successful UI architecture</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-6">
              <Database className="w-10 h-10 text-green-600 mb-3" />
              <h4 className="text-lg font-bold text-green-800">Technical Achievements</h4>
              <ul className="text-left space-y-2 text-green-700">
                <li>📡 API fetching implementation</li>
                <li>✅ Add page validation</li>
                <li>📝 Edit page data fetching</li>
                <li>🔧 Mock server environment</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-100 border-2 border-yellow-300 rounded-xl p-6">
            <h4 className="text-lg font-bold text-yellow-800 mb-3">🎯 Biggest Challenge Conquered</h4>
            <p className="text-lg text-yellow-700">
              <strong>Environment Mocking:</strong> Created sophisticated mock setup to avoid hardcoded test cases - enabling realistic development without backend dependency!
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-center text-gray-600 italic">
              📸 Images of work and achievements to be displayed here
            </p>
          </div>
        </div>
      ),
      buttonText: "🚀 The Launchpad"
    },
    {
      id: 'launchpad',
      title: "🚀 Understanding Vertex Culture",
      subtitle: "Launchpad Event & Hackathon Adventures",
      content: (
        <div className="space-y-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-6">🏢 In-Person Launchpad Experience</h3>
            <p className="text-lg mb-6">Visited Vertex head office in King of Prussia for an immersive company experience</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl p-6">
              <Users className="w-10 h-10 text-blue-600 mb-3" />
              <h4 className="text-lg font-bold text-blue-800">Networking & Learning</h4>
              <ul className="text-left space-y-2 text-blue-700">
                <li>🤝 Interacted with fellow interns</li>
                <li>👔 Met senior leadership</li>
                <li>🏢 Learned about different teams</li>
                <li>🔗 Understood team collaboration</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6">
              <Award className="w-10 h-10 text-purple-600 mb-3" />
              <h4 className="text-lg font-bold text-purple-800">Hackathon Experience</h4>
              <ul className="text-left space-y-2 text-purple-700">
                <li>💡 Built eInvoice Verifier</li>
                <li>⚡ Real-time development</li>
                <li>🛠️ Useful for Vertex operations</li>
                <li>🎯 Valuable learning experience</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg">
            <p className="text-lg">
              <strong>🏆 Result:</strong> Didn't win the hackathon, but gained incredible experience building something valuable in real-time for Vertex!
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-center text-gray-600 italic">
              📸 Launchpad event photos and hackathon project images to be displayed
            </p>
          </div>
        </div>
      ),
      buttonText: "🎓 My Journey Altogether"
    },
    {
      id: 'lessons',
      title: "🎓 The Lessons Learned",
      subtitle: "Growth, Gratitude & Achievements",
      content: (
        <div className="space-y-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-semibold text-blue-800 mb-6 text-center">🌟 Key Takeaways</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <h4 className="font-bold text-blue-800">🧠 Technical Growth</h4>
                  <p className="text-blue-700">From Python/JS basics to full-stack Spring Boot, React, and infrastructure management</p>
                </div>
                
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <h4 className="font-bold text-green-800">🤝 Team Collaboration</h4>
                  <p className="text-green-700">Multi-team experience across Dragon Keepers and Night Watch</p>
                </div>
                
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                  <h4 className="font-bold text-purple-800">🔍 Problem Solving</h4>
                  <p className="text-purple-700">From NPE debugging to security vulnerabilities - thorough understanding matters</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                  <h4 className="font-bold text-yellow-800">🚀 Innovation Experience</h4>
                  <p className="text-yellow-700">AI/OCR project from scratch - cutting-edge development</p>
                </div>
                
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <h4 className="font-bold text-red-800">🧪 Testing Mindset</h4>
                  <p className="text-red-700">Learned the critical importance of test cases and quality assurance</p>
                </div>
                
                <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
                  <h4 className="font-bold text-indigo-800">🏗️ Infrastructure Thinking</h4>
                  <p className="text-indigo-700">Terraform, monitoring, SLOs - building for scale and maintenance</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-2xl text-center">
            <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">💙 Gratitude</h3>
            <p className="text-lg text-gray-700">
              Immense gratitude to Vertex, mentors, teams, and fellow interns for an incredible journey of growth and learning!
            </p>
          </div>
        </div>
      ),
      buttonText: "🎬 View Highlights Reel"
    },
    {
      id: 'finale',
      title: "🎬 Journey Complete",
      subtitle: "Thank You for Following My Vertex Adventure!",
      content: (
        <div className="space-y-8 text-center">
          <div className="bg-gradient-to-br from-purple-100 via-blue-100 to-green-100 rounded-3xl p-8 shadow-2xl">
            <div className="mb-6">
              <Rocket className="w-24 h-24 text-blue-600 mx-auto mb-4 animate-bounce" />
              <h3 className="text-3xl font-bold text-gray-800 mb-4">🚀 Mission Accomplished!</h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/60 rounded-xl p-4">
                <div className="text-2xl mb-2">🎯</div>
                <h4 className="font-bold text-gray-800">Projects Completed</h4>
                <p className="text-gray-600">Dashboard → Terraform → OCR UI</p>
              </div>
              <div className="bg-white/60 rounded-xl p-4">
                <div className="text-2xl mb-2">🚀</div>
                <h4 className="font-bold text-gray-800">Skills Gained</h4>
                <p className="text-gray-600">Full-Stack + Infrastructure</p>
              </div>
              <div className="bg-white/60 rounded-xl p-4">
                <div className="text-2xl mb-2">❤️</div>
                <h4 className="font-bold text-gray-800">Growth Achieved</h4>
                <p className="text-gray-600">Developer → Problem Solver</p>
              </div>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <p className="text-center text-gray-600 italic text-lg">
                🎥 Cinematic highlights reel with all screenshots, event photos, and project images
              </p>
            </div>
            
            <div className="text-xl text-gray-700 leading-relaxed">
              <p className="mb-4">
                <strong>From a curious CS student to a confident full-stack developer</strong>
              </p>
              <p className="mb-4">
                <strong>From individual contributor to collaborative team member</strong>
              </p>
              <p className="text-blue-600 font-bold">
                Thank you, Vertex, for this incredible rocket journey! 🚀
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white p-6 rounded-2xl">
            <h3 className="text-2xl font-bold mb-2">🌟 The End... Or Just the Beginning?</h3>
            <p className="text-lg">Ready for the next mission at Vertex! 🚀</p>
          </div>
        </div>
      ),
      buttonText: "🙏 Thank You!"
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setIsRocketAnimating(true);
      setShowRocket(true);
      
      setTimeout(() => {
        setCurrentSlide(currentSlide + 1);
        setIsRocketAnimating(false);
      }, 1000);
      
      setTimeout(() => {
        setShowRocket(false);
      }, 1500);
    } else {
      // Reset to beginning
      setCurrentSlide(0);
    }
  };

  // Floating particles animation
  const ParticleField = () => {
    const particles = Array.from({ length: 20 }, (_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-blue-300 rounded-full opacity-30 animate-pulse"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${2 + Math.random() * 3}s`
        }}
      />
    ));
    return <div className="fixed inset-0 pointer-events-none">{particles}</div>;
  };

  // Rocket animation component
  const RocketAnimation = () => (
    <div className={`fixed inset-0 pointer-events-none z-50 ${showRocket ? 'block' : 'hidden'}`}>
      <div 
        className={`absolute transition-all duration-1000 ease-in-out ${
          isRocketAnimating 
            ? 'transform translate-x-full rotate-45 opacity-0' 
            : 'transform -translate-x-full rotate-0 opacity-100'
        }`}
        style={{
          left: '10%',
          top: '50%',
          transform: isRocketAnimating 
            ? 'translateX(200vw) translateY(-50vh) rotate(45deg)' 
            : 'translateX(-200px) translateY(-50%) rotate(0deg)'
        }}
      >
        <div className="relative">
          <Rocket className="w-16 h-16 text-blue-500 transform rotate-45" />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full animate-ping"></div>
        </div>
      </div>
    </div>
  );

  // Progress indicator
  const ProgressBar = () => (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-40">
      <div 
        className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 ease-out"
        style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
      ></div>
    </div>
  );

  // Slide navigation dots
  const NavigationDots = () => (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-40">
      {slides.map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentSlide(index)}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            index === currentSlide 
              ? 'bg-blue-600 w-8' 
              : 'bg-gray-400 hover:bg-gray-600'
          }`}
        />
      ))}
    </div>
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide(prev => prev > 0 ? prev - 1 : slides.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 relative overflow-hidden">
      <ParticleField />
      <ProgressBar />
      <RocketAnimation />
      
      {/* Vertex Logo/Branding */}
      <div className="fixed top-4 left-4 z-30">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-500 rounded"></div>
            <span className="font-bold text-gray-800">VERTEX</span>
            <span className="text-sm text-gray-600">Intern Program</span>
          </div>
        </div>
      </div>

      {/* Main slide container */}
      <div className="container mx-auto px-6 py-12 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-6xl">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
            >
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 mb-4">
                  {slide.title}
                </h1>
                <h2 className="text-2xl text-gray-600 font-medium">
                  {slide.subtitle}
                </h2>
              </div>
              
              <div className="mb-12">
                {slide.content}
              </div>
              
              <div className="text-center">
                <button
                  onClick={nextSlide}
                  className="journey-button bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  {slide.buttonText}
                  <ChevronRight className="inline-block ml-2 w-6 h-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <NavigationDots />
      
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-10 right-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-green-200 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Keyboard navigation hint */}
      <div className="fixed bottom-20 right-6 text-sm text-gray-500 z-30">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow">
          <p>Use ← → arrows or click dots to navigate</p>
        </div>
      </div>
    </div>
  );
};

export default VertexJourney;