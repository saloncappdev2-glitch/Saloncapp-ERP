import React, { useState } from 'react';
import { useErp } from '../../context/ErpContext';
import {
  Megaphone,
  TrendingUp,
  Star,
  Users,
  Radio,
  PlusCircle,
  Tag,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface MarketingDepartmentViewProps {
  onOpenBroadcastModal: () => void;
}

export const MarketingDepartmentView: React.FC<MarketingDepartmentViewProps> = ({
  onOpenBroadcastModal,
}) => {
  const { marketingStatus, launchMarketingPromo } = useErp();
  const [isAddingPromo, setIsAddingPromo] = useState(false);
  const [promoName, setPromoName] = useState('');
  const [promoDiscount, setPromoDiscount] = useState('20% OFF');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoName.trim()) return;

    launchMarketingPromo(promoName, promoDiscount);
    setSuccessToast(`Promo campaign "${promoName}" launched across network!`);
    setPromoName('');
    setIsAddingPromo(false);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Marketing Header */}
      <div className="bg-gradient-to-br from-rose-950/40 via-neutral-900 to-neutral-900 border border-rose-500/30 rounded-3xl p-4 shadow-lg shadow-black/40">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold text-xs">
              📢 Marketing & Growth
            </span>
            <span className="text-xs font-bold text-neutral-200">Brand & Footfall Campaigns</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
            +{marketingStatus.brandFootfallBoostPct}% Footfall
          </span>
        </div>

        {/* Marketing KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Active Campaigns */}
          <div className="bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800/80">
            <span className="text-[10px] uppercase font-bold text-rose-400 flex items-center gap-1">
              <Megaphone className="w-3 h-3 text-rose-400" />
              Live Campaigns
            </span>
            <div className="text-base font-extrabold text-white mt-1">
              {marketingStatus.activeCampaignsCount} National & Regional
            </div>
            <span className="text-[10px] text-neutral-500">Bridal & Festive drives</span>
          </div>

          {/* Leads Generated */}
          <div className="bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800/80">
            <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              Campaign Leads
            </span>
            <div className="text-base font-extrabold text-emerald-300 mt-1">
              {marketingStatus.totalCampaignLeads.toLocaleString()} Leads
            </div>
            <span className="text-[10px] text-neutral-500">Digital ads & WhatsApp CRM</span>
          </div>

          {/* Average Rating */}
          <div className="bg-neutral-950/80 p-3 rounded-2xl border border-amber-500/30">
            <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              Salon CSAT Rating
            </span>
            <div className="text-base font-extrabold text-amber-300 mt-1">
              {marketingStatus.averageCsatRating} ★ / 5.0
            </div>
            <span className="text-[10px] text-neutral-400">Based on 12,400+ reviews</span>
          </div>

          {/* Footfall Lift */}
          <div className="bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800/80">
            <span className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1">
              <Users className="w-3 h-3 text-purple-400" />
              Organic Walk-ins
            </span>
            <div className="text-base font-extrabold text-neutral-200 mt-1">
              +18% MoM
            </div>
            <span className="text-[10px] text-neutral-500">Tier 1 & 2 Metro salons</span>
          </div>
        </div>

        {/* Quick Broadcast CTA */}
        <div className="mt-3 pt-3 border-t border-rose-500/20 flex items-center justify-between gap-2">
          <span className="text-[11px] text-neutral-400">Dispatch promo banners & coupons</span>
          <button
            onClick={onOpenBroadcastModal}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-rose-900/40 active:scale-95 transition-all"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Broadcast Campaign</span>
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Promotions & Campaign Redemptions */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-rose-400" />
            Active Promotional Drives & Redemptions
          </h3>
          <button
            onClick={() => setIsAddingPromo(!isAddingPromo)}
            className="text-[10px] px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-rose-300 font-semibold flex items-center gap-1 transition-colors"
          >
            <PlusCircle className="w-3 h-3" />
            <span>Launch Promo</span>
          </button>
        </div>

        {/* Promo creation form */}
        {isAddingPromo && (
          <form
            onSubmit={handleCreatePromo}
            className="bg-neutral-900 p-3 rounded-2xl border border-rose-500/40 space-y-2.5 animate-fadeIn"
          >
            <span className="text-xs font-bold text-neutral-200 block">
              Launch Nationwide Promo Drive
            </span>
            <input
              type="text"
              placeholder="e.g., Weekend Balayage Flash Voucher"
              value={promoName}
              onChange={e => setPromoName(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-hidden focus:border-rose-500"
            />
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Discount (e.g., 30% OFF)"
                value={promoDiscount}
                onChange={e => setPromoDiscount(e.target.value)}
                className="w-1/2 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-200 focus:outline-hidden focus:border-rose-500"
              />
              <div className="w-1/2 flex justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsAddingPromo(false)}
                  className="px-2.5 py-1 text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-all"
                >
                  Activate
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Promotions list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {marketingStatus.topPromotions.map(promo => (
            <div
              key={promo.id}
              className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-3.5 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-neutral-100">{promo.name}</h4>
                  <span className="text-xs text-rose-400 font-extrabold mt-0.5 block">
                    Offer: {promo.discount}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                  Till {promo.activeTill}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-800">
                <span className="text-[11px] text-neutral-400">
                  Salon Redemptions: <strong className="text-emerald-400">{promo.redemptions} Bookings</strong>
                </span>
                <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Active in all outlets
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
