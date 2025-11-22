import { 
  Target, 
  Eye, 
  Zap, 
  Award, 
  Users, 
  TrendingUp,
  Lightbulb,
  Shield,
  BarChart3,
  Brain
} from 'lucide-react'
import TechLogos from '../components/TechLogos'

const About = () => {
  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-dark-950 to-purple-900/20" />
          <div className="absolute top-0 left-1/5 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" style={{ animation: 'floatY 10s ease-in-out infinite, glow 8s ease-in-out infinite' }} />
          <div className="absolute bottom-0 right-1/5 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" style={{ animation: 'floatX 12s ease-in-out infinite, glow 7s ease-in-out infinite' }} />
        </div>
        <style>{`
          @keyframes floatY { 0% { transform: translateY(0) } 50% { transform: translateY(-12px) } 100% { transform: translateY(0) } }
          @keyframes floatX { 0% { transform: translateX(0) } 50% { transform: translateX(16px) } 100% { transform: translateX(0) } }
          @keyframes glow { 0% { opacity: .35 } 50% { opacity: .75 } 100% { opacity: .35 } }
        `}</style>
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold text-gray-100 sm:text-5xl mb-6">
            About ESG Analytics Platform
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed">
            Empowering businesses with AI-driven ESG insights to build a sustainable future. 
            Our platform combines advanced analytics with machine learning to transform how 
            organizations measure, predict, and improve their environmental, social, and governance performance.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {/* Mission */}
            <div className="group card hover:border-primary-700/50 hover:translate-y-0.5 transition-all duration-300 lg:col-span-3">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-500/10 rounded-lg">
                  <Target className="h-6 w-6 text-primary-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-100 mb-3">Our Mission</h2>
                  <p className="text-gray-400 leading-relaxed">
                    To democratize ESG analytics by providing accessible, accurate, and actionable 
                    insights that enable organizations of all sizes to make data-driven sustainability 
                    decisions and contribute to a better world.
                  </p>
                </div>
              </div>
            </div>

            {/* Vision */}
            <div className="group card hover:border-purple-700/50 hover:translate-y-0.5 transition-all duration-300 lg:col-span-3">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <Eye className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-100 mb-3">Our Vision</h2>
                  <p className="text-gray-400 leading-relaxed">
                    A world where every business decision is informed by comprehensive ESG data, 
                    leading to sustainable growth, ethical practices, and positive environmental 
                    and social impact across industries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-100 mb-4">What We Do</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We provide comprehensive ESG analytics solutions powered by cutting-edge AI and machine learning technologies
            </p>
          </div>

          {/* Bento layout for features */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:auto-rows-[1fr]">
            <div className="card hover:border-primary-700/40 transition-all duration-300 lg:col-span-3">
              <div className="p-3 bg-blue-500/10 rounded-lg w-fit mb-4">
                <BarChart3 className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">
                Comprehensive Analytics
              </h3>
              <p className="text-gray-400 text-sm">
                Analyze ESG performance across multiple dimensions including environmental impact, 
                social responsibility, and governance practices with interactive dashboards and visualizations.
              </p>
            </div>

            <div className="card hover:border-green-700/40 transition-all duration-300 lg:col-span-3">
              <div className="p-3 bg-green-500/10 rounded-lg w-fit mb-4">
                <Brain className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">
                AI-Powered Predictions
              </h3>
              <p className="text-gray-400 text-sm">
                Leverage machine learning models integrated with IBM Watson to forecast ESG scores, 
                identify trends, and predict future performance with high accuracy.
              </p>
            </div>

            <div className="card hover:border-purple-700/40 transition-all duration-300 lg:col-span-2">
              <div className="p-3 bg-purple-500/10 rounded-lg w-fit mb-4">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">
                Trend Analysis
              </h3>
              <p className="text-gray-400 text-sm">
                Track historical performance, identify patterns, and understand how ESG metrics 
                evolve over time across different industries and regions.
              </p>
            </div>

            <div className="card hover:border-orange-700/40 transition-all duration-300 lg:col-span-2">
              <div className="p-3 bg-orange-500/10 rounded-lg w-fit mb-4">
                <Lightbulb className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">
                Actionable Insights
              </h3>
              <p className="text-gray-400 text-sm">
                Receive automated recommendations and strategic insights to improve your ESG 
                performance and align with industry best practices.
              </p>
            </div>

            <div className="card hover:border-red-700/40 transition-all duration-300 lg:col-span-2">
              <div className="p-3 bg-red-500/10 rounded-lg w-fit mb-4">
                <Shield className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">
                Compliance Monitoring
              </h3>
              <p className="text-gray-400 text-sm">
                Stay compliant with evolving ESG regulations and standards. Monitor your performance 
                against global benchmarks and industry requirements.
              </p>
            </div>

            <div className="card hover:border-cyan-700/40 transition-all duration-300 lg:col-span-2">
              <div className="p-3 bg-cyan-500/10 rounded-lg w-fit mb-4">
                <Award className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">
                Benchmarking
              </h3>
              <p className="text-gray-400 text-sm">
                Compare your ESG performance against industry peers and top performers. 
                Identify areas for improvement and competitive advantages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-100 mb-4">Platform Capabilities</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Built with modern technology stack for performance, scalability, and user experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4 p-6 bg-dark-900 rounded-xl border border-dark-800">
              <div className="p-2 bg-primary-500/10 rounded-lg h-fit">
                <Zap className="h-5 w-5 text-primary-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">Real-time Processing</h3>
                <p className="text-gray-400 text-sm">
                  Fast data processing and instant visualization updates for seamless user experience
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-dark-900 rounded-xl border border-dark-800">
              <div className="p-2 bg-green-500/10 rounded-lg h-fit">
                <Users className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">Multi-Industry Coverage</h3>
                <p className="text-gray-400 text-sm">
                  Comprehensive data across Technology, Finance, Healthcare, Energy, and Retail sectors
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-dark-900 rounded-xl border border-dark-800">
              <div className="p-2 bg-purple-500/10 rounded-lg h-fit">
                <BarChart3 className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">Advanced Filtering</h3>
                <p className="text-gray-400 text-sm">
                  Excel-like filtering capabilities with tag-based selection for precise data analysis
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-dark-900 rounded-xl border border-dark-800">
              <div className="p-2 bg-orange-500/10 rounded-lg h-fit">
                <Shield className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">Data Security</h3>
                <p className="text-gray-400 text-sm">
                  Enterprise-grade security with encrypted data transmission and secure storage
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-100 mb-4">Built With Modern Tech</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Leveraging cutting-edge technologies for optimal performance and scalability
            </p>
          </div>

          <TechLogos />
        </div>
      </section>

      {/* Our Commitment */}
      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="card bg-gradient-to-br from-primary-900/20 to-purple-900/20 border-primary-700/30 text-center p-6">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Our Commitment to Sustainability</h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              We're committed to helping organizations worldwide achieve their sustainability goals. 
              By providing transparent, accurate, and actionable ESG insights, we enable businesses 
              to make informed decisions that benefit both their bottom line and the planet.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">Carbon Neutral Operations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-gray-300">Open Data Standards</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-gray-300">Continuous Innovation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-100 mb-4">Ready to Transform Your ESG Strategy?</h2>
          <p className="text-lg text-gray-400 mb-8">
            Join forward-thinking organizations leveraging AI-powered ESG analytics
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-lg transition-colors"
            >
              Explore Dashboard
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-dark-800 hover:bg-dark-700 text-gray-200 font-semibold rounded-lg border border-dark-700 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
