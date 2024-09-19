import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, CheckCircle, Share2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

export default function Home() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);
  const handleLogin = () => {
    loginWithRedirect();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-2"
        >
          <Pencil className="h-8 w-8 text-purple-600" />
          <span className="text-2xl font-bold text-purple-600">Jot Down</span>
        </motion.div>
        <div className="hidden md:block">
          <Button
            onClick={handleLogin}
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Login
          </Button>
        </div>
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </Button>
        </div>
      </header>

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white shadow-lg p-4"
        >
          <Button
            onClick={handleLogin}
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-white w-full"
          >
            Login
          </Button>
        </motion.div>
      )}

      <main>
        <section className="container mx-auto px-4 py-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Capture Your Thoughts <br /> Anytime, Anywhere
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl mb-8 text-gray-600"
          >
            Jot Down is your digital notebook for quick notes and brilliant
            ideas.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button
              onClick={handleLogin}
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Get Started for Free
            </Button>
          </motion.div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Pencil className="h-12 w-12 text-purple-600" />,
                title: "Quick Notes",
                description: "Jot down your thoughts in seconds",
              },
              {
                icon: <CheckCircle className="h-12 w-12 text-purple-600" />,
                title: "Task Lists",
                description: "Stay organized with simple to-do lists",
              },
              {
                icon: <Share2 className="h-12 w-12 text-purple-600" />,
                title: "Easy Sharing",
                description: "Collaborate with friends and colleagues",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-20 bg-purple-100 rounded-lg">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="bg-white rounded-full p-4 inline-block mb-4">
                <Smartphone className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                1. Open the Web App
              </h3>
              <p className="text-gray-600">Access Jot Down on any device</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-white rounded-full p-4 inline-block mb-4">
                <Pencil className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Write Your Note</h3>
              <p className="text-gray-600">Quickly jot down your thoughts</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center"
            >
              <div className="bg-white rounded-full p-4 inline-block mb-4">
                <CheckCircle className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Save and Sync</h3>
              <p className="text-gray-600">
                Your notes are saved and synced automatically
              </p>
            </motion.div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto"
          >
            <p className="text-lg mb-4">
              "Jot Down has revolutionized the way I take notes. It's simple,
              fast, and always there when I need it. I can't imagine going back
              to traditional note-taking methods!"
            </p>
            <p className="font-semibold">- Sarah Johnson, Freelance Writer</p>
          </motion.div>
        </section>
      </main>

      <footer className="bg-purple-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">Jot Down</h3>
              <p className="text-lg">
                Your digital notebook for quick notes and brilliant ideas.
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-purple-300 text-lg">
                Terms
              </a>
              <a href="#" className="hover:text-purple-300 text-lg">
                Privacy
              </a>
            </div>
          </div>
          <div className="text-center mt-8">
            <p className="text-lg">© 2024 Jot Down. All rights reserved.</p>
            <p className="mt-2 text-lg">
              Made with <span className="text-red-500">🤍</span> by
              <a href="https://github.com/bsayak03"> Sayak Bhattacharya</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
