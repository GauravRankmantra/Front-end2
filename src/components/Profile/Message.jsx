import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaEnvelope } from "react-icons/fa";
import Loading from "../Loading";
import { FiLoader, FiAlertTriangle } from "react-icons/fi";
import {
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiChevronDown,
  FiChevronUp,
  FiMessageSquare,
  FiUserCheck,
  FiX,
  FiSave,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { t } from "i18next";
const apiUrl = import.meta.env.VITE_API_URL;

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  ticketSubject,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-md transform transition-all  duration-300 scale-95 animate-modalEnter">
        <div className="flex flex-col items-center text-center">
          <FiAlertTriangle className="text-red-500 text-5xl mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">
            Confirm Deletion
          </h2>
          <p className="text-gray-300 mb-6">
            Are you sure you want to delete the ticket:{" "}
            <span className="font-semibold text-white">{ticketSubject}</span>?
            This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2 rounded-lg text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 flex items-center justify-center min-w-[100px]"
          >
            {isLoading ? (
              <FiLoader className="animate-spin text-xl" />
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const EditTicketModal = ({ isOpen, onClose, ticket, isLoading, onConfirm }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (ticket) {
      setSubject(ticket.subject || "");
      setMessage(ticket.message || "");
    }
  }, [ticket]);

  if (!isOpen || !ticket) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    onConfirm(subject, message);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex justify-center items-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-95 animate-modalEnter">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Edit Ticket</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <FiX size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="subject"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 placeholder-gray-400"
              placeholder="Enter ticket subject"
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="message"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              Message
            </label>
            <textarea
              id="message"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 placeholder-gray-400"
              placeholder="Describe the issue or request"
              required
            ></textarea>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-lg text-gray-300 bg-gray-600 hover:bg-gray-500 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 flex items-center justify-center min-w-[120px]"
            >
              {isLoading ? (
                <FiLoader className="animate-spin text-xl" />
              ) : (
                <>
                  <FiSave className="mr-2" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      {/* Animation helper (add to your global CSS or a style tag if not using a CSS animation library) */}

    </div>
  );
};

const Ticket = ({ ticket, onTicketDeleted, onEditTicket }) => {
  // Added onTicketDeleted and onEditTicket props
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // For expanding to see more details
  const [showEditModal, setShowEditModal] = useState(false); // State for edit modal
  const [isSaving, setIsSaving] = useState(false);
  const statusMeta = {
    pending: {
      color: "text-yellow-400 bg-yellow-900/50 border-yellow-700",
      icon: <FiClock className="mr-2" />,
      label: "Pending",
    },
    resolved: {
      color: "text-green-400 bg-green-900/50 border-green-700",
      icon: <FiCheckCircle className="mr-2" />,
      label: "Resolved",
    },
    rejected: {
      color: "text-red-400 bg-red-900/50 border-red-700",
      icon: <FiXCircle className="mr-2" />,
      label: "Rejected",
    },
  };

  const currentStatusMeta = statusMeta[ticket.status.toLowerCase()] || {
    color: "text-gray-400 bg-gray-700",
    icon: <FiClock className="mr-2" />,
    label: ticket.status,
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      // Simulate API call
      const del = await axios.delete(`${apiUrl}api/v1/ticket/${ticket._id}`);

      if (onTicketDeleted) {
        onTicketDeleted(ticket._id); // Pass ticket ID to identify which ticket to remove
      }
      console.log("delete", del);
      if (del.status == 200) {
        toast.success(del.data.message);
      }
      setShowDeleteModal(false);
      // Optionally, show a success notification here
    } catch (error) {
      console.error("Error deleting ticket:", error);
      // Optionally, show an error notification here
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = () => {
    setShowEditModal(true);
  };
  const handelEditConfirm = async (subject, message) => {
    try {
      const res = await axios.put(
        `${apiUrl}api/v1/ticket/user/${ticket._id}`,
        {
          subject,
          message,
        }
      );

      onEditTicket(res.data.ticket);
    } catch (err) {
      alert("Failed to update ticket status.");
      console.log(err);
    }
  };

  return (
    <>
      <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden mb-6 transition-all duration-300 hover:shadow-2xl">
        <div className="p-5">
          <div className="flex justify-between items-start">
            <div className="flex-grow">
              <p className="text-xs text-gray-400 mb-1">
                ID: {ticket._id || "N/A"}
              </p>
              <h3 className="text-xl font-semibold text-white mb-2">
                {ticket.subject}
              </h3>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleEditClick}
                className="text-gray-400 hover:text-blue-400 transition-colors duration-150 p-2 rounded-full hover:bg-gray-700"
                aria-label="Edit Ticket"
              >
                <FiEdit size={18} />
              </button>
              <button
                onClick={handleDeleteClick}
                className="text-gray-400 hover:text-red-400 transition-colors duration-150 p-2 rounded-full hover:bg-gray-700"
                aria-label="Delete Ticket"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>

          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentStatusMeta.color} mb-4`}
          >
            {currentStatusMeta.icon}
            {currentStatusMeta.label}
          </div>

          <div className="mb-4">
            <div className="flex items-center text-gray-400 mb-1">
              <FiMessageSquare className="mr-2 text-gray-500" />
              <span className="font-semibold text-gray-300">Message:</span>
            </div>
            <p className="text-gray-300 bg-gray-750 p-3 rounded-md text-sm leading-relaxed">
              {ticket.message.length > 100 && !isExpanded
                ? `${ticket.message.substring(0, 100)}...`
                : ticket.message}
            </p>
            {ticket.message.length > 100 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-flex items-center"
              >
                {isExpanded ? "Show Less" : "Show More"}
                {isExpanded ? (
                  <FiChevronUp className="ml-1" />
                ) : (
                  <FiChevronDown className="ml-1" />
                )}
              </button>
            )}
          </div>

          {["resolved", "rejected"].includes(ticket.status.toLowerCase()) && (
            <div className="bg-gray-750 p-3 rounded-md mt-3 border-l-4 border-blue-500">
              <div className="flex items-center text-blue-400 mb-1">
                <FiUserCheck className="mr-2 text-blue-500" />
                <p className="font-semibold text-blue-300">Admin Note:</p>
              </div>
              <p className="text-gray-300 text-sm">
                {!ticket.adminNote
                  ? "Check your email for more information."
                  : ticket.adminNote}
              </p>
            </div>
          )}
        </div>

        {ticket.createdAt && (
          <div className="bg-gray-850 px-5 py-3 border-t border-gray-700">
            <p className="text-xs text-gray-500">
              Created: {new Date(ticket.createdAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        ticketSubject={ticket.subject}
      />{" "}
      <EditTicketModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        isLoading={isSaving}
        onConfirm={handelEditConfirm}
        ticket={ticket}
      />
    </>
  );
};

const Message = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const user = useSelector((state) => state.user.user);
  const userId = user._id;

  const handleTicketDeleted = (ticketId) => {
    setTickets((prevTickets) =>
      prevTickets.filter((ticket) => ticket._id !== ticketId)
    );
    // You might want to show a success notification here as well
    console.log(`Ticket ${ticketId} successfully removed from UI.`);
  };

  const handleEditTicket = (ticketToEdit) => {
    console.log("Parent received edit request for:", ticketToEdit);

    setTickets((prevTickets) =>
      prevTickets.map((t) => {
        console.log("Checking ticket ID:", t._id);
        return t._id == ticketToEdit._id ? ticketToEdit : t;
      })
    );
    console.log("Tickets state after update:", tickets); // Add this line
    toast.success("Updated successfully");
  };

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}api/v1/ticket/${userId}`);
      setTickets(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  const submitTicket = async () => {
    if (!subject.trim() || !message.trim()) {
      return setError("Subject and message are required.");
    }

    setSubmitting(true);
    try {
      await axios.post(`${apiUrl}api/v1/ticket`, { userId, subject, message });
      setSubject("");
      setMessage("");
      setShowForm(false);
      fetchTickets(); // refresh tickets
      setError("");
    } catch (err) {
      setError("Failed to submit ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTickets();
    }
  }, [userId]);

  useEffect(() => {
    console.log("Tickets state AFTER render:", tickets); // This will log after each re-render when 'tickets' changes
  }, [tickets]);

  return (
    <div className="mt-10 text-white  mx-auto px-4">
      <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 text-white py-4 px-8 rounded-lg shadow-md mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <FaEnvelope />
          <h1 className="md:text-2xl text-lg font-semibold tracking-tight">
            Support Tickets
          </h1>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-white text-cyan-500 font-semibold md:py-2 text-sm py-1 px-1 md:px-4 rounded-full hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
        >
          Add New Ticket
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">
          <Loading />
        </p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : tickets.length === 0 ? (
        <p className="text-gray-400">No tickets found.</p>
      ) : (
        tickets.map((ticket) => (
          <Ticket
            key={ticket._id}
            onTicketDeleted={handleTicketDeleted}
            onEditTicket={handleEditTicket}
            ticket={ticket}
          />
        ))
      )}

      {/* Ticket form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-md w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">Raise a Ticket</h3>
            <input
              type="text"
              placeholder="Subject"
              className="w-full p-2 border mb-3"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <textarea
              placeholder="Describe your issue..."
              className="w-full p-2 border h-32 mb-3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitTicket}
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
