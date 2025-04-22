import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter, FaInfoCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiUrl = import.meta.env.VITE_API_URL;

const Contact = () => {
  const [contact, setContact] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    axios.get(`${apiUrl}api/v1/contact/contact-info`).then((res) => {
      setContact(res.data);
    });
  }, []);

  const isSubmitDisabled = !phone || !email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${apiUrl}api/v1/contact`, {
        name,
        email,
        phone,
        message,
      });

      if (response.status === 201) {
        toast.success('Message sent successfully!');
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to send message. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!contact) return <div className="text-center mt-10 text-gray-600">Loading...</div>;

  return (
    <div className="bg-gradient-to-br  py-16">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <h2 className="text-4xl font-extrabold text-center text-cyan-500 mb-12">Contact Us</h2>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="bg-gray-700 shadow-xl rounded-2xl p-8 space-y-6">
            <h3 className="text-2xl font-semibold text-gray-100 mb-6 flex items-center space-x-2">
              <FaInfoCircle className="text-indigo-500" />
              <span>Get in Touch</span>
            </h3>

            <div className="space-y-4 text-gray-100">
              <p className="flex items-center space-x-2">
                <FaPhone className="text-green-500" />
                <strong>Phone:</strong> {contact.phone}
              </p>
              <p className="flex items-center space-x-2">
                <FaEnvelope className="text-yellow-500" />
                <strong>Email:</strong> {contact.email}
              </p>
              <p className="flex items-center space-x-2">
                <FaMapMarkerAlt className="text-red-500" />
                <strong>Address:</strong> {contact.address}
              </p>

              {contact.facebook && (
                <p className="flex items-center space-x-2">
                  <FaFacebook className="text-blue-600" />
                  <strong>Facebook:</strong>{' '}
                  <a
                    href={contact.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    {contact.facebook}
                  </a>
                </p>
              )}

              {contact.instagram && (
                <p className="flex items-center space-x-2">
                  <FaInstagram className="text-pink-500" />
                  <strong>Instagram:</strong>{' '}
                  <a
                    href={contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-500 underline hover:text-pink-700"
                  >
                    {contact.instagram}
                  </a>
                </p>
              )}

              {contact.Twitter && (
                <p className="flex items-center space-x-2">
                  <FaTwitter className="text-blue-400" />
                  <strong>Twitter/X:</strong>{' '}
                  <a
                    href={contact.Twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline hover:text-blue-600"
                  >
                    {contact.Twitter}
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-700 shadow-xl rounded-2xl p-8 space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
              <FaEnvelope className="text-indigo-500" />
              <span className='text-gray-100'>Send us a Message</span>
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-100 text-sm font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-100 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-gray-100 text-sm font-bold mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-100 text-sm font-bold mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>
              <button
                type="submit"
                className={`bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                  isSubmitDisabled || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isSubmitDisabled || isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Map Embed */}
          <div className="overflow-hidden rounded-2xl shadow-xl md:col-span-2">
            {contact.mapEmbedLink ? (
              <iframe
                src={contact.mapEmbedLink}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-2xl"
                title="Google Map Location"
              ></iframe>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No map location provided.
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
    </div>
  );
};

export default Contact;