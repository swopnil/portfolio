import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = location.pathname === '/my-story' 
    ? [
        { name: 'Home', to: '/', isRoute: true },
        { name: 'My Story', to: '/my-story' }

      ]
    : [
        { name: 'Home', to: 'hero' },
        { name: 'My Story', to: '/my-story', isRoute: true },
        { name: 'Skills', to: 'skills' },
        { name: 'Projects', to: 'projects' },
        { name: 'Experience', to: 'experience' }
      ];

  const isActive = (item) => {
    if (item.isRoute) {
      return location.pathname === item.to;
    }
    return activeSection === item.to;
  };

  const getLinkClasses = (item) => {
    const baseClasses = 'cursor-pointer transition-colors duration-300';
    const activeClasses = 'text-white font-medium';
    const inactiveClasses = 'text-white/80 hover:text-white';
    return `${baseClasses} ${isActive(item) ? activeClasses : inactiveClasses}`;
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-gradient-to-br from-blue-600 to-purple-600"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-xl font-bold text-white">SP</Link>
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                item.isRoute ? (
                  <Link
                    key={item.name}
                    to={item.to}
                    className={getLinkClasses(item)}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <ScrollLink
                    key={item.name}
                    to={item.to}
                    spy={true}
                    smooth={true}
                    offset={-64}
                    duration={500}
                    onSetActive={() => setActiveSection(item.to)}
                    className={getLinkClasses(item)}
                  >
                    {item.name}
                  </ScrollLink>
                )
              ))}
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-br from-blue-600 to-purple-600"
            >
              <div className="flex flex-col p-4 space-y-4">
                {navItems.map((item) => (
                  item.isRoute ? (
                    <Link
                      key={item.name}
                      to={item.to}
                      className={getLinkClasses(item)}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <ScrollLink
                      key={item.name}
                      to={item.to}
                      spy={true}
                      smooth={true}
                      offset={-64}
                      duration={500}
                      onSetActive={() => setActiveSection(item.to)}
                      className={getLinkClasses(item)}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </ScrollLink>
                  )
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;