import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  DollarSign, 
  Calendar, 
  ShoppingCart, 
  Shield, 
  Users, 
  TrendingUp, 
  Clock,
  BarChart3,
  MessageSquare,
  CheckCircle,
  X
} from 'lucide-react';

function App() {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handleReleaseShifts = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-teal-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-down">
          <CheckCircle className="w-5 h-5" />
          <span>Broadcast sent to opted-in employees.</span>
          <button onClick={() => setShowToast(false)} className="ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="font-bold text-2xl text-teal-600">
              Zooni
            </div>
            <button 
              onClick={() => scrollToSection('manager-dashboard')}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              Manager Dashboard
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Private money help + extra shifts, over SMS.
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Text SHORT to get wages early, request extra shifts, or claim everyday perks—totally private. 
                  Managers only see aggregates.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
                    Text SHORT
                  </button>
                  <button 
                    onClick={() => scrollToSection('manager-dashboard')}
                    className="border-2 border-teal-600 text-teal-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-teal-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                  >
                    See Manager Dashboard
                  </button>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="w-96 h-96 bg-gradient-to-br from-teal-100 to-orange-100 rounded-3xl flex items-center justify-center">
                    <div className="w-64 h-64 bg-gradient-to-br from-teal-200 to-orange-200 rounded-2xl flex items-center justify-center">
                      <MessageSquare className="w-24 h-24 text-teal-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Employee Options Cards */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Three ways to get help
              </h2>
              <p className="text-xl text-gray-600">
                All completely private to you
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Card A - EWA */}
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow relative">
                <div className="absolute top-4 right-4 bg-teal-100 text-teal-800 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Private to you
                </div>
                <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                  <DollarSign className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Get wages now
                </h3>
                <p className="text-gray-600 mb-6">
                  Access earned wages instantly when you need them most. No credit checks, no interest.
                </p>
                <a 
                  href="/#ewa" 
                  className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                >
                  Open EWA
                </a>
              </div>

              {/* Card B - Shifts */}
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow relative">
                <div className="absolute top-4 right-4 bg-teal-100 text-teal-800 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Private to you
                </div>
                <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                  <Calendar className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Request extra shifts
                </h3>
                <p className="text-gray-600 mb-6">
                  Pick up additional hours when available. Get notified about opportunities that fit your schedule.
                </p>
                <a 
                  href="/#shifts" 
                  className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  View Shifts
                </a>
              </div>

              {/* Card C - Perks */}
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow relative">
                <div className="absolute top-4 right-4 bg-teal-100 text-teal-800 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Private to you
                </div>
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                  <ShoppingCart className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Save on essentials
                </h3>
                <p className="text-gray-600 mb-6">
                  Claim percentage off everyday purchases through Perks. Groceries, gas, prescriptions and more.
                </p>
                <a 
                  href="/#perks" 
                  className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Open Perks
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Manager Dashboard Preview */}
        <section id="manager-dashboard" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Manager Dashboard Preview
              </h2>
              <p className="text-xl text-gray-600">
                Aggregates only. No personal financial info.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-teal-600 mb-2">32%</div>
                  <div className="text-sm font-medium text-gray-600">Financial Stress Index</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">127</div>
                  <div className="text-sm font-medium text-gray-600">SHORT events (WTD)</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-teal-600 mb-2">89</div>
                  <div className="text-sm font-medium text-gray-600">EWA clicks</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">24</div>
                  <div className="text-sm font-medium text-gray-600">Shift requests</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">156</div>
                  <div className="text-sm font-medium text-gray-600">Perks clicks</div>
                </div>
              </div>

              {/* Chart Placeholder */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">7-Day Trend</h3>
                <div className="bg-gray-50 rounded-xl p-6 h-64 flex items-center justify-center">
                  <div className="flex items-end justify-center gap-2 w-full max-w-md">
                    {[40, 65, 45, 80, 60, 85, 70].map((height, index) => (
                      <div
                        key={index}
                        className="bg-teal-400 rounded-t"
                        style={{ height: `${height}%`, width: '12%' }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-gray-100">
                <button 
                  onClick={handleReleaseShifts}
                  className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                >
                  Release more shifts
                </button>
                <p className="text-sm text-gray-500">
                  Aggregates only. No personal financial info.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                How it works
              </h2>
              <p className="text-xl text-gray-600">
                Three simple steps to get started
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Employee texts JOIN, then SHORT
                </h3>
                <p className="text-gray-600">
                  Simple SMS setup. No app downloads or complex registration required.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Receives 3 options privately
                </h3>
                <p className="text-gray-600">
                  Instant access to wages, shifts, and perks—completely confidential to the employee.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Manager sees anonymous trends
                </h3>
                <p className="text-gray-600">
                  Dashboard shows aggregate data only. Managers can open more shifts based on demand.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  question: "What data do managers see?",
                  answer: "Aggregates only, never individual finances. Managers see overall trends like how many employees used EWA this week or requested extra shifts, but never personal financial details or who specifically made requests."
                },
                {
                  question: "Do I need an app?",
                  answer: "No. SMS only. Everything works through simple text messages. No app downloads, no passwords to remember, no complex setup required."
                },
                {
                  question: "What are Perks?",
                  answer: "Discounts on essentials like groceries, gas, and prescriptions. Access deals at major retailers and service providers to help stretch your paycheck further."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-inset rounded-xl"
                    aria-expanded={activeAccordion === index}
                  >
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    {activeAccordion === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {activeAccordion === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="font-bold text-xl text-teal-400">Zooni</div>
              <span className="text-gray-400">© 2025 Zooni</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;