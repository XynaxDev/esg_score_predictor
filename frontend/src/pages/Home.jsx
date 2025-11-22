import { motion } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import TechLogos from '../components/TechLogos'
import { 
  BarChart3, 
  Brain, 
  TrendingUp, 
  Shield, 
  Zap,
  CheckCircle,
  Database,
  ArrowRight
} from 'lucide-react'

const Home = () => {
  const stepRefs = [useRef(null), useRef(null), useRef(null)]
  const sectionRef = useRef(null)

  const scrollToStep = (i) => stepRefs[i]?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-400">50+</div>
              <div className="mt-2 text-sm text-gray-400">Companies Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-400">10+</div>
              <div className="mt-2 text-sm text-gray-400">Years of Data</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-400">5+</div>
              <div className="mt-2 text-sm text-gray-400">Industries Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-400">95%</div>
              <div className="mt-2 text-sm text-gray-400">Prediction Accuracy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Bento Layout */}
      <section ref={sectionRef} className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl mb-4">
              Powerful Features for ESG Excellence
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Everything you need to analyze, predict, and improve your ESG performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:auto-rows-[1fr]">
            {/* Feature 1 - large */}
            <motion.div
              className="group card hover:border-primary-700/50 transition-all duration-300 lg:col-span-3"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="p-3 bg-primary-500/10 rounded-lg w-fit mb-4">
                <BarChart3 className="h-6 w-6 text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-100 mb-2">
                Interactive Analytics
              </h3>
              <p className="text-gray-400">
                Visualize ESG data with interactive charts, tables, and comprehensive dashboards
              </p>
            </motion.div>

            {/* Feature 2 - large */}
            <motion.div
              className="group card hover:border-primary-700/50 transition-all duration-300 lg:col-span-3"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="p-3 bg-purple-500/10 rounded-lg w-fit mb-4">
                <Brain className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-100 mb-2">
                AI Predictions
              </h3>
              <p className="text-gray-400">
                ML models powered by IBM Watson to forecast ESG scores and trends
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className="group card hover:border-primary-700/50 transition-all duration-300 lg:col-span-2"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="p-3 bg-green-500/10 rounded-lg w-fit mb-4">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-100 mb-2">
                Trend Analysis
              </h3>
              <p className="text-gray-400">
                Track historical trends and identify patterns in ESG performance over time
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              className="group card hover:border-primary-700/50 transition-all duration-300 lg:col-span-2"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="p-3 bg-orange-500/10 rounded-lg w-fit mb-4">
                <Shield className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-100 mb-2">
                Compliance Monitoring
              </h3>
              <p className="text-gray-400">
                Ensure regulatory compliance with automated ESG reporting and alerts
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div
              className="group card hover:border-primary-700/50 transition-all duration-300 lg:col-span-2"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="p-3 bg-blue-500/10 rounded-lg w-fit mb-4">
                <Database className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-100 mb-2">
                Data Management
              </h3>
              <p className="text-gray-400">
                Centralize ESG data from multiple sources with advanced filtering options
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div
              className="group card hover:border-primary-700/50 transition-all duration-300 lg:col-span-2"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: 0.25 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="p-3 bg-red-500/10 rounded-lg w-fit mb-4">
                <Zap className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-100 mb-2">
                Real-time Insights
              </h3>
              <p className="text-gray-400">
                Get instant recommendations and actionable insights for improvement
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works - Cutting-edge animated section */}
      <section className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Three simple steps to transform your ESG strategy
            </p>
          </div>

          {/* Static stepper (no animated line) */}
          <div className="relative mb-12 max-w-3xl mx-auto">
            {/* Connector */}
            <div className="absolute left-10 right-10 top-4 h-px bg-dark-700/80" />
            <div className="flex justify-between">
              {[0,1,2].map((idx) => {
                const labels = ['Upload','Analyze','Act']
                const colors = ['border-primary-600 text-primary-300','border-purple-600 text-purple-300','border-emerald-600 text-emerald-300']
                return (
                  <button key={idx} onClick={() => scrollToStep(idx)} className="relative flex flex-col items-center gap-2">
                    <span className={`flex items-center justify-center h-8 w-8 rounded-full bg-dark-900 border text-[12px] ${colors[idx]}`}>{idx+1}</span>
                    <span className="text-xs text-gray-400">{labels[idx]}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Steps - glass cards with icons, hover lift */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div ref={stepRefs[0]}
              className="relative p-6 rounded-2xl border border-dark-800 bg-dark-900/60 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all group"
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              whileHover={{ y: -4 }}
            >
              <div className="absolute -top-4 left-6 w-10 h-10 rounded-xl bg-primary-500/15 border border-primary-700/30 flex items-center justify-center shadow-lg">
                <Database className="h-5 w-5 text-primary-400" />
              </div>
              <div className="pt-4">
                <h3 className="text-xl font-semibold text-gray-100 mb-2">Upload Your Data</h3>
                <p className="text-gray-400">Import ESG data from various sources or use our sample dataset to get started</p>
              </div>
            </motion.div>

            <motion.div
              className="relative p-6 rounded-2xl border border-dark-800 bg-dark-900/60 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all group"
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              whileHover={{ y: -4 }}
            >
              <div className="absolute -top-4 left-6 w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-700/30 flex items-center justify-center shadow-lg">
                <Brain className="h-5 w-5 text-purple-400" />
              </div>
              <div className="pt-4">
                <h3 className="text-xl font-semibold text-gray-100 mb-2">AI Analysis</h3>
                <p className="text-gray-400">Our ML models analyze patterns, predict trends, and generate actionable insights</p>
              </div>
            </motion.div>

            <motion.div
              className="relative p-6 rounded-2xl border border-dark-800 bg-dark-900/60 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all group"
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              whileHover={{ y: -4 }}
            >
              <div className="absolute -top-4 left-6 w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-700/30 flex items-center justify-center shadow-lg">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="pt-4">
                <h3 className="text-xl font-semibold text-gray-100 mb-2">Take Action</h3>
                <p className="text-gray-400">Implement recommendations and track improvements in real-time dashboards</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Built With Modern Tech - logos */}
      <section className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl mb-4">Built With Modern Tech</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">Leveraging cutting-edge technologies for optimal performance and scalability</p>
          </div>
          <TechLogos />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="card bg-gradient-to-r from-primary-900/20 to-purple-900/20 border-primary-700/50 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl mb-4">
              Ready to Transform Your ESG Strategy?
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Start analyzing your ESG performance today with our powerful analytics platform
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-primary-500 transition-all duration-200 hover:scale-105"
            >
              Get Started Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
