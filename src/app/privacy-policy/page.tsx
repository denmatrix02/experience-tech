import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | ExperienceTech Aba',
  description: 'Privacy Policy explaining how ExperienceTech collects, handles, and protects customer inquiry and diagnostic information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-medium uppercase tracking-wider text-blue-600">Legal Information</span>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#0B192C] mt-1">Privacy Policy</h1>
            <p className="text-xs text-slate-500 mt-1">Last Updated: March 2026</p>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
            <span className="font-semibold">Business Owner Notice:</span> This privacy framework reflects standard practices for technology retail and repair services in Nigeria. Customize the contact details and legal corporate entity name to match your registered corporate filings.
          </div>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#0B192C]">1. Information We Collect</h2>
            <p>
              ExperienceTech ("we", "us", or "our") collects information you provide directly to us when contacting us via WhatsApp, phone, email, or submitting forms on this website:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Contact details: Full name, telephone number, WhatsApp contact, and email address.</li>
              <li>Device diagnostic information: Device brand, model, operating system, and description of hardware symptoms submitted via our Repair Booking flow.</li>
              <li>Training interest registration: Name, current occupation, learning goals, and experience tier for waitlist communication.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#0B192C]">2. How We Use Customer Information</h2>
            <p>We use the information collected exclusively for legitimate business purposes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Processing hardware purchases, checking product stock, and communicating order delivery details.</li>
              <li>Conducting repair diagnostics, providing transparent quotation estimates, and updating tracking statuses.</li>
              <li>Notifying registered individuals when training curriculum cohorts open for admissions.</li>
              <li>We strictly do NOT sell, rent, or lease your personal information to third-party marketing companies.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#0B192C]">3. Device Data & Confidentiality During Repairs</h2>
            <p>
              When a computer is checked into our Aba workshop for motherboard repair or software optimization, we respect your personal data. Our technicians do not access your personal folders, photos, or documents unless explicitly requested to perform data recovery with your signed authorization.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#0B192C]">4. Contact Our Privacy Lead</h2>
            <p>
              If you have any questions about this privacy statement, please contact us at: <br />
              <span className="font-semibold">ExperienceTech:</span> 37B St. Michael Road, Aba, Abia State, Nigeria. <br />
              Email: <code>experiencetechservices@gmail.com</code>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
