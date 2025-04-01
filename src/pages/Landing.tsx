
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-primary font-bold text-xl">DesignSwipe</span>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <Link to="/dashboard">
                <Button className="bg-primary hover:bg-primary-dark">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary">
                  Login
                </Link>
                <Link to="/register">
                  <Button className="bg-primary hover:bg-primary-dark">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-50 to-indigo-50 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Connect with designers through simple swipes
              </h1>
              <p className="mt-6 text-xl text-gray-600">
                No portfolios. No proposals. Just fast, reliable design work that gets the job done.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button className="w-full sm:w-auto text-md px-8 py-3 bg-primary hover:bg-primary-dark">
                    Get Started
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button variant="outline" className="w-full sm:w-auto text-md px-8 py-3">
                    How It Works
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://placehold.co/600x400/7C3AED/FFFFFF/png?text=DesignSwipe" 
                alt="DesignSwipe illustration" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-16 bg-white" id="how-it-works">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">How DesignSwipe Works</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                A simple process to connect clients with talented designers
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-primary text-xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Post a Task</h3>
                <p className="mt-2 text-gray-600">
                  Clients post design tasks with clear requirements, set a budget, and deadline.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-primary text-xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Designers Swipe</h3>
                <p className="mt-2 text-gray-600">
                  Designers browse tasks and swipe right to accept projects they're interested in.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-primary text-xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Safe Payments</h3>
                <p className="mt-2 text-gray-600">
                  Funds are held in escrow and automatically released when work is completed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* For Designers */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-medium">For Designers</span>
              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                Focus on your skills, not on pitching
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                No more lengthy proposals or portfolio reviews. Browse available tasks, swipe right on those that match your skills, and start earning right away.
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-600">Simple swipe interface to accept tasks</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-600">Clear project requirements and deadlines</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-600">Automatic payments after job approval</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link to="/register">
                  <Button className="bg-primary hover:bg-primary-dark">
                    Sign up as a Designer
                  </Button>
                </Link>
              </div>
            </div>
            <div className="order-first md:order-last">
              <img 
                src="https://placehold.co/600x400/F1F5F9/1E293B/png?text=For+Designers" 
                alt="Designer illustration" 
                className="rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* For Clients */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="hidden md:block">
              <img 
                src="https://placehold.co/600x400/F1F5F9/1E293B/png?text=For+Clients" 
                alt="Client illustration" 
                className="rounded-lg"
              />
            </div>
            <div>
              <span className="text-primary font-medium">For Clients</span>
              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                Get design work done quickly and efficiently
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Post your design tasks with clear requirements and budget. Our platform matches you with skilled designers ready to tackle your project.
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-600">Structured briefs for clear communication</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-600">Safe escrow payments with auto-release</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-600">Simple thumbs-up/down rating system</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link to="/register">
                  <Button className="bg-primary hover:bg-primary-dark">
                    Sign up as a Client
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary py-12">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white">Ready to get started?</h2>
            <p className="mt-4 text-xl text-primary-foreground max-w-3xl mx-auto">
              Join DesignSwipe today and experience a better way to connect designers with clients.
            </p>
            <div className="mt-10">
              <Link to="/register">
                <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg">
                  Create Your Account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">DesignSwipe</h3>
              <p className="text-gray-400">
                Connecting designers with clients through a simple swipe interface.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Designers</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">How it Works</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Find Tasks</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Payment System</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Clients</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Post a Task</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">How to Create Briefs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Escrow System</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© {new Date().getFullYear()} DesignSwipe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
