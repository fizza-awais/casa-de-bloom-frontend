"use client";

import Image from "next/image";

export default function GuidelinesPage() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center font-sans overflow-x-hidden px-4 py-8 lg:py-16">
      
      {/* Background System */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/assets/images/bg_image.png"
          alt="Casa de Bloom Event Vibe backdrop"
          fill
          priority
          className="object-cover object-center pointer-events-none brightness-[0.8] scale-105"
        />
        <div className="absolute inset-0 bg-transparent">
          <div className="absolute -top-1/4 -left-1/4 w-[80%] h-[80%] rounded-full bg-brand-light/40 blur-[130px]" />
          <div className="absolute -bottom-1/4 -right-1/4 w-[75%] h-[75%] rounded-full bg-brand-accent/10 blur-[120px]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/35 mix-blend-multiply" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <div className="bg-white/92 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-12 shadow-[0_32px_64px_rgba(31,27,36,0.18)] border border-white/70 space-y-8 text-left">
          
          <header className="border-b border-ui-border pb-6 space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-primary tracking-tight">
              Community Guidelines & Terms
            </h1>
            <p className="text-sm text-ui-text-muted">
              Effective Date: July 8, 2026
            </p>
            <p className="text-xs sm:text-sm text-ui-text-main leading-relaxed italic pt-2">
              &ldquo;Casa de Bloom is a community-centered Reality Show where transformation, creativity, generosity, and meaningful human connection come together through shared experiences.&rdquo;
            </p>
          </header>

          <div className="space-y-6 text-sm text-ui-text-main leading-relaxed max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            
            <section className="space-y-2">
              <h2 className="font-bold text-base text-brand-dark uppercase tracking-wider">1. Welcome to Casa de Bloom</h2>
              <p>
                This is a fun-first community experience built around connection, generosity, creativity, and mutual value. Casa de Bloom community-centered Reality Shows are created to bring good people together in a beautiful, relaxed, community-centered environment.
              </p>
              <p>
                Our goal is simple: To connect, to share, to support one another, to create content, to meet new people, and to enjoy a beautiful day together.
              </p>
              <p>
                Casa de Bloom is not a traditional networking event, trade show, vendor market, or sales presentation. It is a community gathering where people exchange value through items, services, skills, ideas, opportunities, friendships, and genuine human connection. Business is welcome, but community comes first.
              </p>
            </section>

            <hr className="border-ui-border" />

            <section className="space-y-2">
              <h2 className="font-bold text-base text-brand-dark uppercase tracking-wider">2. Registration & Private Guest Invitation</h2>
              <p>
                All guests must register in advance. After completing registration, you will be taken to your Casa de Bloom dashboard where you can view your events, open your Private Guest Invitation, and download it when needed. Please bring your invitation confirmation to the event. No walk-ins, please. Registration helps us prepare refreshments, seating, gifts, Kiwi Spa experiences, staffing, and event flow.
              </p>
            </section>

            <hr className="border-ui-border" />

            <section className="space-y-2">
              <h2 className="font-bold text-base text-brand-dark uppercase tracking-wider">3. Optional Donations & Cancellations</h2>
              <p>
                Optional donations are non-refundable. If you are unable to attend an event, you may either:
              </p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>Transfer your invitation to a friend by notifying our team in advance.</li>
                <li>Contact our team about applying your support toward a future Casa de Bloom event.</li>
              </ul>
              <p>
                Please email us as soon as possible if your plans change so we can update our guest list accordingly. Thank you for helping us plan and prepare the best possible experience for our community.
              </p>
            </section>

            <hr className="border-ui-border" />

            <section className="space-y-2">
              <h2 className="font-bold text-base text-brand-dark uppercase tracking-wider">4. Age Requirement</h2>
              <p>
                Casa de Bloom community-centered Reality Shows are adult-only events (21+). By registering, guests confirm that they are at least 21 years of age. Because alcoholic beverages may be present at the event, Casa de Bloom reserves the right to request age verification if needed. Guests who appear under the age of 30 may be asked to provide a valid government-issued photo ID during registration or check-in. Thank you for helping us maintain a safe and legally compliant event environment.
              </p>
            </section>

            <hr className="border-ui-border" />

            <section className="space-y-2">
              <h2 className="font-bold text-base text-brand-dark uppercase tracking-wider">5. Name Tags & Drink Tags</h2>
              <p>
                All guests are required to wear a visible name tag with their First and Last Name. This helps us verify registration, welcome guests properly, and make it easier for everyone to connect. Please also bring a small marker, ribbon, charm, sticker, or tag for your cup or glass. This helps everyone identify their own drink and reduces unnecessary waste during the event.
              </p>
            </section>

            <hr className="border-ui-border" />

            <section className="space-y-2">
              <h2 className="font-bold text-base text-brand-dark uppercase tracking-wider">6. Free Marketplace Rules & Privacy</h2>
              <p>
                All registered guests receive access to the Casa de Bloom Marketplace at no additional cost. The Marketplace is a free community resource created to help members stay connected between events, showcase their businesses, promote services, share items, exchange opportunities, and build relationships.
              </p>
              <p>
                You may create a profile, upload photos, add your business information, share your services, and connect with other members of the community. You choose what information is visible publicly. Privacy settings remain under your control at all times. Our goal is simple: Help good people find each other, support one another, and create value together.
              </p>
            </section>

            <hr className="border-ui-border" />

            <section className="space-y-2">
              <h2 className="font-bold text-base text-brand-dark uppercase tracking-wider">7. Business Connections</h2>
              <p>
                Many guests own businesses, offer services, create products, or work on exciting projects. To help everyone spend more time enjoying the event and less time giving long business explanations, we encourage guests to create a short 1–2 minute introduction video. You may upload it to YouTube and add the link to your Marketplace profile. You can also keep the link on your phone and share it with people you meet. This helps guests quickly learn about one another and return to what matters most: Having fun, meeting great people, and building genuine connections.
              </p>
            </section>

            <hr className="border-ui-border" />

            <section className="space-y-2">
              <h2 className="font-bold text-base text-brand-dark uppercase tracking-wider">8. Businesses, Sponsors & Community Partners</h2>
              <p>
                We welcome businesses, brands, sponsors, creators, and community partners. Rather than traditional sales presentations, we encourage businesses to create fun experiences, games, contests, demonstrations, giveaways, or interactive activities that bring people together. The goal is engagement, connection, and community. Guests naturally remember businesses that create memorable experiences. We also welcome sponsors, product donations, samples, giveaways, volunteer support, and community contributions that help make the event even more enjoyable for everyone.
              </p>
            </section>

            <hr className="border-ui-border" />

            <section className="space-y-2">
              <h2 className="font-bold text-base text-brand-dark uppercase tracking-wider">9. Trading Guidelines & Items</h2>
              <p>
                We encourage guests to bring photos of larger exchange items rather than bringing many physical items into the event. If you choose to bring physical items, we recommend keeping them in your vehicle until an exchange is arranged. If another guest is interested, you may complete the exchange directly with that person. Casa de Bloom is not responsible for personal items, lost items, damaged items, exchanges, agreements, or transactions between guests. All transactions are completed directly between attendees.
              </p>
            </section>

            <hr className="border-ui-border" />

            <section className="space-y-2">
              <h2 className="font-bold text-base text-brand-dark uppercase tracking-wider">10. Give & Take Community Table</h2>
              <p>
                We will have a Give & Take Community Table. This table is created in the spirit of generosity and fun. Guests are encouraged to bring small items they no longer use and would love to share with the community. Examples may include books, accessories, jewelry, beauty products, small gifts, home items, creative supplies, wellness items, or other small treasures.
              </p>
              <p className="font-medium">
                General guideline: Bring one, take one. Bring two, take one. Bring three, take two. The goal is to keep the table balanced while giving beautiful things a new home.
              </p>
            </section>

            <hr className="border-ui-border" />

            <section className="space-y-2">
              <h2 className="font-bold text-base text-brand-dark uppercase tracking-wider">11. Potluck Community Table & Grill</h2>
              <p>
                Casa de Bloom events are community-style potluck gatherings. Please bring both: A favorite dish or snack to share, and a beverage to share. We will also provide refreshments, mojitos, and community treats. Together we create one beautiful table.
              </p>
              <p>
                Casa de Bloom has a community grill available. If you would like to bring something for the grill, please let us know during registration so we can plan accordingly. Hot dogs, sausages, vegetables, kabobs, plant-based options, and other grill-friendly foods are welcome.
              </p>
            </section>

            <hr className="border-ui-border" />

            <section className="space-y-2">
              <h2 className="font-bold text-base text-brand-dark uppercase tracking-wider">12. Casa de Bloom Community Contributions</h2>
              <p>
                We are always looking for ways to make Casa de Bloom more beautiful, comfortable, creative, and enjoyable for our community. If you have decor, artwork, furniture, lighting, plants, lounge pieces, photo props, outdoor items, or other beautiful things that you no longer use and would love to see bringing joy to others, we would be happy to consider them. Before bringing any items, please email photos to our team with the subject line: “Casa de Bloom Contribution”. Because our space is limited, we can only accept items that we are able to use immediately within Casa de Bloom.
              </p>
            </section>

            <hr className="border-ui-border" />

            <section className="space-y-2">
              <h2 className="font-bold text-base text-brand-dark uppercase tracking-wider">13. Pool & Hot Tub</h2>
              <p>
                Many guests enjoy the pool and hot tub during Casa de Bloom events. Please bring anything you may need to feel comfortable throughout the day, including a swimsuit, towel, sunscreen, and a change of clothes.
              </p>
            </section>

            <hr className="border-ui-border" />

            <section className="space-y-2">
              <h2 className="font-bold text-base text-brand-dark uppercase tracking-wider">14. Photography, Content & Media Release</h2>
              <p>
                Photographers, videographers, and content creators may be present during the event. Casa de Bloom is a community-centered Reality Show. By attending, guests understand and consent that photos, videos, and audio recordings may be taken throughout the property. Guests grant Casa de Bloom permission to use event photos and videos for social media, marketing, promotional, educational, and community purposes.
              </p>
              <p>
                If a photographer takes your photos, please exchange contact information directly with that photographer. Guests are responsible for coordinating photo delivery directly with the photographer. Casa de Bloom is not responsible for photo delivery, editing, storage, or communication between guests and photographers. When sharing event content, we kindly encourage guests to tag Casa de Bloom and Kiwi Spa whenever possible.
              </p>
            </section>

            <hr className="border-ui-border" />

            <section className="space-y-2">
              <h2 className="font-bold text-base text-brand-dark uppercase tracking-wider">15. Featured Professionals</h2>
              <p>
                We welcome photographers, videographers, DJs, MCs, musicians, artists, content creators, performers, wellness providers, and other professionals who would like to contribute their talents. Professionals who donate their services to the community may be featured in a special Featured Professionals section within the Casa de Bloom Marketplace. Featured Professionals may receive additional visibility, profile placement, community recognition, and future collaboration opportunities. If you know someone talented who would enjoy participating, please invite them.
              </p>
            </section>

            <hr className="border-ui-border" />

            <section className="space-y-2">
              <h2 className="font-bold text-base text-brand-dark uppercase tracking-wider">16. Kiwi Spa Experience</h2>
              <p>
                One of our goals is to introduce guests to Kiwi Spa and our handcrafted skincare products created locally in San Diego. Guests may enjoy complimentary Kiwi Spa experiences, mini treatments, product sampling, skincare education, consultations, goodie bags, and special surprises. Everything is created with love right here in San Diego. Because these experiences are provided complimentary as part of our community philosophy, we kindly encourage guests to create a story, photo, reel, testimonial, or other content if they enjoy their experience. Please tag Kiwi Spa whenever possible. Your support helps us continue bringing these treatments, products, and experiences to the community.
              </p>
            </section>

            <hr className="border-ui-border" />

            <section className="space-y-2">
              <h2 className="font-bold text-base text-brand-dark uppercase tracking-wider">17. Optional Donations & Kiwi Love</h2>
              <p>
                Donations are welcome. Your support helps cover event setup, cleanup, complimentary Kiwi Spa services, guest gifts, future community events, marketplace development, and community initiatives.
              </p>
              <p>
                KIWI Love is our official nonprofit initiative supporting local dog rescue organizations and shelters. Guests who would like to help may make optional donations directly to KIWI Love through designated QR codes available on the dashboard and at the event. These donations are separate from Casa de Bloom event support. Participation is entirely optional, but deeply appreciated by the animals, shelters, and community organizations we support.
              </p>
            </section>

            <hr className="border-ui-border" />

            <section className="space-y-2">
              <h2 className="font-bold text-base text-brand-dark uppercase tracking-wider">18. Safety & Personal Responsibility</h2>
              <p>
                Casa de Bloom is a private home and community gathering space. Please understand that this is not a staffed commercial venue with security guards. Guests are responsible for their own personal belongings, personal safety, choices, interactions, and participation during the event.
              </p>
              <p>
                Please be respectful, aware, kind, and responsible. If you see something that needs attention, please notify the host or event team. Our goal is to create a safe, peaceful, respectful, and beautiful experience for everyone, and we ask every guest to help us protect that energy.
              </p>
            </section>

            <hr className="border-ui-border" />

            <section className="space-y-2">
              <h2 className="font-bold text-base text-brand-dark uppercase tracking-wider">19. Community Values</h2>
              <p className="italic font-medium">
                Be kind. Be respectful. Be generous. Be honest. Support one another. Respect the home. Respect the community. Respect each other’s belongings. Have fun. Meet new people. Share what you have. Celebrate what others bring. Create meaningful connections. Most importantly, enjoy the experience.
              </p>
            </section>

            <hr className="border-ui-border" />

            <section className="bg-brand-light/10 p-4 rounded-xl border border-brand-primary/20 space-y-2">
              <h2 className="font-bold text-brand-dark uppercase tracking-wide text-xs">20. Participation Agreement & Liability Waiver</h2>
              <p className="text-xs">
                By participating in the Casa de Bloom community-centered Reality Show experience, you confirm that:
              </p>
              <ul className="list-disc list-inside text-xs space-y-1 opacity-90">
                <li>I have read and understood the Casa de Bloom Community Guidelines and Terms.</li>
                <li>I understand that participation is voluntary.</li>
                <li>I understand that Casa de Bloom is a private home and community gathering space.</li>
                <li>I understand that all exchanges, agreements, and interactions between guests are their own responsibility.</li>
                <li>I agree to respect the home, the community, and other guests.</li>
                <li>I agree to follow the event guidelines and help create a positive experience for everyone.</li>
                <li>I confirm that I am at least 21 years of age.</li>
              </ul>
              <p className="text-xs pt-1 font-medium text-brand-primary">
                I am excited to participate in the Casa de Bloom community and look forward to connecting, sharing, and having fun.
              </p>
            </section>

          </div>

          <div className="pt-4 text-center">
            <button
              type="button"
              onClick={() => window.close()}
              className="px-6 py-2.5 bg-brand-primary hover:bg-brand-secondary text-white font-bold rounded-xl transition duration-200 cursor-pointer text-xs uppercase tracking-wider"
            >
              Close Window
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
