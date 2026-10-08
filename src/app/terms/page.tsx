import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | ExperienceTech Aba',
  description: 'Terms and conditions governing product sales, diagnostic quotes, and repair services at ExperienceTech Nigeria.',
};

export default function TermsPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-medium uppercase tracking-wider text-blue-600">Legal Agreement</span>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#0B192C] mt-1">Terms & Conditions</h1>
            <p className="text-xs text-slate-500 mt-1">Effective: March 2026</p>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
            <span className="font-semibold">Business Owner Notice:</span> Clearly defines sales protocol, in-store inspection expectations, and repair intake rules for your 37B St. Michael Road, Aba retail operations.
          </div>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#0B192C]">1. Product Pricing & Availability</h2>
            <p>
              Product pricing displayed on this website is denominated in Nigerian Naira (NGN). Due to exchange rate dynamics and physical inventory turnover at 37B St. Michael Road, Aba, Abia State, prices and real-time stock levels are confirmed at the point of WhatsApp or in-store consultation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#0B192C]">2. In-Store Hardware Inspection</h2>
            <p>
              For walk-in purchases, customers are encouraged to verify machine specifications, run CrystalDiskInfo SSD tests, and inspect the physical chassis on our testing bench prior to completing payment. A written receipt and warranty document are issued upon purchase.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#0B192C]">3. Repair Diagnostic & Approval Policy</h2>
            <p>
              Our intake diagnostic evaluates motherboard and component health. No repair work involving parts replacement will begin without the client's prior explicit quotation approval via WhatsApp or phone. In the unlikely event that a device is deemed non-repairable, no repair fee is charged beyond standard initial assessment.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#0B192C]">4. Unclaimed Devices</h2>
            <p>
              Completed or non-repairable devices must be retrieved within 45 days of notification. Devices left uncollected beyond 60 days without prior written agreement may be subject to recycling or disposal to offset workshop storage costs.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
