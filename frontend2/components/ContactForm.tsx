"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!form.message.trim()) newErrors.message = "Message is required";

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const sourcePage = process.env.NEXT_PUBLIC_SOURCE_PAGE || "contact-form";

      console.log("✅ Backend URL:", baseUrl);
      console.log("✅ Source Page:", sourcePage);

      if (!baseUrl) {
        alert("❌ NEXT_PUBLIC_BACKEND_URL missing! Check .env.local");
        return;
      }

      const response = await fetch(`${baseUrl}/api/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          source_page: sourcePage,
        }),
      });

      const resultText = await response.text();
      console.log("✅ Response Status:", response.status);
      console.log("✅ Backend Response:", resultText);

      if (!response.ok) {
        throw new Error(resultText || "Failed to submit contact form");
      }

      alert("✅ Your message has been sent successfully!");

      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      alert("❌ Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-2xl rounded-3xl p-8 md:p-10 space-y-6 border border-gray-100 max-w-xl"
    >
      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={form.name}
          onChange={handleChange}
          className={`w-full px-4 py-3 border-2 rounded-xl
text-gray-800 placeholder:text-gray-600
focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${
            errors.name ? "border-red-500" : "border-gray-200"
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email address"
          value={form.email}
          onChange={handleChange}
          className={`w-full px-4 py-3 border-2 rounded-xl
text-gray-800 placeholder:text-gray-600
focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${
            errors.email ? "border-red-500" : "border-gray-200"
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Phone <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          placeholder="Enter your phone number"
          value={form.phone}
          onChange={handleChange}
          className={`w-full px-4 py-3 border-2 rounded-xl
text-gray-800 placeholder:text-gray-600
focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${
            errors.phone ? "border-red-500" : "border-gray-200"
          }`}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          rows={5}
          placeholder="Write your message here..."
          value={form.message}
          onChange={handleChange}
          className={`w-full px-4 py-3 border-2 rounded-xl resize-none
text-gray-800 placeholder:text-gray-600
focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${
            errors.message ? "border-red-500" : "border-gray-200"
          }`}
        />
        {errors.message && (
          <p className="text-red-500 text-sm mt-1">{errors.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 disabled:opacity-50"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
