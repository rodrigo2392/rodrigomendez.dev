"use client";

import type React from "react";

import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Globe,
  Github
} from "lucide-react";
import Link from "next/link";

interface SocialMediaLink {
  name: string;
  url: string;
  icon: React.ReactNode;
  gradient: string;
  shadowColor: string;
}

export default function SocialMediaLinks() {
  const socialLinks: SocialMediaLink[] = [
    {
      name: "YouTube",
      url: "https://youtube.com/@rodrigomendezdev",
      icon: <Youtube size={22} />,
      gradient: "from-rose-500/80 to-red-600/80",
      shadowColor: "shadow-red-500/20",
    },
    {
      name: "Github",
      url: "https://rodrigomendez.dev",
      icon: <Github size={22} />,
      gradient: "black",
      shadowColor: "shadow-emerald-500/20",
    },
    {
      name: "Discord",
      url: "https://discord.gg/HBvEy7sp2K",
      icon: <MessageCircle size={22} />,
      gradient: "from-indigo-400/80 to-violet-500/80",
      shadowColor: "shadow-violet-500/20",
    },
    {
      name: "Facebook",
      url: "https://facebook.com/rodrigomendezdev",
      icon: <Facebook size={22} />,
      gradient: "from-blue-400/80 to-blue-600/80",
      shadowColor: "shadow-blue-500/20",
    },
    {
      name: "Instagram",
      url: "https://instagram.com/rodrigomendezdev",
      icon: <Instagram size={22} />,
      gradient: "from-pink-500/80 via-rose-500/80 to-purple-600/80",
      shadowColor: "shadow-pink-500/20",
    },
    {
      name: "Mi Sitio Web",
      url: "https://rodrigomendez.dev",
      icon: <Globe size={22} />,
      gradient: "from-emerald-400/80 to-teal-500/80",
      shadowColor: "shadow-emerald-500/20",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 relative">
      {/* Fondo con efecto glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-700/50 -z-10" />

      {/* Efecto de brillo en la esquina */}
      <div className="absolute -top-24 -left-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl opacity-25 -z-10" />
      <div className="absolute -bottom-24 -right-20 w-72 h-72 bg-emerald-500/30 rounded-full blur-3xl opacity-25 -z-10" />

      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="inline-block w-12 h-1 bg-gradient-to-r from-white to-slate-200 rounded-full mb-3"
          initial={{ width: 0 }}
          animate={{ width: 48 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        />
        <h2 className="text-2xl font-bold bg-gradient-to-br from-white to-slate-200 bg-clip-text text-transparent">
          Mis Redes Sociales
        </h2>
      </motion.div>

      <motion.ul
        className="space-y-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {socialLinks.map((social, index) => (
          <motion.li key={index} variants={item}>
            <Link href={social.url} target="_blank" rel="noopener noreferrer">
              <motion.div
                className={`flex items-center p-4 rounded-xl bg-gradient-to-r ${social.gradient} shadow-lg ${social.shadowColor} backdrop-blur-sm border border-white/10`}
                whileHover={{
                  y: -5,
                  boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.5)",
                  scale: 1.02,
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <div className="bg-black/20 p-2 rounded-lg mr-4 backdrop-blur-sm border border-white/10">
                  {social.icon}
                </div>
                <span className="font-medium tracking-wide text-white">
                  {social.name}
                </span>
                <motion.div
                  className="ml-auto bg-black/20 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10"
                  whileHover={{ rotate: 45 }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 17L17 7M17 7H7M17 7V17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              </motion.div>
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
