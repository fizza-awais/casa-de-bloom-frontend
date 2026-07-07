"use client";

import { useRef, useState } from "react";

interface ComplianceStepProps {
  formData: Record<string, any>;
  errors: Record<string, string>;
  onFieldChange: (name: string, value: any) => void;
}

export default function ComplianceStep({
  formData,
  errors,
  onFieldChange,
}: ComplianceStepProps) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const guidelinesRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = guidelinesRef.current;
    if (el && el.scrollHeight - el.scrollTop <= el.clientHeight + 5) {
      setHasScrolled(true);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-brand-primary uppercase tracking-widest">
          Casa de Bloom Community Guidelines
        </h4>
        <div className="relative">
          <div
            ref={guidelinesRef}
            onScroll={handleScroll}
            className="h-64 overflow-y-auto bg-ui-card/40 border border-ui-border rounded-xl p-4 text-[13px] text-ui-text-main leading-relaxed shadow-inner custom-scrollbar space-y-4 text-left"
          >
            <div>
              <p className="font-bold text-sm mb-1">Welcome to Casa de Bloom.</p>
              <p>This is a fun-first community experience built around connection, generosity, creativity, and trade. Casa de Bloom Trade Parties are created to bring good people together in a beautiful, relaxed, community-centered environment.</p>
              <p className="mt-2 font-medium">Our goal is simple: To connect, to share, to trade, to support one another, to create content, to meet new people, and to enjoy a beautiful day together.</p>
              <p className="mt-2">Casa de Bloom is not a traditional networking event, trade show, vendor market, or sales presentation. It is a community gathering where people exchange value through items, services, skills, ideas, opportunities, friendships, and genuine human connection. Business is welcome, but community comes first.</p>
            </div>

            <hr className="border-ui-border" />

            <div>
              <p className="font-bold uppercase text-xs text-brand-dark tracking-wider mb-1">REGISTRATION & PRIVATE GUEST INVITATION</p>
              <p>All guests must register in advance. After completing registration and confirming your donation, you will receive your Casa de Bloom Private Guest Invitation. Please bring your invitation confirmation to the event. No walk-ins, please. Registration helps us prepare refreshments, seating, gifts, Kiwi Spa experiences, staffing, and event flow.</p>
            </div>

            <div>
              <p className="font-bold uppercase text-xs text-brand-dark tracking-wider mb-1">REGISTRATION DONATIONS & CANCELLATIONS</p>
              <p>All registration donations are non-refundable. If you are unable to attend an event, you may either:</p>
              <ul className="list-disc list-inside ml-2 mt-1 space-y-0.5">
                <li>Transfer your invitation to a friend by notifying our team in advance.</li>
                <li>Apply your donation toward a future Casa de Bloom event.</li>
              </ul>
              <p className="mt-1">Please email us as soon as possible if your plans change so we can update our guest list accordingly. Thank you for helping us plan and prepare the best possible experience for our community.</p>
            </div>

            <div>
              <p className="font-bold uppercase text-xs text-brand-dark tracking-wider mb-1">AGE REQUIREMENT</p>
              <p>Casa de Bloom Trade Parties are adult-only events (21+). By registering, guests confirm that they are at least 21 years of age. Because alcoholic beverages may be present at the event, Casa de Bloom reserves the right to request age verification if needed. Guests who appear under the age of 30 may be asked to provide a valid government-issued photo ID during registration or check-in. Thank you for helping us maintain a safe and legally compliant event environment.</p>
            </div>

            <div>
              <p className="font-bold uppercase text-xs text-brand-dark tracking-wider mb-1">NAME TAGS & DRINK TAGS</p>
              <p>All guests are required to wear a visible name tag with their First and Last Name. This helps us verify registration, welcome guests properly, and make it easier for everyone to connect. Please also bring a small marker, ribbon, charm, sticker, or tag for your cup or glass. This helps everyone identify their own drink and reduces unnecessary waste during the event.</p>
            </div>

            <div>
              <p className="font-bold uppercase text-xs text-brand-dark tracking-wider mb-1">FREE MARKETPLACE</p>
              <p>All registered guests receive access to the Casa de Bloom Marketplace at no additional cost. The Marketplace is a free community resource created to help members stay connected between events, showcase their businesses, promote services, share trade items, exchange opportunities, and build relationships. You may create a profile, upload photos, add your business information, share your services, and connect with other members of the community. You choose what information is visible publicly. Privacy settings remain under your control at all times. Our goal is simple: Help good people find each other, support one another, and create value together.</p>
            </div>

            <div>
              <p className="font-bold uppercase text-xs text-brand-dark tracking-wider mb-1">BUSINESS CONNECTIONS</p>
              <p>Many guests own businesses, offer services, create products, or work on exciting projects. To help everyone spend more time enjoying the event and less time giving long business explanations, we encourage guests to create a short 1–2 minute introduction video. You may upload it to YouTube and add the link to your Marketplace profile. You can also keep the link on your phone and share it with people you meet. This helps guests quickly learn about one another and return to what matters most: Having fun, meeting great people, and building genuine connections.</p>
            </div>

            <div>
              <p className="font-bold uppercase text-xs text-brand-dark tracking-wider mb-1">BUSINESSES, SPONSORS & COMMUNITY PARTNERS</p>
              <p>We welcome businesses, brands, sponsors, creators, and community partners. Rather than traditional sales presentations, we encourage businesses to create fun experiences, games, contests, demonstrations, giveaways, or interactive activities that bring people together. The goal is engagement, connection, and community. Guests naturally remember businesses that create memorable experiences. We also welcome sponsors, product donations, samples, giveaways, volunteer support, and community contributions that help make the event even more enjoyable for everyone.</p>
            </div>

            <div>
              <p className="font-bold uppercase text-xs text-brand-dark tracking-wider mb-1">TRADING ITEMS</p>
              <p>We encourage guests to bring photos of larger trade items rather than bringing many physical items into the event. If you choose to bring physical items, we recommend keeping them in your vehicle until a trade is arranged. If another guest is interested, you may complete the trade directly with that person. Casa de Bloom is not responsible for personal items, lost items, damaged items, trades, exchanges, agreements, or transactions between guests. All trades are completed directly between attendees.</p>
            </div>

            <div>
              <p className="font-bold uppercase text-xs text-brand-dark tracking-wider mb-1">GIVE & TAKE COMMUNITY TABLE</p>
              <p>We will have a Give & Take Community Table. This table is created in the spirit of generosity and fun. Guests are encouraged to bring small items they no longer use and would love to share with the community. Examples may include books, accessories, jewelry, beauty products, small gifts, home items, creative supplies, wellness items, or other small treasures.</p>
              <p className="mt-1 font-medium">General guideline: Bring one, take one. Bring two, take one. Bring three, take two. The goal is to keep the table balanced while giving beautiful things a new home.</p>
            </div>

            <div>
              <p className="font-bold uppercase text-xs text-brand-dark tracking-wider mb-1">POTLUCK COMMUNITY TABLE & GRILL</p>
              <p>Casa de Bloom events are community-style potluck gatherings. Please bring both: A favorite dish or snack to share, and a beverage to share. We will also provide refreshments, mojitos, and community treats. Together we create one beautiful table.</p>
              <p className="mt-1">Casa de Bloom has a community grill available. If you would like to bring something for the grill, please let us know during registration so we can plan accordingly. Hot dogs, sausages, vegetables, kabobs, plant-based options, and other grill-friendly foods are welcome.</p>
            </div>

            <div>
              <p className="font-bold uppercase text-xs text-brand-dark tracking-wider mb-1">CASA DE BLOOM COMMUNITY CONTRIBUTIONS</p>
              <p>We are always looking for ways to make Casa de Bloom more beautiful, comfortable, creative, and enjoyable for our community. If you have decor, artwork, furniture, lighting, plants, lounge pieces, photo props, outdoor items, or other beautiful things that you no longer use and would love to see bringing joy to others, we would be happy to consider them. Before bringing any items, please email photos to our team with the subject line: “Casa de Bloom Contribution”. Because our space is limited, we can only accept items that we are able to use immediately within Casa de Bloom.</p>
            </div>

            <div>
              <p className="font-bold uppercase text-xs text-brand-dark tracking-wider mb-1">POOL & HOT TUB</p>
              <p>Many guests enjoy the pool and hot tub during Casa de Bloom events. Please bring anything you may need to feel comfortable throughout the day, including a swimsuit, towel, sunscreen, and a change of clothes.</p>
            </div>

            <div>
              <p className="font-bold uppercase text-xs text-brand-dark tracking-wider mb-1">PHOTOGRAPHY & CONTENT</p>
              <p>Photographers, videographers, and content creators may be present during the event. By attending, guests understand that photos and videos may be taken throughout the property. Guests grant Casa de Bloom permission to use event photos and videos for social media, marketing, promotional, educational, and community purposes. If a photographer takes your photos, please exchange contact information directly with that photographer. Guests are responsible for coordinating photo delivery directly with the photographer. Casa de Bloom is not responsible for photo delivery, editing, storage, or communication between guests and photographers. When sharing event content, we kindly encourage guests to tag Casa de Bloom and Kiwi Spa whenever possible.</p>
            </div>

            <div>
              <p className="font-bold uppercase text-xs text-brand-dark tracking-wider mb-1">FEATURED PROFESSIONALS</p>
              <p>We welcome photographers, videographers, DJs, MCs, musicians, artists, content creators, performers, wellness providers, and other professionals who would like to contribute their talents. Professionals who donate their services to the community may be featured in a special Featured Professionals section within the Casa de Bloom Marketplace. Featured Professionals may receive additional visibility, profile placement, community recognition, and future collaboration opportunities. If you know someone talented who would enjoy participating, please invite them.</p>
            </div>

            <div>
              <p className="font-bold uppercase text-xs text-brand-dark tracking-wider mb-1">KIWI SPA EXPERIENCE</p>
              <p>One of our goals is to introduce guests to Kiwi Spa and our handcrafted skincare products created locally in San Diego. Guests may enjoy complimentary Kiwi Spa experiences, mini treatments, product sampling, skincare education, consultations, goodie bags, and special surprises. Everything is created with love right here in San Diego. Because these experiences are provided complimentary as part of our community trade philosophy, we kindly encourage guests to create a story, photo, reel, testimonial, or other content if they enjoy their experience. Please tag Kiwi Spa whenever possible. Your support helps us continue bringing these treatments, products, and experiences to the community.</p>
            </div>

            <div>
              <p className="font-bold uppercase text-xs text-brand-dark tracking-wider mb-1">REGISTRATION DONATIONS & KIWI LOVE</p>
              <p>Your registration donation helps support event setup, refreshments, staffing, guest gifts, Kiwi Spa experiences, Marketplace development, cleanup, and future community programs.</p>
              <p className="mt-1">KIWI Love is our official nonprofit initiative supporting local dog rescue organizations and shelters. Guests who would like to help may make optional donations directly to KIWI Love through designated QR codes available during registration and at the event. These donations are separate from event registration donations. Participation is entirely optional, but deeply appreciated by the animals, shelters, and community organizations we support.</p>
            </div>

            <div>
              <p className="font-bold uppercase text-xs text-brand-dark tracking-wider mb-1">SAFETY & PERSONAL RESPONSIBILITY</p>
              <p>Casa de Bloom is a private home and community gathering space. Please understand that this is not a staffed commercial venue with security guards. Guests are responsible for their own personal belongings, personal safety, choices, interactions, and participation during the event. Please be respectful, aware, kind, and responsible. If you see something that needs attention, please notify the host or event team. Our goal is to create a safe, peaceful, respectful, and beautiful experience for everyone, and we ask every guest to help us protect that energy.</p>
            </div>

            <div>
              <p className="font-bold uppercase text-xs text-brand-dark tracking-wider mb-1">COMMUNITY VALUES</p>
              <p className="italic font-medium">Be kind. Be respectful. Be generous. Be honest. Support one another. Respect the home. Respect the community. Respect each other’s belongings. Have fun. Meet new people. Share what you have. Celebrate what others bring. Create meaningful connections. Most importantly, enjoy the experience.</p>
            </div>

            <hr className="border-ui-border" />

            <div className="bg-brand-light/10 p-3 rounded-lg border border-brand-primary/20 text-xs space-y-1">
              <p className="font-bold text-brand-dark uppercase">PARTICIPATION AGREEMENT</p>
              <p>By signing below, I confirm that:</p>
              <ul className="list-disc list-inside space-y-0.5 opacity-90">
                <li>I have read and understood the Casa de Bloom Trade Party Community Guidelines.</li>
                <li>I understand that participation is voluntary.</li>
                <li>I understand that Casa de Bloom is a private home and community gathering space.</li>
                <li>I understand that all trades, exchanges, agreements, and interactions between guests are their own responsibility.</li>
                <li>I agree to respect the home, the community, and other guests.</li>
                <li>I agree to follow the event guidelines and help create a positive experience for everyone.</li>
                <li>I confirm that I am at least 21 years of age.</li>
              </ul>
              <p className="pt-1 font-medium text-brand-primary">I am excited to participate in the Casa de Bloom community and look forward to connecting, sharing, trading, and having fun.</p>
            </div>

          </div>
          {!hasScrolled && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-ui-card/60 to-transparent pointer-events-none rounded-b-xl" />
          )}
        </div>
        {!hasScrolled && (
          <p className="text-[11px] text-ui-text-muted flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-sunshine animate-pulse" />
            Scroll to the end to unlock the check authorizations below
          </p>
        )}
      </div>

      <div className="space-y-4 pt-2">
        <div>
          <label
            className={`flex items-start gap-3 text-sm font-medium ${
              !hasScrolled
                ? "text-ui-text-muted opacity-50 cursor-not-allowed"
                : "text-ui-text-main cursor-pointer"
            }`}
          >
            <input
              type="checkbox"
              checked={!!formData.guidelinesAccepted}
              onChange={(e) => onFieldChange("guidelinesAccepted", e.target.checked)}
              disabled={!hasScrolled}
              className="mt-1 self-start shrink-0 accent-brand-primary h-4 w-4 rounded cursor-pointer disabled:cursor-not-allowed"
            />
            <span>I have scrolled through and completely accept the Community Guidelines charter. *</span>
          </label>
          {errors.guidelinesAccepted && (
            <p className="text-xs text-danger-500 mt-1 pl-7 font-medium">{errors.guidelinesAccepted}</p>
          )}
        </div>
        <div>
          <label className="flex items-start gap-3 text-sm text-ui-text-main font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={!!formData.ageConfirmed}
              onChange={(e) => onFieldChange("ageConfirmed", e.target.checked)}
              className="mt-1 self-start shrink-0 accent-brand-primary h-4 w-4 rounded cursor-pointer"
            />
            <span>I confirm verification parameters of at least 21 years of age. *</span>
          </label>
          {errors.ageConfirmed && (
            <p className="text-xs text-danger-500 mt-1 pl-7 font-medium">{errors.ageConfirmed}</p>
          )}
        </div>
        <div>
          <label className="flex items-start gap-3 text-sm text-ui-text-main font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={!!formData.photoReleaseAccepted}
              onChange={(e) => onFieldChange("photoReleaseAccepted", e.target.checked)}
              className="mt-1 self-start shrink-0 accent-brand-primary h-4 w-4 rounded cursor-pointer"
            />
            <span>
              I grant Casa de Bloom administrative permissions to integrate event media distributions. *
            </span>
          </label>
          {errors.photoReleaseAccepted && (
            <p className="text-xs text-danger-500 mt-1 pl-7 font-medium">{errors.photoReleaseAccepted}</p>
          )}
        </div>
      </div>
    </div>
  );
}
