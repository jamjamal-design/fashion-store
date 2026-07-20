"use client";

import { FormEvent, useState } from "react";
import { whatsappUrl } from "../data/store";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="section-shell py-8 md:py-12">
      <div className="space-y-4">
        <span className="section-badge">Contact</span>
        <h1 className="text-4xl font-black tracking-tight md:text-5xl">Contact the store</h1>
        <p className="max-w-2xl text-muted">
          Reach out for product help, order questions, payment confirmation, or custom support.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="glass-surface rounded-[2rem] p-6">
          <h2 className="text-2xl font-black">Support channels</h2>
          <div className="mt-4 grid gap-4">
            {[
              ["WhatsApp", "Fastest response for order tracking and product questions."],
              ["Email", "Send invoices, receipt attachments, or wholesale inquiries."],
              ["Store hours", "Monday to Saturday, 9:00 AM to 7:00 PM."],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-[1.25rem] border border-[color:var(--border)] bg-[rgba(10,18,39,0.74)] p-4">
                <p className="font-bold">{title}</p>
                <p className="mt-1 text-sm text-muted">{copy}</p>
              </div>
            ))}
          </div>

          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="button-primary mt-6 w-full">
            Message us on WhatsApp
          </a>
        </section>

        <form onSubmit={handleSubmit} className="glass-surface rounded-[2rem] p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold">
              Name
              <input className="input-field" placeholder="Your name" required />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Email
              <input type="email" className="input-field" placeholder="you@example.com" required />
            </label>
          </div>

          <label className="mt-4 grid gap-2 text-sm font-semibold">
            Subject
            <input className="input-field" placeholder="Order support, product inquiry, or custom request" required />
          </label>

          <label className="mt-4 grid gap-2 text-sm font-semibold">
            Message
            <textarea className="input-field min-h-40 resize-y" placeholder="How can we help?" required />
          </label>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="submit" className="button-primary">
              Send message
            </button>
            <a href="mailto:hello@lumaatelier.example" className="button-secondary">
              Send an email instead
            </a>
          </div>

          {submitted ? (
            <p className="mt-4 rounded-2xl border border-[color:var(--border)] bg-[rgba(10,18,39,0.74)] p-4 text-sm font-semibold text-[color:var(--accent-strong)]">
              Message captured in the UI. Connect this form to your backend or email service when you are ready.
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}