import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiAward, FiUsers, FiZap, FiPackage } from "react-icons/fi";

const STATS = [
  { icon: FiUsers, value: "500+", label: "Students Trained" },
  { icon: FiAward, value: "3", label: "Certifications Offered" },
  { icon: FiZap, value: "14", label: "Program Standards" },
  { icon: FiPackage, value: "2yr", label: "Program Length" },
];

const CERTIFICATIONS = [
  "NC3 Certification (multiple levels)",
  "Universal Robots Certification",
  "KUKA CORE Certification",
];

const EQUIPMENT = [
  "Festo MecLab",
  "AC/DC Trainers",
  "Hydraulics & Pneumatics Training Systems",
  "PLC Training Systems",
  "Universal Robots",
  "KUKA Ready2Educate Cells",
  "Festo Modular Production Systems (Industry 4.0)",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#1a1919]">
      {/* Heading */}
      <section className="bg-[#242325] border-b border-white/5 px-6 py-14 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[#DC965A] mb-2">
          West-MEC
        </p>
        <h1 className="text-white font-black text-4xl mb-4">
          Advanced Manufacturing Program
        </h1>
        <p className="text-white/40 text-sm max-w-xl mx-auto leading-relaxed">
          A 2-year program covering 14 key standards in automation, robotics,
          and advanced manufacturing. Students graduate with hands-on experience
          and industry-recognised certifications.
        </p>
      </section>

      {/* Stats */}
      <section className="border-b border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 py-8 px-4 text-center"
            >
              <Icon size={18} className="text-[#DC965A]" />
              <span className="text-white font-black text-2xl">{value}</span>
              <span className="text-white/30 text-xs">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Main stuff */}
      <div className="max-w-5xl mx-auto px-6 py-14 flex flex-col gap-14">
        {/* About Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col gap-5">
            <p className="text-xs font-bold uppercase tracking-widest text-[#DC965A]">
              About the Program
            </p>
            <h2 className="text-white font-black text-2xl leading-snug">
              Built for the Future of Manufacturing
            </h2>
            <div className="flex flex-col gap-4 text-white/55 text-sm leading-relaxed">
              <p>
                West-MEC's Advanced Manufacturing program offers a comprehensive
                curriculum covering 14 key standards. The program begins with an
                exploration of new technologies like AI, machine learning, and
                robotic process automation, and their impact on manufacturing.
              </p>
              <p>
                It then progresses through essential skills in electrical
                systems, hydraulics, pneumatics, and programmable logic
                controllers. Students also learn about industrial robotics, data
                communication methodologies, sensor applications, and various
                manufacturing processes.
              </p>
              <p>
                A unique feature of this program is the inclusion of cleanroom
                simulation training, preparing students for work in
                semiconductor and pharmaceutical industries.
              </p>
            </div>
            <Link
              href="/orders"
              className="self-start bg-[#DC965A] hover:bg-[#c8834a] text-[#242325] font-bold px-6 py-3 rounded-xl text-sm transition-colors"
            >
              Start a Custom Order
            </Link>
          </div>

          <div className="rounded-2xl overflow-hidden border border-white/5 aspect-video relative">
            <Image
              src="https://res.cloudinary.com/dzu7xnmgw/image/upload/v1779226232/DSC03342_xk9bib.webp"
              alt="Advanced Manufacturing Lab"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Equipment and Certs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Equipment */}
          <div className="bg-[#242325] border border-white/5 rounded-2xl p-7">
            <p className="text-xs font-bold uppercase tracking-widest text-[#DC965A] mb-1">
              Industry Equipment
            </p>
            <h3 className="text-white font-bold text-lg mb-5">
              What Students Work With
            </h3>
            <ul className="flex flex-col gap-3">
              {EQUIPMENT.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-white/60"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DC965A] shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Certs */}
          <div className="bg-[#242325] border border-white/5 rounded-2xl p-7">
            <p className="text-xs font-bold uppercase tracking-widest text-[#DC965A] mb-1">
              Certifications
            </p>
            <h3 className="text-white font-bold text-lg mb-5">
              Earn on Completion
            </h3>
            <ul className="flex flex-col gap-3 mb-6">
              {CERTIFICATIONS.map((cert) => (
                <li
                  key={cert}
                  className="flex items-start gap-3 text-sm text-white/60"
                >
                  <FiAward
                    size={14}
                    className="text-[#DC965A] shrink-0 mt-0.5"
                  />
                  {cert}
                </li>
              ))}
            </ul>
            <p className="text-white/40 text-sm leading-relaxed">
              These certifications, combined with the comprehensive skill set
              developed throughout the program, equip completers with the
              knowledge and practical experience needed to excel in the rapidly
              evolving field of advanced manufacturing and automation.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="bg-[#DC965A] rounded-2xl p-10 text-center">
          <h3 className="text-[#242325] font-black text-2xl mb-2">
            Ready to Get Started?
          </h3>
          <p className="text-[#242325]/70 text-sm mb-6 max-w-sm mx-auto">
            Browse our in-stock 3D prints or submit a custom order and let our
            students bring your idea to life.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/products"
              className="bg-[#242325] text-[#BBB891] font-bold px-6 py-3 rounded-xl text-sm hover:bg-[#1a1919] transition-colors"
            >
              Shop Products
            </Link>
            <Link
              href="/orders"
              className="bg-[#242325]/20 text-[#242325] border border-[#242325]/20 font-bold px-6 py-3 rounded-xl text-sm hover:bg-[#242325]/30 transition-colors"
            >
              Custom Order
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}