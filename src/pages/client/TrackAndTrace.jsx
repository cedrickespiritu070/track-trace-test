import React, { useState, useRef } from 'react';
import Logo from '../../assets/truck-logo.png';
import bg from '../../assets/loginBG.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const TrackAndTrace = () => {
  const [query, setQuery] = useState('');
  const [showFAQ, setShowFAQ] = useState(false); // Initially set to false
  const [activeIndex, setActiveIndex] = useState(null);
  const faqRef = useRef(null);
  const navigate = useNavigate();

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

  const handleSearch = (e) => {
    e.preventDefault();

    if (!query.trim()) {
        toast.error("Invalid tracking number. Please enter a valid tracking number.", {
          position: 'top-right',
          style: { margin: "0 auto", maxWidth: "90vw" },
        });
      return;
    }

    const isValidTracking = /^[A-Z0-9]{3,}$/.test(query);
    if (!isValidTracking) {
      toast.error("Invalid tracking format. Make sure it includes letters and numbers!", { 
        position: 'top-right',
        style: { margin: "0 auto", maxWidth: "90vw" },
      });
      return;
    }

    console.log('Searching for:', query);
    navigate(`/tracking/${query}`);
  };
  const goToFAQ = () => {
    setShowFAQ(true);
    if (faqRef.current) {
      const faqPosition = faqRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: faqPosition,
        behavior: 'smooth',
      });
    }
  };
  

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index); // Toggle FAQ accordion
  };

  return (
    <>
      <section
        id="track"
        className="relative flex flex-col justify-center py-8 md:p-[50px]"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-white opacity-[.9]"></div>
        <div className="relative flex flex-col min-h-[90vh] max-w-screen-2xl mx-auto">
          <div className="flex justify-center mb-10">
            <h1 className="font-poppins text-blue text-[30px] sm:text-[40px] md:text-[50px] font-semibold text-center">
              TRACK AND TRACE
            </h1>
          </div>
          <div className="flex flex-col items-center md:flex-row md:items-center justify-center">
            <div className="flex flex-col justify-center sm:flex-col items-center w-full md:w-[50%]">
              <h1 className="font-poppins text-blue text-[16px] sm:text-[30px] font-semibold text-center">
                Track your Shipment
              </h1>
              <div className="flex justify-center flex-col w-full px-[50px]">
                <form onSubmit={handleSearch} className="flex justify-center w-auto mb-5">
                  <input
                    type="text"
                    placeholder="Tracking No."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="border border-gray-300 p-2 flex-grow rounded-l-md focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-[#d6d33c] p-2 px-5 rounded-r-md text-blue font-normal font-poppins hover:bg-blue hover:text-yellow focus:outline-none"
                  >
                    <i className="fas fa-search mr-2"></i>
                    Search
                  </button>
                </form>
              </div>
              <div className="flex justify-center">
                <p
                  onClick={goToFAQ}
                  className="font-poppins text-blue text-[14px] sm:text-[14px] md:text-[14px] font-normal text-center hover:text-yellow cursor-pointer"
                >
                  Having Trouble? Contact Us Now!
                </p>
              </div>
            </div>
            <div className="flex justify-center w-1/2">
              <img src={Logo} alt="Your Logo" className="w-[490px] h-auto" />
            </div>
          </div>
          <div className="flex justify-center">
            <p className="font-poppins text-black text-[18px] sm:text-[14px] md:text-[20px] font-normal text-center mt-10 w-4/5">
              Please ensure you enter the correct tracking number provided to you. It
              typically consists of letters and numbers (e.g., ABC123456789). If your
              tracking number is not recognized, double-check for any typos.
            </p>
          </div>

          {/* Card Section */}
          <div className='flex flex-col text-center md:flex-row justify-center gap-[3rem] mt-10'>
            <div className='flex flex-col justify-center items-center p-5 bg-[#DDDDDD] rounded-md hover:bg-blue hover:text-white'>
              <i className="fas fa-search text-[70px] mb-3"></i> 
              <p className='text-[18px] font-poppins font-bold'>Track Your Shipment</p>
              <p className='text-[12px] font-poppins font-normal text-center'>
                Stay updated with real-time tracking of your shipments. Enter your tracking number to see the current status and location of your package.
              </p>
            </div>
            <div className='flex flex-col justify-center items-center p-5 bg-[#DDDDDD] rounded-md hover:bg-blue hover:text-white'>
              <i className="fas fa-truck text-[70px] mb-3"></i> 
              <p className='text-[18px] font-poppins font-bold'>Create a Shipment</p>
              <p className='text-[12px] font-poppins font-normal text-center'>
                Easily create and manage your shipments. Fill out the required details and get started with hassle-free shipping today.
              </p>
            </div>
            <div className='flex flex-col justify-center items-center p-5 bg-[#DDDDDD] rounded-md hover:bg-blue hover:text-white'>
              <i className="fas fa-headset text-[70px] mb-3"></i> 
              <p className='text-[18px] font-poppins font-bold'>Connect With Us</p>
              <p className='text-[12px] font-poppins font-normal text-center'>
                Have questions? Reach out to us through our contact page or follow us on social media for the latest updates and promotions.
              </p>
            </div>
            <div onClick={goToFAQ} className='flex flex-col justify-center items-center p-5 bg-[#DDDDDD] rounded-md hover:bg-blue hover:text-white cursor-pointer'>
              <i className="fas fa-envelope text-[70px] mb-3"></i> 
              <p className='text-[18px] font-poppins font-bold'>Support</p>
              <p className='text-[12px] font-poppins font-normal text-center'>
                Get assistance with any inquiries or issues you may have regarding your shipments. Our support team is here to help you 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Conditionally rendered based on showFAQ state */}
      {showFAQ && (
        <section ref={faqRef} id="faq" className="flex justify-center p-[50px] font-poppins">
          <div className="w-full max-w-4xl shadow-xl p-10">
            <div className="text-center mb-8">
              <h1 className="text-blue text-3xl sm:text-4xl font-bold">Frequently Asked Questions</h1>
            </div>

            <div className="flex flex-col">
              {faqs.map((faq, index) => (
                <div key={index} className="mb-4 border-b border-gray-300">
                  <div
                    className="flex justify-between items-center cursor-pointer p-4"
                    onClick={() => toggleFAQ(index)}
                  >
                    <h2 className="font-poppins font-semibold text-lg">{faq.question}</h2>
                    <i className={`fas ${activeIndex === index ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                  </div>
                  {activeIndex === index && (
                    <div className="p-4 text-gray-700">
                      <p className="font-poppins">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* <ToastContainer /> */}
    </>
  );
};

export default TrackAndTrace;
