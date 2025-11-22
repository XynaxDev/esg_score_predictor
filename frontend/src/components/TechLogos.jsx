import { motion } from 'framer-motion'

const logos = [
  {
    key: 'react',
    title: 'React',
    subtitle: 'Frontend Framework',
    url: 'https://cdn.simpleicons.org/react/61DAFB',
    bg: 'from-cyan-500/10 to-cyan-500/0',
  },
  {
    key: 'flask',
    title: 'Flask',
    subtitle: 'Backend API',
    url: 'https://cdn.simpleicons.org/flask/fffff',
    bg: 'from-zinc-400/10 to-zinc-400/0',
  },
  {
    key: 'python',
    title: 'Python',
    subtitle: 'Data Processing',
    url: 'https://s3.dualstack.us-east-2.amazonaws.com/pythondotorg-assets/media/community/logos/python-logo-only.png',
    bg: 'from-blue-500/10 to-blue-500/0',
  },
  {
    key: 'ibm',
    title: 'Watson',
    subtitle: 'AI/ML Models',
    url: 'https://www.ibm.com/brand/experience-guides/developer/b1db1ae501d522a1a4b49613fe07c9f1/01_8-bar-positive.svg',
    bg: 'from-emerald-500/10 to-emerald-500/0',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' } }),
}

const TechLogos = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {logos.map((l, i) => (
        <motion.div
          key={l.key}
          className="card relative overflow-hidden"
          custom={i}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={cardVariants}
          whileHover={{ scale: 1.01 }}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${l.bg}`} />
          <div className="relative flex items-center gap-4 p-5">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-dark-800 border border-dark-700 flex items-center justify-center">
              <img src={l.url} alt={`${l.title} logo`} className="w-6 h-6" loading="lazy" />
            </div>
            <div>
              <div className="text-base font-semibold text-gray-100">{l.title}</div>
              <div className="text-xs text-gray-400">{l.subtitle}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default TechLogos
