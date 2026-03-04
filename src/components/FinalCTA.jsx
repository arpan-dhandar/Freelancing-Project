import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Rocket } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-24 bg-white overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="max-w-[1320px] mx-auto px-6 relative z-10">
        <motion.div
          className="bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] rounded-3xl p-12 md:p-16 shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

          {/* Floating Sparkles */}
          <motion.div
            className="absolute top-10 right-20"
            animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="w-8 h-8 text-white/40" />
          </motion.div>

          <motion.div
            className="absolute bottom-10 left-20"
            animate={{ y: [0, 20, 0], rotate: [360, 180, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <Sparkles className="w-6 h-6 text-white/40" />
          </motion.div>

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Rocket className="w-4 h-4" />
              Start Today
            </motion.div>

            {/* Heading */}
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl text-white mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Ready to Find Your{" "}
              <span className="block mt-2">Perfect Match?</span>
            </motion.h2>

            {/* Description */}
            <motion.p
              className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Join thousands of businesses who trust SCARR to connect them with
              exceptional talent. Start your next project today and experience
              the difference.
            </motion.p>

            {/* Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.button
                className="px-8 py-4 rounded-xl bg-white text-[#1E40AF] shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Post a Project</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>

              <motion.button
                className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Browse Talent
              </motion.button>
            </motion.div>

            {/* Benefits */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-6 text-white/90 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {[
                "Free to Join",
                "Verified Professionals",
                "Secure Payments",
                "24/7 Support",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white" />
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}