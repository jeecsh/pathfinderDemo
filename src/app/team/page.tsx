"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Linkedin, Github, Mail, Globe, MapPin } from "lucide-react";
import Image from "next/image";
import { useThemeStore } from '@/app/stores/useThemeStore';

const TeamPage = () => {
  const ref = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const teamMembers = [
    {
      name: "Mohamed Yousif",
      role: "Team Lead & Full Stack Developer",
      bio: "Combines full stack expertise with system architecture to create scalable, real-world tech solutions across cloud, web, and IoT.",

      image: "/jay.jpeg",
      tags: ["System Design", "Cloud Architecture","FullStack"],
      social: {
        linkedin: "#",
        github: "#",
        email: "mailto:m.yousif@example.com"
      },
      imagePosition: "center 25%" // Custom position for each member
    },
    {
      name: "Mohamed Abubaker",
      role: "softwre Developer",
      bio: "Specializes in mobile development, AI solutions, and hardware programming for RPi and ESP32.",
      image: "/k.jpeg",
      tags: ["Flutter", "TensorFlow", "Raspberry Pi", "ESP32"],
      social: {
        linkedin: "#",
        github: "#",
        email: "mailto:m.abubaker@example.com"
      },
      imagePosition: "top center"
    },
    {
      name: "Ahmed Salah",
      role: "Full Stack Developer",
      bio: "Creates responsive web applications with modern frameworks and clean code.",
      image: "/kahrva.jpeg",
      tags: ["React", "Next.js", "TypeScript", "UI/UX"],
      social: {
        linkedin: "#",
        github: "#",
        email: "mailto:a.salah@example.com"
      },
      imagePosition: "top -20 center"
    },
    {
      name: "Mohamed Elfadel",
      role: "Data Analyst",
      bio: "Transforms complex data into actionable insights with advanced analytics.",
      image: "/fadel.jpeg",
      tags: ["SQL", "Power BI", "Machine Learning", "Statistics"],
      social: {
        linkedin: "#",
        github: "#",
        email: "mailto:m.elfadel@example.com"
      },
      imagePosition: "top center"
    },
    {
      name: "Ahmed Amasaieb",
      role: "Mechanical Design Engineer",
      bio: "Bridges digital and physical with innovative mechanical design solutions.",
      image: "/a.jpeg",
      tags: ["CAD", "3D Modeling", "Prototyping"],
      social: {
        linkedin: "#",
        github: "#",
        email: "mailto:a.amasaieb@example.com"
      },
      imagePosition: "center 25%"
    },
    {
      name: "Mohamed Osman",
      role: "IoT Specialist",
      bio: "Develops smart connected systems with expertise in IoT infrastructure.",
      image: "/theory.jpeg",
      tags: ["Embedded Systems", "Networking", "Cloud IoT"],
      social: {
        linkedin: "#",
        github: "#",
        email: "mailto:m.osman@example.com"
      },
      imagePosition: "center 25%"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'} relative overflow-hidden`}>
      {/* Background grid pattern */}
      <div className="absolute inset-0 z-0">
        <div className={`h-full w-full ${isDark ? 'opacity-10' : 'opacity-5'}`} 
            style={{
              backgroundImage: `linear-gradient(${isDark ? '#333' : '#999'} 1px, transparent 1px), 
                               linear-gradient(90deg, ${isDark ? '#333' : '#999'} 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
              backgroundPosition: `${scrollY * 0.1}px ${scrollY * 0.1}px`
            }}>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute w-full h-full overflow-hidden">
        <div className={`absolute ${isDark ? 'bg-blue-700' : 'bg-blue-500'} opacity-20 rounded-full h-64 w-64 blur-3xl`} 
            style={{ 
              top: `${20 + Math.sin(scrollY * 0.01) * 5}%`, 
              left: '10%',
              transform: `scale(${1 + scrollY * 0.0005})`
            }}
        />
        <div className={`absolute ${isDark ? 'bg-purple-700' : 'bg-purple-500'} opacity-20 rounded-full h-80 w-80 blur-3xl`} 
            style={{ 
              bottom: `${15 + Math.cos(scrollY * 0.01) * 5}%`, 
              right: '5%',
              transform: `scale(${1 + scrollY * 0.0003})`
            }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 px-4 py-16" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 relative"
        >
          <div className="inline-block px-3 py-1 rounded-full mb-3 bg-opacity-10 backdrop-blur-sm bg-blue-500">
            <span className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              Our Amazing Team
            </span>
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Meet The <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">Team</span>
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
            The talented professionals driving innovation through technology
          </p>
        </motion.div>

        {/* Team Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-2xl overflow-hidden shadow-lg hover:shadow-xl 
                transition-all duration-300 border ${isDark ? 'border-gray-800' : 'border-gray-100'} 
                transform hover:scale-[1.02] backdrop-blur-sm`}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent z-10" />
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  style={{ 
                    objectPosition: member.imagePosition || "center 25%",
                    width: '100%' 
                  }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute bottom-4 left-4 z-20">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`p-1.5 rounded-lg ${isDark ? 'bg-blue-500/20' : 'bg-blue-500/20'} backdrop-blur-sm`}>
                      <MapPin size={16} className={`${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                    </div>
                    <span className={`text-sm font-medium text-white/90 backdrop-blur-sm`}>{member.role}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className={`text-xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{member.name}</h3>
                <p className={`${isDark ? 'text-blue-400' : 'text-blue-600'} mb-4`}>{member.role}</p>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>{member.bio}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {member.tags.map((tag, i) => (
                    <span 
                      key={i}
                      className={`px-2.5 py-1 text-xs rounded-full ${
                        isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Social Links */}
                <div className={`flex space-x-3 border-t pt-4 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                  <a 
                    href={member.social.linkedin} 
                    className={`p-2 rounded-lg transition-all duration-300 ${isDark ? 
                      'text-gray-400 hover:text-blue-400 hover:bg-blue-500/10' : 
                      'text-gray-500 hover:text-blue-600 hover:bg-blue-50'}`}
                    aria-label={`${member.name} LinkedIn`}
                  >
                    <Linkedin size={18} />
                  </a>
                  <a 
                    href={member.social.github} 
                    className={`p-2 rounded-lg transition-all duration-300 ${isDark ? 
                      'text-gray-400 hover:text-gray-200 hover:bg-gray-800' : 
                      'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                    aria-label={`${member.name} GitHub`}
                  >
                    <Github size={18} />
                  </a>
                  <a 
                    href={member.social.email} 
                    className={`p-2 rounded-lg transition-all duration-300 ${isDark ? 
                      'text-gray-400 hover:text-purple-400 hover:bg-purple-500/10' : 
                      'text-gray-500 hover:text-purple-600 hover:bg-purple-50'}`}
                    aria-label={`Email ${member.name}`}
                  >
                    <Mail size={18} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Values Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className={`mt-24 ${isDark ? 'bg-gray-900/50' : 'bg-white'} rounded-2xl p-8 border 
            ${isDark ? 'border-gray-800' : 'border-gray-100'} backdrop-blur-sm shadow-xl`}
        >
          <h2 className={`text-3xl font-bold text-center mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">Values</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Innovation",
                description: "We push boundaries and explore new possibilities in technology."
              },
              {
                title: "Collaboration",
                description: "The best solutions come from working together across disciplines."
              },
              {
                title: "Excellence",
                description: "Committed to delivering the highest quality in everything we create."
              }
            ].map((value, index) => (
              <div key={index} className="text-center">
                <div className="h-px bg-gray-200 mb-6 mx-8" />
                <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{value.title}</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{value.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeamPage;
