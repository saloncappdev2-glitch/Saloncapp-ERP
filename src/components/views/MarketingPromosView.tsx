import React, { useState } from 'react';
import { useErp } from '../../context/ErpContext';
import {
  Tag,
  Megaphone,
  TrendingUp,
  Star,
  Users,
  CheckCircle2,
  PlusCircle,
  Sparkles,
  Percent,
  Calendar,
} from 'lucide-react';

export const MarketingPromosView: React.FC = () => {
  const { marketingStatus, launchMarketingPromo } = useErp();
  const [isAdding, setIsAdding] = useState(false);
  const [promoName, setPromoName] = useState('');
  const [promoDiscount, setPromoDiscount] = useState('25% OFF');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoName.trim()) return;

    launchMarketingPromo(promoName, promoDiscount);
    setSuccessToast(`Promo campaign "${promoName}" activated on Salon POS & CRM!`);
    setPromoName('');
    setIsAdding(false);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const leadSources = [
    { channel: 'WhatsApp Automated Booking CRM', leads: 940, pct: '51%' },
    { channel: 'Google Business Profile & Reviews', leads: 520, pct: '28%' },
    { channel: 'Instagram Bridal Campaigns', leads: 380, pct: '21%' },
  ];

  return (
    <div className="space-y-4 pb-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-rose-950/40 via-neutral-900 to-neutral-900 border border-rose-500/30 rounded-3xl p-4 shadow-md">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-rose-400" />
            <h3 className="font-extrabold text-sm text-white">Promotions & Footfall Campaigns</h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
            {marketingStatus.activeCampaignsCount} Active Promos
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800/80">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">
              Total Campaign Leads
            </span>
            <div className="text-base font-extrabold text-emerald-400 mt-1">
              {marketingStatus.totalCampaignLeads.toLocaleString()} Leads
            </div>
            <span className="text-[10px] text-neutral-500">Across 18 Salon Outlets</span>
          </div>

          <div className="bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800/80">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">
              Google CSAT Rating
            </span>
            <div className="text-base font-extrabold text-amber-300 mt-1 flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{marketingStatus.averageCsatRating} / 5.0</span>
            </div>
            <span className="text-[10px] text-neutral-500">12,400+ Client Reviews</span>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Live Promotions & Redemptions */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-rose-400" />
            Active Promotional Vouchers & POS Redemptions
          </h4>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="text-[10px] px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-rose-300 font-semibold flex items-center gap-1 transition-colors"
          >
            <PlusCircle className="w-3 h-3" />
            <span>Launch Promo</span>
          </button>
        </div>

        {/* Promo creation form */}
        {isAdding && (
          <form
            onSubmit={handleLaunch}
            className="bg-neutral-900 p-3 rounded-2xl border border-rose-500/40 space-y-2.5 animate-fadeIn"
          >
            <span className="text-xs font-bold text-neutral-200 block">
              Activate New Network Promotion
            </span>
            <input
              type="text"
              placeholder="e.g., Diwali Royal Makeover Privileges"
              value={promoName}
              onChange={e => setPromoName(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-hidden focus:border-rose-500"
            />
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Discount (e.g., Flat 30% OFF)"
                value={promoDiscount}
                onChange={e => setPromoDiscount(e.target.value)}
                className="w-1/2 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-200 focus:outline-hidden focus:border-rose-500"
              />
              <div className="w-1/2 flex justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-2.5 py-1 text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-all"
                >
                  Sync to POS
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Promo cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {marketingStatus.topPromotions.map(promo => (
            <div
              key={promo.id}
              className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-3.5 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h5 className="font-bold text-sm text-neutral-100">{promo.name}</h5>
                  <span className="text-xs text-rose-400 font-extrabold mt-0.5 block">
                    {promo.discount} Discount
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                  Till {promo.activeTill}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-neutral-800">
                <span className="text-[11px] text-neutral-400">
                  Total Bookings: <strong className="text-emerald-400">{promo.redemptions} Redeemed</strong>
                </span>
                <span className="text-[10px] text-amber-300 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Live in all salons
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Generation Breakdown */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            Client Acquisition Channel Share
          </h4>
          <span className="text-[10px] text-neutral-500">Monthly attribution</span>
        </div>

        <div className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-3 space-y-2">
          {leadSources.map((s, i) => (
            <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-neutral-800/60 last:border-0">
              <span className="text-neutral-300">{s.channel}</span>
              <div className="flex items-center gap-2">
                <span className="text-neutral-400">{s.leads} leads</span>
                <span className="text-[10px] font-bold text-rose-400 px-1.5 py-0.2 rounded bg-rose-500/10 border border-rose-500/20">
                  {s.pct}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
