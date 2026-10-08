import { Metadata } from 'next';
import { getProducts } from '@/lib/data/store';
import { LaptopFinderWizard } from '@/components/shop/LaptopFinderWizard';

export const metadata: Metadata = {
  title: 'Laptop Finder & Buying Guide | ExperienceTech Aba',
  description:
    'Need help choosing a laptop for programming, graphic design, accounting, or university? Match your budget and requirements to tested laptops in Nigeria.',
};

export default async function LaptopFinderPage() {
  const products = await getProducts({ publishedOnly: true });

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs font-medium uppercase tracking-wider text-blue-600 mb-1">
            Smart Sales Advisor
          </div>
          <h1 className="text-2xl sm:text-4xl font-semibold text-[#0B192C]">
            Find the Right Laptop for Your Work & Budget
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 font-normal">
            No technical jargon or guesswork. Tell us what software you run, your preferred budget in Naira, and we will match you with tested, warranty-backed models.
          </p>
        </div>

        <LaptopFinderWizard products={products} />
      </div>
    </div>
  );
}
