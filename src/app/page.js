"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, Star, MapPin, ArrowRight, CheckCircle } from "lucide-react";
import { SkeletonHeroSection } from "@/components/skeleton/SkeletonHomeHero";
import { SkeletonSectionTitle } from "@/components/skeleton/SkeletonSectionTitle";
import { SkeletonUserCard } from "@/components/skeleton/SkeletonCard";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { PageTransition } from "@/components/PageTransition";
import { url } from "@/lib/apiClient";
import { toast } from "sonner";
import { usersApi } from "@/services/usersApi";
import { regionsApi } from "@/services/regionsApi";
import { portfolioImagesApi } from "@/services/portfolioImagesApi";

// ---------------- STATIC DATA — TASKRABBIT‑LIKE ----------------
const SERVICE_CATEGORIES = [
  {
    title: "Furniture Assembly",
    img: "https://images.airtasker.com/v7/https://airtasker-seo-assets-prod.s3.amazonaws.com/en_GB/1643559106526_furniture-assembly.jpg",
  },
  {
    title: "Home Cleaning",
    img: "https://www.thespruce.com/thmb/f-8SHiPrpdI-V5cfbamOOno5fzI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/SPR-house-cleaning-checklist-5443113-hero-bfe165b4af2f4a86ac0ace570db9a333.jpg",
  },
  {
    title: "Moving & Packing",
    img: "https://www.thespruce.com/thmb/LRk_EibWLPqjClNSDYRXGNL8E9g=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/packing-your-home-for-household-move-2436497-Hero-263ec036e44a44e2bf8c8175e192ca69.jpg",
  },
  {
    title: "Painting & Repairs",
    img: "https://www.paintingservicesingapore.com/wp-content/uploads/2023/07/How-To-Repair-And-Patch-Walls-Before-Painting.jpg",
  },
];

const FEATURED_SERVICES = [
  {
    title: "General Furniture Assembly",
    img: "https://www.2modern.com/cdn/shop/files/tier1_banner_furniture_mobile_x320.jpg?v=1704898378",
    startPrice: "$49+",
  },
  {
    title: "TV Mount Installation",
    img: "https://installmyantenna.com.au/wp-content/uploads/2018/10/shutterstock_760702759.jpg",
    startPrice: "$69+",
  },
  {
    title: "Apartment Cleaning",
    img: "https://images.pexels.com/photos/373965/pexels-photo-373965.jpeg?auto=compress&cs=tinysrgb&w=600",
    startPrice: "$59+",
  },
];

const TESTIMONIALS = [
  {
    name: "Emily R.",
    text: "I found a pro in minutes — great service!",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    name: "Michael W.",
    text: "Efficient & friendly taskers. Highly recommend.",
    avatar: "https://randomuser.me/api/portraits/men/73.jpg",
  },
  {
    name: "Laura T.",
    text: "The best experience hiring home help online.",
    avatar: "https://randomuser.me/api/portraits/women/54.jpg",
  },
];

const FAQ = [
  { q: "How do I book a task?", a: "Choose service → Select pro → Schedule it." },
  { q: "Are taskers verified?", a: "Yes! All taskers are background checked." },
  { q: "Can I schedule same day?", a: "Yes, same-day bookings are available." },
];

export default function HomePage() {
  const router = useRouter();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 400], [0, 200]);
  const y2 = useTransform(scrollY, [0, 400], [0, -150]);

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { fetchUsers(); }, []);

  const filteredUsers = users.filter((u) => {
    const name = `${u.first_name ?? ""} ${u.last_name ?? ""}`.toLowerCase();
    return name.includes(searchQuery.toLowerCase()) || (u.role ?? "").toLowerCase().includes(searchQuery.toLowerCase());
  });

  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await usersApi
        .getAll();
      let masters = res.data.filter((u) => u.role === "MASTER");

      const regionIds = [...new Set(masters.map((u) => u.region_id))];
      let regions = {};
      await Promise.all(regionIds.map(async (id) => {
        try { const r = await regionsApi.getById(id); regions[id] = r.data.name; }
        catch { regions[id] = "Unknown"; }
      }));

      const enriched = await Promise.all(masters.map(async (u) => {
        let imageUrl = null;
        if (u.image_id) {
          try {
            const img = await portfolioImagesApi.getById(u.image_id);
            imageUrl = img.data.image_path;
          } catch { }
        }
        return { ...u, regionName: regions[u.region_id] || "Unknown", imageUrl };
      }));

      setUsers(enriched);
    } catch (e) { toast.error("Failed to fetch pros"); }
    finally { setLoading(false); }
  }

  return (
    <PageTransition className="relative overflow-hidden">

      {/* HERO - Big Banner */}
      <section className="min-h-screen relative flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-white to-slate-100">
        <motion.div style={{ y: y1 }} className="absolute top-0 left-0 w-full h-full bg-[url('https://images.pexels.com/photos/7045694/pexels-photo-7045694.jpeg?auto=compress&cs=tinysrgb&w=1200')] bg-cover bg-center opacity-30 -z-10" />
        <motion.h1 className="text-5xl md:text-7xl font-bold mb-4">
          Book Trusted Help <br />for Your Home Tasks
        </motion.h1>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Same‑day help for cleaning, moving, furniture assembly & more. Trusted taskers ready to help.
        </p>
        <div className="flex items-center justify-center gap-3 max-w-xl mx-auto">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What do you need done?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
          />
          <GlassButton>Search</GlassButton>
        </div>
      </section>

      {/* SERVICE CATEGORIES */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Browse Services</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {SERVICE_CATEGORIES.map((c, i) => (
            <GlassCard key={i} className="overflow-hidden p-0">
              <img src={c.img} className="w-full h-40 object-cover" />
              <div className="p-4 text-center font-semibold">{c.title}</div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="px-6 py-20 bg-slate-50">
        <h2 className="text-3xl font-bold text-center mb-10">Popular Projects</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {FEATURED_SERVICES.map((s, i) => (
            <GlassCard key={i} className="overflow-hidden">
              <img src={s.img} className="w-full h-52 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-xl">{s.title}</h3>
                <p className="text-gray-600 mt-1">Starting at {s.startPrice}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="px-6 py-20 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {["Verified Pros", "Easy Scheduling", "Satisfaction Guaranteed"].map((text, i) => (
            <GlassCard key={i} className="p-6">
              <CheckCircle className="text-blue-500 mx-auto mb-4" size={32} />
              <p className="font-semibold">{text}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* TOP RATED PROS */}
      <section className="px-6 py-20 bg-slate-100">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Top Rated Pros</h2>
          <button onClick={() => router.push("/find-workers")} className="text-blue-600 font-semibold">
            View all <ArrowRight size={18} />
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonUserCard key={i} />)
            : filteredUsers.map((p, i) => (
              <GlassCard key={i} className="p-6 cursor-pointer" onClick={() => router.push(`/find-workers/${p.id}`)}>
                <div className="w-full h-40 bg-gray-200 rounded-lg overflow-hidden mb-4">
                  {p.imageUrl && <img src={url + p.imageUrl} className="w-full h-full object-cover" />}
                </div>
                <h3 className="font-bold text-xl">{`${p.first_name} ${p.last_name}`}</h3>
                <div className="flex gap-2 text-sm text-gray-600">
                  <Star className="text-yellow-400 w-4 h-4" /> {p.rating || "5"}
                  <MapPin className="w-4 h-4" /> {p.regionName}
                </div>
              </GlassCard>
            ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">What People Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <GlassCard key={i} className="p-6 text-center">
              <img src={t.avatar} className="w-16 h-16 rounded-full mx-auto mb-3" />
              <p className="text-gray-700 mb-2">“{t.text}”</p>
              <strong>{t.name}</strong>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20 bg-slate-50 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQ.map((f, i) => (
            <GlassCard key={i} className="p-6">
              <h3 className="font-semibold">{f.q}</h3>
              <p className="text-gray-600">{f.a}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <img src="https://img.icons8.com/color/96/000000/happy.png" alt="Satisfaction" className="mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-2">Your satisfaction, guaranteed</h3>
            <p className="text-gray-600">If you’re not satisfied, we’ll work to make it right.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <img src="https://img.icons8.com/color/96/000000/verified-account.png" alt="Vetted" className="mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-2">Vetted Taskers</h3>
            <p className="text-gray-600">Taskers are always background checked before joining the platform.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <img src="https://img.icons8.com/color/96/000000/customer-support.png" alt="Support" className="mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-2">Dedicated Support</h3>
            <p className="text-gray-600">Friendly service when you need us – every day of the week.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">How it works</h2>
          <p className="text-gray-600 text-lg">Get help in 3 simple steps</p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 flex items-center justify-center bg-blue-100 rounded-full mb-4 text-2xl font-bold">1</div>
            <h3 className="font-bold mb-2">Choose a Tasker</h3>
            <p className="text-gray-600">By price, skills, and reviews.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 flex items-center justify-center bg-blue-100 rounded-full mb-4 text-2xl font-bold">2</div>
            <h3 className="font-bold mb-2">Schedule a Tasker</h3>
            <p className="text-gray-600">As early as today.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 flex items-center justify-center bg-blue-100 rounded-full mb-4 text-2xl font-bold">3</div>
            <h3 className="font-bold mb-2">Chat, pay, tip & review</h3>
            <p className="text-gray-600">All in one place.</p>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <h2 className="text-4xl font-bold mb-6">Get help today</h2>
        <p className="mb-8">See all services and find trusted taskers near you.</p>
        
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="font-bold mb-4 text-white">Discover</h3>
            <ul className="space-y-2">
              <li>Become a Tasker</li>
              <li>Services By City</li>
              <li>Services Nearby</li>
              <li>All Services</li>
              <li>Elite Taskers</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-white">Help</h3>
            <ul className="space-y-2">
              <li>Company</li>
              <li>About Us</li>
              <li>Careers</li>
              <li>Partner with Taskrabbit</li>
              <li>Press</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-white">Legal</h3>
            <ul className="space-y-2">
              <li>Terms & Privacy</li>
              <li>California Consumer Notice</li>
              <li>Do Not Sell My Personal Information</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-white">Download App</h3>
            <div className="flex flex-col gap-4">
              <a href={'https://www.apple.com/app-store/'} target="blank" className="bg-white text-blue-600 px-4 py-2 rounded-xl font-bold hover:bg-gray-100 transition">Apple Store</a>
              <a href="https://play.google.com/store/games?hl=en" target="blank" className="bg-white text-blue-600 px-4 py-2 rounded-xl font-bold hover:bg-gray-100 transition">Google Play Store</a>
            </div>
          </div>
        </div>
        <p className="text-center mt-10 text-gray-500 text-sm">
          &copy; 2025 TaskClone. All rights reserved.
        </p>
      </footer>

    </PageTransition>
  );
}
