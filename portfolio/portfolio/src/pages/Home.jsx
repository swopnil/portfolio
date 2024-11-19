import React, { useRef } from 'react';
import { motion, useScroll, useInView } from 'framer-motion';
import WordCloud from './WordCloud';

import { 
  GithubIcon, LinkedinIcon, Mail, Download, Book, Briefcase, Code,
  Brain, Server, Layout, Shield, Terminal, Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const gradients = {
  first: "from-blue-600 to-purple-600",
  second: "from-purple-600 to-indigo-600",
  third: "from-indigo-600 to-blue-600",
  fourth: "from-blue-600 to-cyan-600",
  fifth: "from-cyan-600 to-blue-600"
};
// ProjectOrbit Component



// Main Component
const Home = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);

  // Project Data
  const projects = [
    {
      id: 1,
      title: "Currency Recognition",
      description: "I developed NoteNinja, a currency recognition application, inspired by my mother's daily struggles with partial vision. Watching her difficulty in identifying bills and having to rely on others for help deeply affected me, especially after I left for college. This personal connection drove me to leverage my computer science background to create a practical solution. Using advanced CNN models including ResNet50, VGG16, and Inception-v3, I built a robust system that could accurately identify currency bills in real-time. To ensure the app would work reliably in real-world conditions – like the varying lighting in stores or the different ways my mom might hold her phone – I created a diverse dataset of over 50,000 currency images from 25 countries, captured under various conditions. The iOS application I developed features voice feedback in multiple languages, achieving 90% accuracy in currency detection.",
      tech: ["Python", "TensorFlow", "Swift","CNN","OpenCV"],
      image: "curr.png",
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "Campus Safety AI",
      description: "The Campus Hero App is designed to keep on-campus students safe anytime, anywhere. It leverages AI to provide real-time notifications, mental health support, incident reporting, and navigation assistance. With features like emergency alerts, a campus map, and a safety walk map, it ensures students stay informed and secure. Whenever user is going out, they can turn on the app and it uses voice recognition to sense danger, in case of danger it sends the recent recorded text, location, and alert to campus safety. The app doesn't invade privacy  because it works on the concept of Hey Siri, everything safe is never stored and automatically replaced in milliseconds. There is also a campus density map that leverages real time cctv footages to show density in different location around campus and help user find safest way to go back to their destination.",
      tech: ["Python", "React", "TensorFlow", "Firebase"],
      image: "safety.jpeg",
      color: "bg-purple-500"
    },
    {
      id: 3,
      title: "Hydrovision",
      description: "The HydroData platform is an intelligent system designed to enhance hydropower plant operations through advanced data analytics. It combines real-time sensor data, weather forecasts, and historical patterns to predict water levels and optimize energy production. The system features predictive analytics for water flow forecasting, operational optimization for turbine efficiency, and early flood warning capabilities. By analyzing multiple data streams, it helps operators make informed decisions about power generation schedules and safety measures. The platform typically delivers 15-20% improved energy efficiency while providing crucial advance warning for flood events, enabling better emergency preparedness. Its user-friendly interface makes complex data easily accessible to plant operators, helping them maintain peak performance while ensuring regulatory compliance and environmental safety.",
      tech: ["Django", "React", "PostgreSQL", "Docker"],
      image: "Hydrovision.png",
      color: "bg-indigo-500"
    },
    {
      id: 4,
      title: "PYsecure Browser",
      description: "Secure browser with advanced threat detection and privacy features. Many organizations deal with very confidential information but their employees are unable to identify threats and hackers have a great way to track their activity by leaving malware in their browser. This browser blocks all, and allows admin to have control over safe sites user can navigate and track their working period. The image is just basic implementation, the browser was configured as the",
      tech: ["Python", "V8", "Cybersecurity"],
      image: "browser.png",
      color: "bg-green-500"
    },
    {
      id: 5,
      title: "Villanova Stock Exchange",
      description: "A platform to create, trade stocks in real time. This is a simulation of stock system where users can buy, sell stocks of Villanova clubs, department. This teaches people, how trading works in real life.",
      tech: ["React", "Node.js", "MongoDB"],
      image: "stock.png",
      color: "bg-yellow-500"
    },
    {
      id: 6,
      title: "Mental Health Chatbot",
      description: "AI-powered chatbot for mental health support using NLP.",
      tech: ["Python", "NLTK", "React", "Firebase"],
      image: "chatbot.PNG",
      color: "bg-red-500"
    },
    {
      id: 7,
      title: "Battery Life Tracker",
      description: "Smart battery monitoring and optimization system.",
      tech: ["Swift", "iOS", "Core ML"],
      image: "btt.PNG",
      color: "bg-teal-500"
    },
    {
      id: 8,
      title: "Villanova Software Engineers",
      description: "A website to display our club projects.",
      tech: ["React", "Firebase", "Django"],
      image: "vse.png",
      color: "bg-pink-500"
    }
  ];

  // Skills Data
  const skills = [
    {
      icon: Brain,
      title: "Machine Learning & AI",
      description: "Started with basic Python libraries and gradually moved to complex deep learning models",
      projects: [
        "Began with scikit-learn for basic classification tasks",
        "Developed CNN models with TensorFlow for currency recognition project",
        "Implemented NLTK for natural language processing in chatbot development",
        "Created custom neural networks for campus safety monitoring system"
      ]
    },
    {
      icon: Layout,
      title: "Full Stack Development",
      description: "Journey from basic HTML to complex web applications",
      projects: [
        "Started with simple webpage creation in grade 7",
        "Built dynamic websites using Django and React.js",
        "Developed audit management system at Eminence Ways",
        "Created HackNepal platform for rural tech connection"
      ]
    },
    {
      icon: Server,
      title: "Backend Development",
      description: "Mastered multiple backend technologies through real projects",
      projects: [
        "Built RESTful APIs with Django for asset management",
        "Implemented Firebase for real-time applications",
        "Developed MySQL database architectures and admin pages for various websites",
        "Created secure authentication systems for browser and websites"
      ]
    },
    {
      icon: Shield,
      title: "Cybersecurity",
      description: "Learned through hands-on penetration testing and secure development",
      projects: [
        "Conducted security audits at Eminence Ways",
        "Developed secure browser with custom protocols",
        "Implemented encryption in sensitive applications",
        "Performed penetration testing on web applications"
      ]
    },
    {
      icon: Globe,
      title: "Mobile Development",
      description: "Expanded into iOS development with Swift",
      projects: [
        "Created currency recognition app for visually impaired",
        "Developed campus safety application",
        "Built battery life tracking application",
        "Implemented ML models in mobile environment"
      ]
    },
    {
      icon: Terminal,
      title: "Innovation",
      description: "Using creativity to build solutions",
      projects: [
        "Took inspiration from problems around me and curated solutions to solve them like browser",
        "Created different tools to help rural Nepal connect to tech",
        "Built websites, apps that makes daily life simpler",
      ]
    }
  ];

  // Experience Data
  const experiences = [
    {
      title: "Researcher",
      company: "Villanova University",
      location: "Villanova, PA, USA",
      date: "May 2024 - Aug 2024",
      description: "Developed CNN models for currency bill recognition",
      achievements: [
        "Achieved 90% accuracy on 50,000-image test set while reducing training time by 60%",
        "Implemented transfer learning with ResNet50, VGG16, and Inception-v3",
        "Optimized model performance through 10 image augmentation techniques",
        "Reduced overfitting by 40% and improved validation accuracy",
        "Created diverse dataset of 50,000+ currency images from 25 countries",
        "Developed accessible iOS application with multi-language voice feedback"
      ]
    },
   
    {
      title: "Software Developer and Penetration Tester",
      company: "Eminence Ways",
      location: "Kathmandu, Nepal",
      date: "Oct 2021 - Jul 2022",
      description: "Full-stack development and security testing",
      achievements: [
        "Developed audit and asset management systems using Django",
        "Conducted security testing on mobile and web applications",
        "Delivered 30+ cybersecurity awareness sessions",
        "Identified and documented application vulnerabilities"
      ]
    },
  
    {
      title: "Tech Instructor and Program Manager",
      company: "Building 21",
      location: "Philadelphia, PA, USA",
      date: "Jun 2023 - Aug 2023",
      description: "Led technology education programs",
      achievements: [
        "Instructed Python programming to 50+ underprivileged students",
        "Achieved 100% course completion rate",
        "Led 'Launchpad' program for high school students",
        "100% of participants reported increased interest in technology fields"
      ]
    },
    {
      title: "IT Technician",
      company: "Villanova University",
      location: "Villanova, PA, USA",
      date: "Oct 2022 - Present",
      description: "Provide technical support for classroom technologies",
      achievements: [
        "Program and troubleshoot touchpanels and audiovisual equipment",
        "Assist professors in resolving technical issues",
        "Ensure smooth integration of technology in educational settings",
        "Enhance overall teaching and learning experience"
      ]
    },
    {
      title: "Lead Developer",
      company: "Hack Nepal",
      location: "Kathmandu, Nepal",
      date: "Jun 2021 - Apr 2024",
      description: "Developed secure browser solution (PYsecure)",
      achievements: [
        "Engineered advanced API for seamless server-browser communication",
        "Developed secure web testing and browsing solution using Python",
      ]
    },
    {
      title: "Match Researcher",
      company: "Villanova University",
      location: "Villanova, PA, USA",
      date: "Feb 2023 - Aug 2023",
      description: "Researched dataset image redundancy reduction",
      achievements: [
        "Developed Python-based automated tools for image recognition efficiency",
        "Enhanced image recognition accuracy through redundancy elimination",
        "Improved effectiveness of data-driven applications"
      ]
    },
   
  ];
  

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-white z-50"
        style={{ scaleX: scrollYProgress }}
        transformOrigin="left"
      />
      {/* Hero Section */}
      
      <section 
        id="hero"
        ref={heroRef}
        className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 text-white"
      >
        {/* Background animated circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute w-[1200px] h-[1200px] rounded-full border-2 border-white/5 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute w-[900px] h-[900px] rounded-full border-2 border-white/10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute w-[600px] h-[600px] rounded-full border-2 border-white/15 left-1/2 top-1/2 -translate-x-1/2 -translate-1/2"
            />
          </div>
  
          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto h-screen flex flex-col items-center justify-center px-8">
            {/* Projects Orbit */}
  
              {/* Center Content */}
              <div className="relative z-20 text-center space-y-8">
              <WordCloud /> 

              
                
                <motion.p
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-xl max-w-2xl mx-auto"
                >
                  Passionate about building technology that better lives, combining my love for AI/ML and software development to turn creative ideas into real solutions.
                </motion.p>
                <motion.p
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-xl max-w-2xl mx-auto"
                >
                  Click My Story to see my journey of learning and growing or scroll down to see my projects, experiences, and skills. 
                </motion.p>
  
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex justify-center gap-4 flex-wrap"
                >
                  <a 
                    href="https://github.com/swopnil" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <GithubIcon size={24} />
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/swopnil-panday-6b582b257/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <LinkedinIcon size={24} />
                  </a>
                  <a 
                    href="mailto:spanday@villanova.edu" 
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <Mail size={24} />
                  </a>
                  <a 
                    href="Resumeintern.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Download size={20} />
                    Resume
                  </a>
                  <button
                    onClick={() => navigate('/my-story')}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    My Story
                  </button>
                </motion.div>
              </div>
          </div>
  
          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <p className="text-sm font-light">Scroll to explore</p>
            <motion.div
              className="w-6 h-10 border-2 border-white rounded-full p-2"
              initial={{ y: 0 }}
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </motion.div>
          </motion.div>
        </section>
  
         {/* Skills Section */}
         <section 
        id="skills"
        className={`min-h-screen py-20 px-8 bg-gradient-to-br ${gradients.first}`}
      >        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 text-white"
          >
            <h2 className="text-5xl font-bold mb-4">Technical Journey</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              My path through technology has been driven by curiosity and real-world problem solving.
              Each skill was learned through hands-on projects and practical applications.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-white"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-white/20 text-white">
                    <skill.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{skill.title}</h3>
                    <p className="opacity-90 mb-4">{skill.description}</p>
                    <div className="space-y-2">
                      {skill.projects.map((project, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-white/60 mt-2" />
                          <p className="opacity-90">{project}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className={`min-h-screen py-20 px-8 bg-gradient-to-br ${gradients.second}`}>
        <div className="max-w-6xl mx-auto text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Book className="w-16 h-16 mb-4 mx-auto" />
            <h2 className="text-5xl font-bold">Education</h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-8"
          >
            <h3 className="text-2xl font-bold">Villanova University</h3>
            <p className="opacity-90">Bachelor of Science in Computer Science, Minor in Mathematics</p>
            <p className="opacity-90">Aug. 2022 – May 2026</p>
            <div className="mt-4">
              <p className="font-semibold">GPA: 3.81/4.0</p>
              <p className="text-white/90">Villanova Presidential Scholar (Top 25 from 1600 students)</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-8"
          >
            <h3 className="text-2xl font-bold">Little Angels' Cambridge School</h3>
            <p className="opacity-90">Cambridge GCE A-LEVELS</p>
            <p className="opacity-90">May. 2019 – Aug 2021</p>
            <div className="mt-4">
              <p className="font-semibold">Grades: A*,A,A</p>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Projects Section */}
       {/* Projects Section */}
       <section 
        id="projects"
        className={`min-h-screen py-20 px-8 bg-gradient-to-br ${gradients.third}`}
      >        <div className="max-w-6xl mx-auto text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Code className="w-16 h-16 mb-4 mx-auto" />
            <h2 className="text-5xl font-bold">Projects</h2>
          </motion.div>

          <div className="space-y-32">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`flex flex-col md:flex-row items-center gap-20 ${
                  index % 2 === 0 ? '' : 'md:flex-row-reverse'
                }`}
              >
                <div className="flex-1 space-y-6 max-w-xl">
                  <h3 className="text-3xl font-bold">{project.title}</h3>
                  <p className="opacity-90 text-lg">{project.description}</p>
                  <div className="flex flex-wrap gap-3">
                    {project.tech.map((tech, i) => (
                      <span key={i} className="bg-white/10 backdrop-blur-lg px-4 py-2 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-1 flex items-center justify-center w-full">
                  <div className="w-full h-[32rem] relative overflow-hidden rounded-xl shadow-2xl group">
                    <img 
                      src={project.image}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-contain scale-75 transform transition-all duration-500 group-hover:scale-85" 
                      // Changed to object-contain and added initial scale-75
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Experience Section */}
      <section 
        id="experience"
        className={`min-h-screen py-20 px-8 bg-gradient-to-br ${gradients.fourth}`}
      >

        <div className="max-w-6xl mx-auto text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Briefcase className="w-16 h-16 mb-4 mx-auto" />
            <h2 className="text-5xl font-bold">Experience</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {experiences.map((experience, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-8"
              >
                <h3 className="text-2xl font-bold">{experience.title}</h3>
                <p className="text-lg opacity-90">{experience.company}</p>
                <p className="opacity-75 mb-4">{experience.date}</p>
                <p className="opacity-90 mb-4">{experience.description}</p>
                <ul className="space-y-2">
                  {experience.achievements.map((achievement, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-white/60 mt-2" />
                      <p className="opacity-90">{achievement}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      </div>
    );
  };
  
  export default Home;