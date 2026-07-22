import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Website Unavailable | Payment Dispute",
  description:
    "This website has been withdrawn by its developer while an unresolved payment dispute remains outstanding.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-5 py-12 text-neutral-900 sm:px-8">
      <section className="w-full max-w-2xl">
        <div className="mb-8 border-b border-neutral-200 pb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-600">
            Service notice
          </p>
          <p className="mt-1 text-sm text-neutral-500">Posted by the website developer</p>
        </div>

        <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          This website is currently unavailable.
        </h1>

        <div className="mt-7 space-y-5 text-base leading-8 text-neutral-700 sm:text-lg">
          <p>
            More than <strong className="font-semibold text-neutral-950">100 hours of development work</strong>{" "}
            were completed for this project. According to the developer&apos;s records, no payment has
            been received for that work.
          </p>
          <p>
            Because the outstanding balance remains unresolved, the developer has withdrawn the
            website pending a fair resolution of the billing dispute.
          </p>
        </div>

        <dl className="mt-9 grid border-y border-neutral-200 sm:grid-cols-2">
          <div className="py-4 sm:border-r sm:border-neutral-200 sm:pr-6">
            <dt className="text-sm text-neutral-500">Work completed</dt>
            <dd className="mt-1 font-semibold text-neutral-900">100+ development hours</dd>
          </div>
          <div className="border-t border-neutral-200 py-4 sm:border-t-0 sm:pl-6">
            <dt className="text-sm text-neutral-500">Payment status</dt>
            <dd className="mt-1 font-semibold text-neutral-900">No payment received</dd>
          </div>
        </dl>

        <aside className="mt-9 border-l-2 border-neutral-900 pl-5 text-sm leading-6 text-neutral-600">
          <strong className="font-semibold text-neutral-900">A note to fellow professionals:</strong>{" "}
          protect your work with a signed agreement, an upfront deposit, and milestone-based
          payments before committing substantial time to a project.
        </aside>

        <p className="mt-8 text-xs leading-5 text-neutral-400">
          This notice presents the developer&apos;s account of an ongoing private payment dispute.
        </p>
      </section>
    </main>
  );
}
