import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund & Returns Policy | ExperienceTech Aba',
  description: 'Learn about return, replacement, and exchange terms for brand new and UK used laptops at ExperienceTech.',
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-medium uppercase tracking-wider text-blue-600">Customer Protection</span>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#0B192C] mt-1">Refund & Returns Policy</h1>
            <p className="text-xs text-slate-500 mt-1 font-normal">Last Updated: March 2026</p>
          </div>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#0B192C]">1. 7-Day Exchange / Testing Window</h2>
            <p className="font-normal">
              We want you to have total confidence in your purchase. All UK Used and refurbished computers purchased from ExperienceTech carry a <strong>7-day testing and replacement period</strong>. If a verified factory hardware defect is discovered within 7 days that cannot be rectified, the client is entitled to an immediate replacement unit of identical specifications or equal value.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#0B192C]">2. Eligibility Criteria for Exchange</h2>
            <ul className="list-disc pl-5 space-y-1 font-normal">
              <li>The computer must be in its original condition as issued, with the warranty void seal intact.</li>
              <li>Must be accompanied by the original written invoice/receipt issued at our 37B St. Michael Road, Aba office.</li>
              <li>Damage resulting from accidental physical falls, liquid spillage, or power surge after purchase is excluded from warranty exchange.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#0B192C]">3. How to Initiate a Return / Claim</h2>
            <p>
              Bring the unit with your receipt to: <br />
              <strong>ExperienceTech:</strong> 37B St. Michael Road, Aba, Abia State. <br />
              Or notify our warranty desk immediately on WhatsApp at <strong>+234 802 123 4567</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
