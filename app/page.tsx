'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  CheckCircle,
  ChevronDown,
  Clock,
  CreditCard,
  Dumbbell,
  Gavel,
  Home as HomeIcon,
  MessageCircle,
  Package,
  Search,
  Shirt,
  ShieldCheck,
  Smartphone,
  Video,
} from 'lucide-react';
import API from '@/lib/api';
import { AUCTION_CATEGORIES } from '@/lib/categories';

const CATEGORY_ICONS: Record<string, any> = {
  Electronics: Smartphone,
  Fashion: Shirt,
  Home: HomeIcon,
  Sports: Dumbbell,
  Books: BookOpen,
  Other: Package,
};

const formatTimeLeft = (endsAt: string) => {
  const ms = Math.max(0, new Date(endsAt).getTime() - Date.now());
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  return days > 0 ? `${days}d ${hours}h` : `${hours}h ${minutes}m`;
};

const FAQS = [
  {
    q: 'What is TradeSpace?',
    a: 'TradeSpace is an online marketplace in Nigeria. You can bid on items in timed auctions, sell your own items, and hire or offer services on Clear Space.',
  },
  {
    q: 'How is my payment protected?',
    a: 'When you win an auction and pay, TradeSpace holds the money. The seller is paid after you confirm the item arrived, or automatically after 7 days if you have not reported a problem.',
  },
  {
    q: 'How do the auctions work?',
    a: 'Every auction runs for 24 hours. Anyone can place a bid. The seller chooses which bid to accept, and that buyer then has 3 days to pay.',
  },
  {
    q: 'What if something goes wrong?',
    a: 'Report a problem from the auction page. The payment is frozen while our team looks into it, and we then either refund the buyer or pay the seller. You can also report listings, comments and users, and contact support any time.',
  },
  {
    q: 'What is Clear Space?',
    a: 'Clear Space is the services side of TradeSpace, where people offer their skills as gigs and others hire them.',
  },
];

function AuctionImage({ src, alt }: { src: string | null; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm bg-gray-200">
        No photo
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
    />
  );
}

export default function Home() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loadingAuctions, setLoadingAuctions] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem('token'));

    let cancelled = false;

    const load = async () => {
      try {
        const res = await API.get('/auctions');
        if (cancelled) return;
        const now = Date.now();
        const running = (res.data as any[])
          .filter((a) => a.status === 'active' && a.endsAt && new Date(a.endsAt).getTime() > now)
          .sort((a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime())
          .slice(0, 4);
        setAuctions(running);
      } catch (err) {
        // the section just shows its empty state
      } finally {
        if (!cancelled) setLoadingAuctions(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const sellHref = loggedIn ? '/create-auction' : '/register';

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#070b16] text-white">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 50% at 80% 0%, rgba(37,99,235,0.45) 0%, rgba(7,11,22,0) 70%), radial-gradient(50% 40% at 0% 100%, rgba(59,130,246,0.25) 0%, rgba(7,11,22,0) 70%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 pt-14 pb-10 md:pt-24 md:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs md:text-sm text-blue-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Nigerian marketplace for auctions and services
              </span>

              <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-tight">
                Buy and sell with{' '}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  confidence
                </span>
                .
              </h1>

              <p className="mt-5 text-base md:text-lg text-gray-300 max-w-xl">
                TradeSpace is where you bid on items in live auctions, sell your own, and hire people for
                services. Your payment is held safely until the item arrives.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/auctions"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3 font-bold hover:bg-blue-500 transition"
                >
                  Browse auctions
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={sellHref}
                  className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-3 font-bold hover:bg-white/10 transition"
                >
                  Start selling
                </Link>
              </div>

              <ul className="mt-8 flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Free to join
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Payments held until delivery
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Message sellers directly
                </li>
              </ul>
            </div>

            {/* How a payment is protected */}
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8">
              <p className="text-sm font-semibold text-blue-200 mb-5">How your payment is protected</p>
              <ol className="space-y-5">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                    1
                  </span>
                  <div>
                    <p className="font-semibold">You win and pay</p>
                    <p className="text-sm text-gray-400 mt-0.5">
                      The seller accepts your bid and you pay through secure checkout.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                    2
                  </span>
                  <div>
                    <p className="font-semibold">TradeSpace holds the money</p>
                    <p className="text-sm text-gray-400 mt-0.5">
                      The seller sends the item. They are not paid yet.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                    3
                  </span>
                  <div>
                    <p className="font-semibold">You confirm, they get paid</p>
                    <p className="text-sm text-gray-400 mt-0.5">
                      Problem with the order? Report it and the payment stays frozen.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Facts strip */}
        <div className="relative border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xl md:text-2xl font-bold">24 hours</p>
              <p className="text-xs md:text-sm text-gray-400">Every auction runs for a full day</p>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold">7 days</p>
              <p className="text-xs md:text-sm text-gray-400">To report a problem after paying</p>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold">Held safely</p>
              <p className="text-xs md:text-sm text-gray-400">Seller paid after you confirm delivery</p>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold">Live</p>
              <p className="text-xs md:text-sm text-gray-400">Video auctions with real time bids</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mb-10">
            <p className="text-sm font-bold text-blue-600 uppercase tracking-wide">How it works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-black mt-2">Three steps from bid to delivery</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-black">1. Find and bid</h3>
              <p className="text-gray-600 text-sm mt-2">
                Browse auctions or filter by category, then place a bid. The seller chooses which bid to accept.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-black">2. Pay, and we hold it</h3>
              <p className="text-gray-600 text-sm mt-2">
                Once your bid is accepted you have 3 days to pay. TradeSpace holds the money, so the seller is not
                paid until you are happy.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-black">3. Confirm delivery</h3>
              <p className="text-gray-600 text-sm mt-2">
                When the item arrives, confirm it and the seller is paid. If it does not, report a problem and our
                team steps in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live auctions */}
      <section className="bg-gray-50 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-8 gap-4">
            <div>
              <p className="text-sm font-bold text-blue-600 uppercase tracking-wide">Happening now</p>
              <h2 className="text-3xl md:text-4xl font-bold text-black mt-2">Auctions ending soon</h2>
            </div>
            <Link
              href="/auctions"
              className="hidden sm:inline-flex items-center gap-1 text-blue-600 font-bold hover:text-blue-700 text-sm whitespace-nowrap"
            >
              See all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingAuctions ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-2xl bg-white border border-gray-200 overflow-hidden animate-pulse">
                  <div className="h-44 bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : auctions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <Gavel className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="font-bold text-black">No auctions are running right now</p>
              <p className="text-gray-600 text-sm mt-1">Be the first to list something for sale.</p>
              <Link
                href={sellHref}
                className="inline-block mt-5 rounded-full bg-blue-600 text-white px-6 py-2.5 font-bold hover:bg-blue-700"
              >
                Create an auction
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {auctions.map((auction) => {
                const image = auction.images && auction.images[0] ? auction.images[0] : null;
                const bidCount = auction.bids?.length || 0;

                return (
                  <Link key={auction._id} href={`/auctions/${auction._id}`} className="group block">
                    <div className="rounded-2xl bg-white border border-gray-200 overflow-hidden hover:shadow-xl transition h-full">
                      <div className="relative h-44 overflow-hidden bg-gray-200">
                        <AuctionImage src={image} alt={auction.title} />
                        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-red-600 text-white px-3 py-1 text-xs font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          {formatTimeLeft(auction.endsAt)}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-black line-clamp-2">{auction.title}</h3>
                        <div className="mt-3 flex items-end justify-between">
                          <div>
                            <p className="text-xs text-gray-500">Current bid</p>
                            <p className="text-xl font-bold text-blue-600">
                              ₦{Number(auction.currentBid || auction.startingBid).toLocaleString()}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500">
                            {bidCount} {bidCount === 1 ? 'bid' : 'bids'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link href="/auctions" className="inline-block text-blue-600 font-bold hover:text-blue-700">
              See all auctions
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mb-10">
            <p className="text-sm font-bold text-blue-600 uppercase tracking-wide">Browse</p>
            <h2 className="text-3xl md:text-4xl font-bold text-black mt-2">Shop by category</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {AUCTION_CATEGORIES.map((category: string) => {
              const Icon = CATEGORY_ICONS[category] || Package;
              return (
                <Link
                  key={category}
                  href="/auctions"
                  className="group rounded-2xl border border-gray-200 p-5 text-center hover:border-blue-500 hover:shadow-lg transition"
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="mt-3 font-semibold text-black text-sm md:text-base">{category}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why TradeSpace */}
      <section className="bg-gray-50 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mb-10">
            <p className="text-sm font-bold text-blue-600 uppercase tracking-wide">Why TradeSpace</p>
            <h2 className="text-3xl md:text-4xl font-bold text-black mt-2">Built so strangers can trade safely</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white border border-gray-200 p-6">
              <ShieldCheck className="w-8 h-8 text-blue-600" />
              <h3 className="font-bold text-black mt-4">Payments held until delivery</h3>
              <p className="text-gray-600 text-sm mt-2">
                The seller only gets paid after you confirm the item arrived, or after 7 days with no problem
                reported.
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-gray-200 p-6">
              <Video className="w-8 h-8 text-blue-600" />
              <h3 className="font-bold text-black mt-4">Live video auctions</h3>
              <p className="text-gray-600 text-sm mt-2">
                Sellers can go live and show the item while people bid, so you see what you are buying.
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-gray-200 p-6">
              <Briefcase className="w-8 h-8 text-blue-600" />
              <h3 className="font-bold text-black mt-4">Services on Clear Space</h3>
              <p className="text-gray-600 text-sm mt-2">
                Offer your skills as gigs, or hire someone, in the same place you buy and sell items.
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-gray-200 p-6">
              <MessageCircle className="w-8 h-8 text-blue-600" />
              <h3 className="font-bold text-black mt-4">Message sellers directly</h3>
              <p className="text-gray-600 text-sm mt-2">
                Ask questions before you bid. Contact details are only shared after a sale is paid.
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-gray-200 p-6">
              <CheckCircle className="w-8 h-8 text-blue-600" />
              <h3 className="font-bold text-black mt-4">Ratings from real buyers</h3>
              <p className="text-gray-600 text-sm mt-2">
                Only the winning buyer of a sale can review the seller, so every rating comes from a real purchase.
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-gray-200 p-6">
              <Gavel className="w-8 h-8 text-blue-600" />
              <h3 className="font-bold text-black mt-4">Help when something goes wrong</h3>
              <p className="text-gray-600 text-sm mt-2">
                Report a problem and the payment is frozen while our team reviews it. You can also report listings
                and users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-sm font-bold text-blue-600 uppercase tracking-wide">Questions</p>
            <h2 className="text-3xl md:text-4xl font-bold text-black mt-2">Is it safe? How does it work?</h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((item) => (
              <details key={item.q} className="group rounded-2xl border border-gray-200 bg-white">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4 font-semibold text-black [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="px-4 pb-14 md:pb-20">
        <div className="max-w-7xl mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 text-white px-6 py-12 md:py-16 text-center">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: 'radial-gradient(50% 60% at 85% 0%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%)',
            }}
          />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to try TradeSpace?</h2>
            <p className="text-blue-100 mt-3 max-w-xl mx-auto">
              Create a free account, place your first bid, or list something you want to sell.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              {loggedIn ? (
                <Link
                  href="/create-auction"
                  className="rounded-full bg-white text-blue-700 px-8 py-3 font-bold hover:bg-gray-100"
                >
                  Create an auction
                </Link>
              ) : (
                <Link
                  href="/register"
                  className="rounded-full bg-white text-blue-700 px-8 py-3 font-bold hover:bg-gray-100"
                >
                  Create a free account
                </Link>
              )}
              <Link
                href="/auctions"
                className="rounded-full border-2 border-white px-8 py-3 font-bold hover:bg-white/10"
              >
                Browse auctions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#070b16] text-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <p className="text-xl font-bold text-white">TradeSpace</p>
            <p className="text-sm text-gray-400 mt-3">
              A Nigerian marketplace for live auctions and services, with payments held until delivery.
            </p>
          </div>

          <div>
            <p className="font-semibold text-white mb-3 text-sm">Marketplace</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/auctions" className="hover:text-white">
                  Auctions
                </Link>
              </li>
              <li>
                <Link href="/live" className="hover:text-white">
                  Live now
                </Link>
              </li>
              <li>
                <Link href="/clear-space" className="hover:text-white">
                  Clear Space
                </Link>
              </li>
              <li>
                <Link href="/create-auction" className="hover:text-white">
                  Sell an item
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-white mb-3 text-sm">Help</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="hover:text-white">
                  Help centre
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-white">
                  Contact support
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-white mb-3 text-sm">Account</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="hover:text-white">
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white">
                  Create account
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white">
                  My profile
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-5 text-xs text-gray-500">
            &copy; 2026 TradeSpace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}