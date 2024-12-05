import React, { useState } from 'react';
import bgImage from '../../assets/ContactUsBG.JPG';

const ClientFAQ = () => {
  // Set initial active index to 0 to keep the first question open
  const [activeIndex, setActiveIndex] = useState(0); 

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How can I track my order?",
      answer: "You’ll get an email or SMS with your tracking number. Check 'My Orders' in your account for updates."
    },
    {
      question: "I haven't received my tracking number. What should I do?",
      answer: "If you haven't received your tracking number, please contact our support team for assistance."
    },
    {
      question: "How long does it take for my order to arrive?",
      answer: "Order delivery time depends on your location and the shipping method chosen at checkout."
    },
    {
      question: "What should I do if my order is delayed or lost?",
      answer: "Please reach out to our support team to investigate the issue and resolve it promptly."
    }
  ];

  return (
    <>
      <section
        id="hero"
        className="relative flex items-center justify-center h-[40vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 opacity-80 bg-[#0B2849]"></div> {/* Overlay */}
        <div className="container mx-auto text-center relative z-10">
          <h1 className="font-bold text-white text-4xl mt-5">
            Track and Trace
          </h1>
          <p className="text-white text-lg mt-2">
            Track your shipments in real-time for up-to-date information on their location and estimated delivery.
          </p>
        </div>
      </section>

      <section id="faq" className="flex justify-center p-[50px] font-poppins">
        <div className="w-full max-w-4xl shadow-xl p-10">
          <div className="text-center mb-8">
            <h1 className="text-blue text-3xl sm:text-4xl font-bold">Frequently Asked Questions</h1>
          </div>

          {/* Flexbox for layout */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 md:space-x-8">
            <div className="w-full md:w-3/4 flex flex-col items-center gap-4">
              {faqs.map((faq, index) => (
                <div key={index} className="w-full border border-[#11487C] rounded-lg">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full text-left p-4 text-blue-700 font-semibold flex justify-between items-center"
                  >
                    {faq.question}
                    <span>{activeIndex === index ? '-' : '+'}</span>
                  </button>
                  {/* Keep the first question open by default */}
                  {activeIndex === index && (
                    <div className="p-4 border-t border-[#11487C] text-gray-700">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="w-full md:w-1/2 flex flex-col h-auto items-center justify-center p-8 border border-[#11487C] rounded-lg">
              <i className="fas fa-headset text-[40px] text-blue mr-2"></i>
              <h2 className="text-lg font-bold mb-4 text-center text-blue">Do you have more questions?</h2>
              <p className="text-center text-gray-600 mb-4">
                Feel free to reach out—We're here to help! Whether you need assistance or just have a quick question, don't hesitate to contact us.
              </p>
              <button className="bg-[#0b2849] text-white py-2 px-4 rounded-md">
                Contact Us Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ClientFAQ;
