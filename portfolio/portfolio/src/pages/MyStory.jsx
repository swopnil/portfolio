import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useInView } from 'framer-motion';

// Story Section Component
const StorySection = ({ story, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px 0px" });
  
  return (
    <motion.div
      ref={ref}
      className={`min-h-screen flex items-center ${index % 2 === 0 ? 'bg-gradient-to-br from-blue-600 to-purple-600' : 'bg-gradient-to-br from-purple-600 to-blue-600'}`}
    >
      <div className="max-w-7xl mx-auto px-8 py-20">
        <motion.div
          className={`flex items-center gap-16 ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}
          initial={{ opacity: 0, y: 100 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex-1 text-white space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl font-light"
            >
              {story.year}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl font-bold"
            >
              {story.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl leading-relaxed"
            >
              {story.description}
            </motion.p>
          </div>
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <img
              src={story.image}
              alt={story.title}
              className="rounded-2xl shadow-2xl w-full h-[600px] object-cover"
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const ProgressBar = ({ progress }) => {
  return (
    <motion.div 
      className="fixed top-0 left-0 right-0 h-1 bg-white z-50"
      style={{ scaleX: progress }}
      transformOrigin="left"
    />
  );
};

const ScrollIndicator = () => {
  return (
    <motion.div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 text-white flex flex-col items-center gap-2 z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 0.5, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <p className="text-sm font-light">Scroll to explore my journey</p>
      <motion.div
        className="w-6 h-10 border-2 border-white rounded-full p-2"
        initial={{ y: 0 }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-1.5 h-1.5 bg-white rounded-full" />
      </motion.div>
    </motion.div>
  );
};

const MyStory = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: containerRef });

  const timeline = [
    {
      year: "Early Years",
      title: "Early Years",
      description: "My journey began in the beautiful country of Nepal, where my early experiences would shape my future path. Growing up in a close social surrounding made me admire the concept of friendship, team, and respect.",
      image: "lap.jpeg"
    },
    {
      year: "Childhood",
      title: "First Spark of Technology",
      description: "My fascination with technology began with my father's Nokia phone, sparking a lifelong passion for innovation. A small gadget, but capability enough to make others view at magic. The phone introduced me to the tech world and sparked a curiosity to understand what is tech.",
      image: "nok.jpeg"
    },
    {
      year: "Grade 7",
      title: "Diving into Robotics",
      description: "Built my first projects including an obstacle-avoiding car and smart goggles for the visually impaired, along with creating my first webpages. These projects built with arduino, ultrasonic sensors made me realize how things connect together and create a product. Since, then I have not stopped building and innovating.",
      image: "bg.jpg",
      bgColor: "from-indigo-600 to-blue-600"
    },
    {
        year: "Grade 8",
        title: "Getting Competitive",
        description: "Started competing in various hackathon, debate competion, MUN's and got a passion to win. My first speech was about my nation, and as the topic was so easy for me, i was not ready to leave the mic. That day I knew I had to mold this voice into something useful.",
        image: "ss.jpg",
        bgColor: "from-indigo-600 to-blue-600"
      },
    {
      year: "Grade 9",
      title: "Head of Tech at Atharva",
      description: "Led technology initiatives at Atharva, promoting financial inclusion in rural Nepal through strategic consulting and community events. It was a startup but an idea to help rural Nepal flourish. My work on societal change started there. Helping change lives showed me the impact small help can have towards communities.",
      image: "ath.jpg",
      bgColor: "from-blue-600 to-cyan-600"
    },
    {
      year: "Grade 10",
      title: "Freelance Web Developer",
      description: "Started my entrepreneurial journey by creating and selling websites, gaining real-world experience in web development. It was all for some pocket money, but this got me experience in an early age. You might still find my grade 10 upwork profile, too dumb, but the energy was at its peak. Some of the people I knew were kind enough to give me some projects.",
      image: "web.png",
      bgColor: "from-cyan-600 to-teal-600"
    },
    {
      year: "Grade 11",
      title: "Founded HackNepal",
      description: "Launched HackNepal, a passion project dedicated to connecting rural Nepal with technology and bridging the digital divide. It was all about curating small solutions to make life easier. Like cattle tracker, water level measure e.t.c.",
      image: "sat.jpg",
      bgColor: "from-teal-600 to-green-600"
    },
    {
      year: "Grade 12",
      title: "Code to Grow Initiative",
      description: "Taught programming fundamentals to over 100 students, promoting tech inclusion among Nepal's youth through hands-on education. I started Code to Grow with single vision, to teach programming to those interested in learning but unable to because of lack of resources. I collected some of my friends and we started this venture together where we would teach programming to people willing to learn about tech. We taught to over hundred students on the journey and I still get messages from the students I taught back then about how helpful the program was to them.",
      image: "cg.png",
      bgColor: "from-green-600 to-emerald-600"
    },
    {
      year: "2021-2022",
      title: "Professional Development",
      description: "Joined Eminence Ways as a Software Developer, working on browser development, audit management systems, and cybersecurity testing. Eminence ways showed me how tech industry looks like. Here I was working with over twenty people on creating, securing sites. The mentorship and networking helped me learn a lot and showed me how to deploy solutions in real time.",
      image: "em.png",
      bgColor: "from-emerald-600 to-blue-600"
    },
    {
      year: "2022",
      title: "Villanova University",
      description: "Awarded the Presidential Scholar full-ride scholarship to Villanova University, marking the beginning of my academic journey in the US. It was always a goal to study in the US. The hardwork paid off and after countless rejections, I got in. ",
      image: "V.png",
      bgColor: "from-blue-600 to-violet-600"
    },
    {
      year: "2023",
      title: "Research and Community Impact",
      description: "Conducted research on image redundancy reducer algorithms at MATCH Research. Led the Summer at Launchpad initiative, teaching Python to underprivileged Philadelphia students. It was a small internship, but the people I met there, stories I created will always be memorable.",
      image: "laun.png",
      bgColor: "from-violet-600 to-purple-600"
    },
    {
      year: "2023-2024",
      title: "Currency Recognizer",
      description: "Created a CNN-based currency recognition app for the visually impaired. The app is able to detect currencies of over 20 countries. In the phase to launch it for social good.",
      image: "curr.png",
      bgColor: "from-purple-600 to-fuchsia-600"
    },
    {
      year: "2024",
      title: "Campus Safety Innovation",
      description: "Developed an AI-powered campus safety app featuring density tracking, safe path navigation, voice-activated emergency alerts, and a mental health chatbot.",
      image: "safety.jpeg",
      bgColor: "from-fuchsia-600 to-rose-600"
    },
    {
        year: "2024",
        title: "Innovative App",
        description: "Developed several innovative applications like battery optimizer, google drive batch uploader, and all to make life simpler.",
        image: "btt.PNG",
        bgColor: "from-fuchsia-600 to-rose-600"
      },

    {
      year: "Present",
      title: "Software Engineering Club",
      description: "Founded the Software Engineering Club at Villanova to help students develop practical tech skills and prepare for real-world challenges.",
      image: "vse.png",
      bgColor: "from-rose-600 to-blue-600"
    }
];

useEffect(() => {
  // Enable smooth scrolling for this page
  document.documentElement.style.scrollBehavior = 'smooth';
  return () => {
    document.documentElement.style.scrollBehavior = 'auto';
  };
}, []);

return (
  <div className="fixed inset-0 bg-black">
    <ProgressBar progress={scrollYProgress} />
    
    <div 
      ref={containerRef}
      className="h-screen overflow-y-auto"
    >
      {/* Header Section */}
      <motion.div 
        className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 text-white relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="text-center space-y-6 max-w-4xl px-8">
          <motion.h1 
            className="text-7xl font-bold"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            My Journey
          </motion.h1>
          <motion.p 
            className="text-2xl font-light"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            From Nepal to Villanova, a story of passion, technology, and impact
          </motion.p>
        </div>
        <ScrollIndicator />
      </motion.div>

      {/* Story Sections */}
      {timeline.map((story, index) => (
        <StorySection key={index} story={story} index={index} />
      ))}

      {/* Footer Section */}
      <motion.div 
        className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="text-center space-y-6 max-w-4xl px-8">
          <motion.h2 
            className="text-5xl font-bold"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            The Journey Continues
          </motion.h2>
          <motion.p 
            className="text-2xl font-light"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Building the future, one project at a time
          </motion.p>
          <motion.button
            onClick={() => window.history.back()}
            className="mt-8 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Back to Home
          </motion.button>
        </div>
      </motion.div>
    </div>
  </div>
);
};

export default MyStory;