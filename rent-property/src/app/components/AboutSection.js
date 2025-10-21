'use client'

import Image from 'next/image'
import { Mulish } from 'next/font/google'

const mulish = Mulish({ subsets: ['latin'], display: 'swap' })

export default function AboutSection() {
  return (
    <section id="about" className={`${mulish.className} py-16 sm:py-20 md:py-24 bg-slate-800`}>
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        {/* 
          flex-col on mobile (<640px)
          flex-row from sm+ (tablet, laptop, desktop)
        */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-10 sm:gap-14">
          {/* Text */}
          <div className="flex-1 space-y-6 sm:space-y-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              About <span className="text-[#01F5FF]">Rents inn</span>
            </h2>

            <div className="text-slate-300 text-base md:text-lg leading-relaxed space-y-6">
              <p>
                At <span className="font-semibold text-white">Rents inn</span>, we provide clean,
                comfortable, and stylish <span className="text-white">rooms</span> and
                <span className="text-white"> apartments</span> for rent in
                <span className="text-white"> B-17</span> and <span className="text-white">D-17</span>, Islamabad.
                Our spaces are fully furnished and move-in ready — ideal for both short-term stays and long-term living.
              </p>

              <p>
                We have successfully rented out <span className="text-white">rooms</span> and
                <span className="text-white"> apartments</span> in
                <span className="text-white"> City Center D-17</span> and
                <span className="text-white"> Capital Square B-17</span>, earning the trust of clients who value
                quality, convenience, and a secure community. With growing demand in these prime sectors,
                <span className="font-semibold text-white"> Rents inn</span> continues to connect residents
                with properties that fit their lifestyle and budget.
              </p>

            </div>

          </div>

          {/* Single Smaller Responsive Image */}
          <div className="flex-1 flex justify-center sm:justify-end">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/img5.jpeg"
                alt="Rentsinn Apartment"
                width={400}
                height={600}
                className="w-[200px] sm:w-[240px] md:w-[280px] lg:w-[320px] h-auto object-cover"
                sizes="(max-width: 640px) 200px, (max-width: 1024px) 280px, 320px"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
