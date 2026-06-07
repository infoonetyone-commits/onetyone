"use client";
import { useActionState, useRef, useEffect } from "react";
import { submitContact, type ContactState } from "../actions/contact";

const initialState: ContactState = null;

const services = [
  "SEO — Search Engine Optimisation",
  "Paid Ads — Google & Meta",
  "Social Media Management",
  "Content Marketing",
  "Full-Service Package",
  "Not sure yet — I need advice",
];

const inputClass =
  "w-full bg-white border border-purple/15 px-4 py-3 text-sm text-purple-deeper placeholder-purple-deeper/30 focus:outline-none focus:border-purple rounded-lg transition-colors duration-200";

const labelClass =
  "block text-[0.65rem] font-bold tracking-[0.18em] uppercase text-purple-deeper/50 mb-2";

export default function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>
            Full Name <span className="text-purple">*</span>
          </label>
          <input name="name" type="text" required placeholder="Jane Smith" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Business Name</label>
          <input name="business" type="text" placeholder="Acme Co." className={inputClass} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>
            Email <span className="text-purple">*</span>
          </label>
          <input name="email" type="email" required placeholder="jane@business.com" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input name="phone" type="tel" placeholder="+61 400 000 000" className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>I&apos;m interested in</label>
        <select name="service" className={`${inputClass} appearance-none cursor-pointer`}>
          <option value="">Select a service...</option>
          {services.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>
          Tell us about your business <span className="text-purple">*</span>
        </label>
        <textarea
          name="message"
          required
          rows={4}
          placeholder="What does your business do, what are your goals, and what's your biggest marketing challenge right now?"
          className={`${inputClass} resize-none`}
        />
      </div>

      {state && (
        <div className={`px-4 py-3 text-sm font-medium rounded-lg ${
          state.success
            ? "bg-green-50 border border-green-200 text-green-800"
            : "bg-red-50 border border-red-200 text-red-800"
        }`}>
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-purple text-white text-[0.7rem] font-bold tracking-[0.16em] uppercase py-4 rounded-lg hover:bg-purple-dark transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? "Sending..." : "Send Enquiry"}
      </button>

      <p className="text-[0.7rem] text-purple-deeper/35 text-center">
        We respond to all enquiries within 24 hours.
      </p>
    </form>
  );
}
