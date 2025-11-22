import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, TrendingUp, Shield, Zap } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 overflow-hidden bg-dark-950">

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8"
        >
          <Sparkles className="h-4 w-4 text-primary-400" />
          <span className="text-sm font-medium text-primary-300">AI-Powered ESG Analytics</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-[1.1]"
        >
          Predict & Optimize
          <br />
          <span className="text-primary-400">ESG Performance</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          Leverage advanced machine learning models to analyze Environmental, Social,
          and Governance metrics for sustainable business growth.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link to="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="group px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-full transition-colors flex items-center gap-2 shadow-lg shadow-primary-600/20"
            >
              Explore Dashboard
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
          <Link to="/models">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border border-white/15 hover:border-white/25 transition-all"
            >
              View Models
            </motion.button>
          </Link>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-16"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="text-sm text-gray-300">Real-time Insights</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <Shield className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-gray-300">99% Accuracy</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <Zap className="h-4 w-4 text-amber-400" />
            <span className="text-sm text-gray-300">Instant Analysis</span>
          </div>
        </motion.div>
      </div>

      {/* Floating elements (decorative) */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-[10%] w-16 h-16 rounded-2xl bg-primary-500/10 border border-primary-500/20 backdrop-blur-sm hidden lg:block"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-1/3 right-[10%] w-20 h-20 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm hidden lg:block"
      />
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 right-[15%] w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm hidden lg:block"
      />
    </section>
  )
}
