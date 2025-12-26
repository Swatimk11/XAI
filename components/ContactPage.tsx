
import React, { useState } from 'react';

const CONTACT_CONFIG = {
  SERVICE_ID: 'service_rgkycbp',
  TEMPLATE_ID: 'template_6wpakjm',
  PUBLIC_KEY: 'F6B6LqAWVBoxhnITi'
};

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = {
      service_id: CONTACT_CONFIG.SERVICE_ID,
      template_id: CONTACT_CONFIG.TEMPLATE_ID,
      user_id: CONTACT_CONFIG.PUBLIC_KEY,
      template_params: {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
      },
    };

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const errText = await response.text();
        throw new Error(errText || 'Failed to send message');
      }
    } catch (err: any) {
      console.error('EmailJS Error:', err);
      setError('Could not deliver message. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex-grow flex justify-center items-center p-6 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-700">
        <div className="grid md:grid-cols-5 h-full">
          {/* Info Side */}
          <div className="md:col-span-2 bg-slate-900 dark:bg-slate-800 p-10 text-white flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-black mb-6 tracking-tight">Clinical Support</h2>
              <p className="text-slate-400 font-medium leading-relaxed mb-10">
                Our team of AI engineers and medical consultants are ready to assist with integration, audits, and training.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-rose-600/20 rounded-xl text-rose-500">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Email Us</h4>
                    <p className="text-sm text-slate-400">support@xaiplatform.org</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-rose-600/20 rounded-xl text-rose-500">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Headquarters</h4>
                    <p className="text-sm text-slate-400">Mangalore Innovation Hub, KA</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-10 flex space-x-4">
               <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors cursor-pointer">
                 <span className="text-xs font-black">X</span>
               </div>
               <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors cursor-pointer">
                 <span className="text-xs font-black">LN</span>
               </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="md:col-span-3 p-10 bg-white dark:bg-slate-900">
            {isSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Message Delivered</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">Thank you for your inquiry. A clinical representative will contact you within 24 business hours.</p>
                <button onClick={() => setIsSubmitted(false)} className="mt-8 text-rose-600 font-bold hover:underline underline-offset-4">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-bold border border-rose-100 dark:border-rose-800">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Dr. Jane Smith" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 transition-all dark:text-white outline-none" required/>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="jane@hospital.com" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 transition-all dark:text-white outline-none" required/>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Inquiry Subject</label>
                  <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Integration Support / Model Audit" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 transition-all dark:text-white outline-none" required/>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Message Body</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows={5} placeholder="Describe your request..." className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 transition-all dark:text-white outline-none resize-none" required></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 dark:bg-rose-600 text-white font-bold py-5 rounded-2xl transition-all shadow-xl hover:opacity-90 active:scale-95 focus:ring-4 focus:ring-rose-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Deliver Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
