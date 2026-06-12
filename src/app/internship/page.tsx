'use client';

import React, { useState, useRef, useEffect } from 'react';
import Script from 'next/script';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function InternshipPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    college: '',
    course: '',
    current_semester: '',
    interested_roles: [] as string[]
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role: string) => {
    setFormData(prev => ({ ...prev, interested_roles: [role] }));
    setIsRoleDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Assuming admin.scriptnex.com is the backend domain
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://admin.scriptnex.com/api/v1';
      const response = await fetch(`${apiUrl}/internships`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message || 'Something went wrong. Please try again.');
      }

      const responseData = responseJson.data || {};

      if (!responseData.razorpay) {
        setSuccess(true);
        setFormData({
          name: '', email: '', phone: '', location: '',
          college: '', course: '', current_semester: '', interested_roles: []
        });
        setLoading(false);
        return;
      }

      const options = {
        key: responseData.razorpay.key,
        amount: responseData.razorpay.amount,
        currency: responseData.razorpay.currency,
        name: responseData.razorpay.name,
        description: responseData.razorpay.description,
        order_id: responseData.razorpay.order_id,
        prefill: responseData.razorpay.prefill,
        theme: {
          color: '#00d285'
        },
        handler: async function (paymentResponse: any) {
          try {
            const verifyRes = await fetch(`${apiUrl}/internships/${responseData.application.id}/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_signature: paymentResponse.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyData.message || 'Payment verification failed.');
            }

            setSuccess(true);
            setFormData({
              name: '', email: '', phone: '', location: '',
              college: '', course: '', current_semester: '', interested_roles: []
            });
          } catch (err: any) {
            setError(err.message || 'Payment verified but failed to update status.');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setError('Payment cancelled. Your application is saved but incomplete. Please contact support.');
            setLoading(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setError(response.error.description || 'Payment failed.');
        setLoading(false);
      });
      rzp.open();

    } catch (err: any) {
      setError(err.message || 'Failed to submit application.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-[#f8fafc] flex flex-col font-sans">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Navbar />
      <main className="flex-grow flex flex-col items-center py-12 md:py-20 px-4 sm:px-6 relative z-40">
        
        {/* Background glow effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#00d285] opacity-10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-blue-500 opacity-10 rounded-full blur-[150px]"></div>
        </div>

        <div className="max-w-3xl w-full mx-auto z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
              Join the ScriptNex Team
            </h1>
            <p className="text-lg md:text-xl text-[#ababab] leading-relaxed">
              We're looking for passionate interns to help us build the future of coding education. Apply below to start your journey.
            </p>
          </div>

          <div className="relative rounded-md p-[1px] bg-gradient-to-b from-[#2a2d35] to-transparent shadow-[0_0_40px_rgba(0,0,0,0.8)]">
            <div className="bg-[#15171c] rounded-md p-6 sm:p-8 md:p-12 relative z-20">
            {success ? (
              <div className="text-center py-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[rgba(0,210,133,0.1)] mb-6">
                  <svg className="w-8 h-8 text-[#00d285]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">Application Submitted!</h3>
                <p className="text-[#ababab] mb-8">
                  Thank you for applying. We will review your application and get back to you shortly.
                </p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2.5 bg-[#1e2128] border border-[#2a2d35] hover:border-[#00d285] rounded-sm transition-colors"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] text-red-500 px-4 py-3 rounded-sm text-sm">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#ababab] mb-2 uppercase tracking-wide">Full Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      required 
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-[#2a2d35] hover:border-[#3a3d45] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#00d285] focus:ring-1 focus:ring-[#00d285] transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#ababab] mb-2 uppercase tracking-wide">Email Address *</label>
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-[#2a2d35] hover:border-[#3a3d45] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#00d285] focus:ring-1 focus:ring-[#00d285] transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#ababab] mb-2 uppercase tracking-wide">Phone Number</label>
                    <input 
                      type="text" 
                      name="phone" 
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-[#2a2d35] hover:border-[#3a3d45] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#00d285] focus:ring-1 focus:ring-[#00d285] transition-all"
                      placeholder="+91 9999999999"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#ababab] mb-2 uppercase tracking-wide">Location *</label>
                    <input 
                      type="text" 
                      name="location" 
                      required
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-[#2a2d35] hover:border-[#3a3d45] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#00d285] focus:ring-1 focus:ring-[#00d285] transition-all"
                      placeholder="City, State"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#ababab] mb-2 uppercase tracking-wide">College / University *</label>
                    <input 
                      type="text" 
                      name="college" 
                      required
                      value={formData.college}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-[#2a2d35] hover:border-[#3a3d45] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#00d285] focus:ring-1 focus:ring-[#00d285] transition-all"
                      placeholder="State University"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#ababab] mb-2 uppercase tracking-wide">Course / Degree *</label>
                    <select
                      name="course"
                      required
                      value={formData.course}
                      onChange={handleChange as any}
                      className="w-full bg-black/40 border border-[#2a2d35] hover:border-[#3a3d45] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#00d285] focus:ring-1 focus:ring-[#00d285] transition-all appearance-none"
                    >
                      <option value="" disabled>Select your course</option>
                      <option value="B.Tech">B.Tech</option>
                      <option value="M.Tech">M.Tech</option>
                      <option value="BCA">BCA</option>
                      <option value="MCA">MCA</option>
                      <option value="B.Sc">B.Sc</option>
                      <option value="M.Sc">M.Sc</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#ababab] mb-2 uppercase tracking-wide">Current Semester *</label>
                    <select
                      name="current_semester"
                      required
                      value={formData.current_semester}
                      onChange={handleChange as any}
                      className="w-full bg-black/40 border border-[#2a2d35] hover:border-[#3a3d45] rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#00d285] focus:ring-1 focus:ring-[#00d285] transition-all appearance-none"
                    >
                      <option value="" disabled>Select your semester</option>
                      <option value="Semester 1">Semester 1</option>
                      <option value="Semester 2">Semester 2</option>
                      <option value="Semester 3">Semester 3</option>
                      <option value="Semester 4">Semester 4</option>
                      <option value="Semester 5">Semester 5</option>
                      <option value="Semester 6">Semester 6</option>
                      <option value="Semester 7">Semester 7</option>
                      <option value="Semester 8">Semester 8</option>
                    </select>
                  </div>
                </div>

                <div ref={dropdownRef} className="relative">
                  <label className="block text-sm font-medium text-[#ababab] mb-2 uppercase tracking-wide">Which domain(s) are you primarily interested in? *</label>
                  <button 
                    type="button" 
                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)} 
                    className={`w-full bg-black/40 border hover:border-[#3a3d45] ${isRoleDropdownOpen ? 'border-[#00d285]' : 'border-[#2a2d35]'} rounded-sm px-4 py-3 text-left text-white focus:outline-none focus:border-[#00d285] focus:ring-1 focus:ring-[#00d285] transition-all flex justify-between items-center`}
                  >
                    <span className="truncate mr-4">
                      {formData.interested_roles.length > 0 
                        ? formData.interested_roles[0] 
                        : <span className="text-gray-500">Select Domain...</span>}
                    </span>
                    <svg className={`w-5 h-5 text-[#ababab] transform transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                  {isRoleDropdownOpen && (
                    <div className="absolute z-[100] mt-2 w-full bg-[#15171c] border border-[#2a2d35] rounded-sm shadow-[0_10px_40px_rgba(0,0,0,0.8)] max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#2a2d35] [&::-webkit-scrollbar-thumb:hover]:bg-[#3a3d45] [&::-webkit-scrollbar-thumb]:rounded-full">
                      <div className="p-2 space-y-1">
                        {[
                          'Web Development',
                          'Data Analytics',
                          'Digital Marketing',
                          'UX/UI Design',
                          'Business Analytics',
                          'APP Development',
                          'React Js Development',
                          'Python Development',
                          'Java Developer',
                          'Graphic Design'
                        ].map(role => {
                          const isSelected = formData.interested_roles.includes(role);
                          return (
                            <div 
                              key={role} 
                              onClick={() => handleRoleChange(role)}
                              className={`flex items-center justify-between px-3 py-2.5 rounded-md cursor-pointer transition-colors group ${isSelected ? 'bg-[rgba(0,210,133,0.1)]' : 'hover:bg-[#1e2128]'}`}
                            >
                              <span className={`text-sm transition-colors ${isSelected ? 'text-[#00d285] font-medium' : 'text-[#f8fafc] group-hover:text-[#00d285]'}`}>{role}</span>
                              {isSelected && (
                                <svg className="w-4 h-4 text-[#00d285]" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full sm:w-auto bg-[#00d285] hover:bg-[#00e691] text-black font-semibold py-3 px-8 rounded-sm transition-all shadow-[0_4px_16px_rgba(0,210,133,0.25)] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                </div>
              </form>
            )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
