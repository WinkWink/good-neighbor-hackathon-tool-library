import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-7xl space-y-20 px-6 py-10 md:px-8 md:py-14">
        <section className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <Image
                src="/branding/toolbox-icon.png"
                alt="Good Neighbor Toolbox icon"
                width={44}
                height={44}
                className="h-11 w-11"
                priority
              />
              <span className="philly-badge">Philly</span>
            </div>

            <div className="space-y-5">
              <h1 className="brand-heading text-5xl leading-[0.95] md:text-7xl">
                Good Neighbor
                <br />
                Tool Box
              </h1>

              <p className="brand-subtext max-w-2xl text-xl md:text-2xl">
                Borrow. Build. Belong.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="tag-yellow">Borrow tools</span>
              <span className="tag-yellow">Share resources</span>
              <span className="tag-yellow">Build community</span>
            </div>

            <p className="brand-subtext max-w-2xl text-base leading-8 md:text-lg">
              Good Neighbor Toolbox is a community-powered lending library that
              connects neighbors in Philadelphia to share tools and equipment.
              Browse what’s available nearby, lend what you already own, and
              make it easier for your neighborhood to build, repair, and create
              together.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/browse" className="btn-primary">
                Browse Tools
              </Link>
              <Link href="/signup" className="btn-secondary">
                Create a Profile
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[760px]">
              <Image
                src="/branding/toolbox-toolbox-4.png"
                alt="Illustration of neighbors sharing tools"
                width={900}
                height={700}
                priority
                className="h-auto w-full"
              />
            </div>
          </div>
        </section>

        <section className="section-shell overflow-hidden rounded-[32px] px-6 py-10 md:px-10 md:py-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_260px] lg:items-center">
            <div className="space-y-5">
              <div className="space-y-3">
                <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#F4FF52]">
                  Our Mission
                </p>
                <h2 className="brand-heading text-3xl md:text-4xl">
                  Sharing tools. Strengthening neighborhoods.
                </h2>
              </div>

              <p className="brand-subtext max-w-3xl text-lg leading-8">
                Good Neighbor Toolbox strengthens communities by connecting
                neighbors to share tools, skills, and resources.
              </p>

              <p className="brand-subtext max-w-3xl leading-8">
                Instead of buying tools for one-time projects, neighbors can
                borrow what they need from people nearby and share what they
                already own. The result is less waste, more connection, and a
                stronger local community.
              </p>
            </div>

            <div className="flex justify-center lg:justify-end">
              <Image
                src="/branding/toolbox-toolbox-5.png"
                alt="Good Neighbor Toolbox logo"
                width={280}
                height={280}
                className="h-auto w-[180px] md:w-[220px]"
              />
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="mx-auto max-w-3xl space-y-3 text-center">
            <h2 className="brand-heading text-3xl md:text-4xl">How it works</h2>
            <p className="brand-subtext leading-7">
              A simple, searchable platform for borrowing and lending tools in
              your neighborhood.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="glass-card h-full rounded-[28px] p-6 md:p-7">
              <p className="mb-4 text-sm font-extrabold tracking-[0.2em] text-[#F4FF52]">
                01
              </p>
              <h3 className="mb-3 text-2xl font-bold text-white">
                Create a profile
              </h3>
              <p className="brand-subtext leading-7">
                Sign up, add your neighborhood, and share your interests and
                tool-sharing preferences.
              </p>
            </div>

            <div className="glass-card h-full rounded-[28px] p-6 md:p-7">
              <p className="mb-4 text-sm font-extrabold tracking-[0.2em] text-[#F4FF52]">
                02
              </p>
              <h3 className="mb-3 text-2xl font-bold text-white">
                Browse nearby tools
              </h3>
              <p className="brand-subtext leading-7">
                Search by location, tool type, or project to find what’s
                available near you.
              </p>
            </div>

            <div className="glass-card h-full rounded-[28px] p-6 md:p-7">
              <p className="mb-4 text-sm font-extrabold tracking-[0.2em] text-[#F4FF52]">
                03
              </p>
              <h3 className="mb-3 text-2xl font-bold text-white">
                Lend what you own
              </h3>
              <p className="brand-subtext leading-7">
                List tools you already have and help your community save money
                while building together.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-14">
          <div className="order-2 lg:order-1">
            <Image
              src="/branding/toolbox-toolbox-3.png"
              alt="Illustration of neighbors carrying tools"
              width={1100}
              height={520}
              className="h-auto w-full"
            />
          </div>

          <div className="order-1 space-y-6 lg:order-2">
            <div className="space-y-3">
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#F4FF52]">
                Built for neighbors
              </p>
              <h2 className="brand-heading text-3xl md:text-4xl">
                Designed to feel welcoming, useful, and local
              </h2>
              <p className="brand-subtext leading-8">
                Good Neighbor Toolbox is designed to feel accessible, inviting,
                bold, and handcrafted — a tool-sharing experience centered on
                real people, real projects, and local connection.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="tag-green">Accessible</span>
              <span className="tag-green">Inviting</span>
              <span className="tag-green">Bold</span>
              <span className="tag-green">Handcrafted</span>
            </div>

            <p className="brand-subtext leading-8">
              Whether someone needs a ladder for one weekend, a drill for a home
              repair, or a way to meet others who like building and making, this
              platform helps turn shared tools into shared community.
            </p>
          </div>
        </section>

        <section className="section-shell rounded-[32px] px-6 py-10 md:px-10 md:py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-3">
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#F4FF52]">
                Get started
              </p>
              <h2 className="brand-heading text-3xl md:text-4xl">
                Ready to get started?
              </h2>
              <p className="brand-subtext max-w-2xl leading-8">
                Browse tools near you, create a profile, and start sharing
                resources with your neighborhood.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/browse" className="btn-primary">
                Start Browsing
              </Link>
              <Link href="/login" className="btn-secondary">
                Log In
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
