import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LiquidEther } from './LiquidEther';

/* =====================================================================
   SCROLL REVEAL HOOK
   ===================================================================== */

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.08 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* =====================================================================
   MAGNETIC TILT HOOK
   ===================================================================== */

function useTilt(strength = 12) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * strength}deg) rotateX(${-y * strength}deg) scale(1.025)`;
  }, [strength]);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = 'transform 0.45s cubic-bezier(0.16,1,0.3,1)';
    el.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) scale(1)';
    setTimeout(() => { if (el) el.style.transition = ''; }, 450);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, [onMove, onLeave]);

  return ref;
}

/* =====================================================================
   CURSOR GLOW
   ===================================================================== */

function CursorGlow() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos     = useRef({ x: -200, y: -200 });
  const ring    = useRef({ x: -200, y: -200 });
  const raf     = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove);

    const tick = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf.current); };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden />
      <div ref={ringRef} className="cursor-ring" aria-hidden />
    </>
  );
}

/* =====================================================================
   DATA
   ===================================================================== */

const CLIENTS = [
  '@vytok.studio', '@contentcraft_ua', '@editmymind', '@brandloop.co', '@reelhaus'
];

const STATS = [
  { num: '200+',  label: 'Videos delivered every month' },
  { num: '48h',   label: 'Average turnaround' },
  { num: '↑6.8%', label: 'Average CTR lift' },
  { num: '3×',    label: 'Faster than hiring in-house' },
];

const TICKER_A = ['Short-form reels', 'YouTube long-form', 'Thumbnails', 'On-brand consistency', 'Fast turnaround', 'Unlimited revisions', 'Dedicated editor'];
const TICKER_B = ['48h delivery', 'No long contracts', 'Real human editors', 'Ukrainian team', 'CTR-optimized', 'QA on every file', 'Same-day replies'];

const THUMBS = [
  { id: 1, tag: 'Video Testimonial', instagram: 'https://www.instagram.com/p/DU07FgIEV7z/embed' },
  { id: 2, tag: 'Video Testimonial', instagram: 'https://www.instagram.com/p/DTnWQpKjXHI/embed' },
  { id: 3, tag: 'Video Testimonial', instagram: 'https://www.instagram.com/p/DKQ7tX8tMK1/embed' },
  { id: 4, tag: 'Video Testimonial', instagram: 'https://www.instagram.com/p/DMflFPTRVmQ/embed' },
];

const SERVICES_LIST = [
  { num: '01', name: 'Short-form reels',     sub: 'TikTok · Instagram · YouTube Shorts — editing, captions, publishing.' },
  { num: '02', name: 'YouTube long-form',    sub: 'Full episodes, podcasts, vlogs — chapters, b-roll, color grading.' },
  { num: '03', name: 'Thumbnails',           sub: 'CTR-design built around click intent and your own data.' },
  { num: '04', name: 'Feed consistency',     sub: 'A single visual palette across every post.' },
];

const PROCESS_STEPS = [
  { num: '01', title: 'You send the footage',         desc: 'Files received same day. No special format required.' },
  { num: '02', title: 'Your editor takes the project',desc: 'Same editor every time. No repeated briefs.' },
  { num: '03', title: 'First cut in 48 hours',        desc: 'Full edit delivered. No exceptions, no excuses.' },
  { num: '04', title: 'Revisions until it\'s perfect', desc: 'Unlimited revision rounds. You approve when it\'s right.' },
];

const TESTIMONIALS = [
  {
    msgs: [
      { out: false, text: 'the video came out exactly how I imagined it 🔥 literally zero notes',                  time: '14:32' },
      { out: true,  text: 'love it! CTR is already at 6.8% — strong start',                                        time: '14:35' },
      { out: false, text: 'my old editor took 5 days minimum. you sent this in 36 hours',                          time: '14:36' },
    ]
  },
  {
    msgs: [
      { out: false, text: 'thumbnail redesign made a huge difference. 3.1% → 6.4% CTR in one week',                time: '09:11' },
      { out: true,  text: 'solid jump. face + contrast is the lever',                                              time: '09:15' },
      { out: false, text: 'not gonna lie, I had doubts, but you delivered. more projects coming',                  time: '09:16' },
    ]
  },
  {
    msgs: [
      { out: false, text: 'week 2 and my feed already looks like a completely different account',                  time: '18:04' },
      { out: true,  text: 'consistency hits fast. color lock-in was the turning point',                            time: '18:07' },
      { out: false, text: 'my followers literally asked if I rebranded lol',                                        time: '18:08' },
    ]
  },
];

const TEAM = [
  { init: 'M', name: 'Maria K.', role: 'Lead editor',        bio: 'Short- and long-form specialist. 5+ years in post-production. Edits for channels with 1M+ subscribers.' },
  { init: 'D', name: 'Diana S.', role: 'Motion editor',      bio: 'Transitions, pacing and brand consistency. Expert at building visual systems.' },
  { init: 'A', name: 'Alex P.',  role: 'Thumbnail designer', bio: 'CTR-design. Combines A/B data with visual storytelling. Every thumbnail built around the click.' },
  { init: 'N', name: 'Nikita V.',role: 'QA lead',            bio: 'Every file passes QA before it ships. Catches pacing, cut and brand-style issues.' },
];

const PLANS = [
  {
    tier: 'Starter', price: '799',
    items: ['4 short videos / week', 'Basic color grade', 'Captions and subtitles', '3-day turnaround', '2 revision rounds'],
    feat: false,
  },
  {
    tier: 'Creator', price: '1,499',
    items: ['8 short videos / week', '2 YouTube edits / month', 'Thumbnail design included', '48-hour turnaround', 'Unlimited revisions', 'Dedicated editor'],
    feat: true,
  },
  {
    tier: 'Studio', price: '2,499',
    items: ['Unlimited short videos', 'Unlimited long-form', 'Full thumbnail system', 'Priority 24h turnaround', '2-person team', 'Weekly strategy call'],
    feat: false,
  },
];

/* =====================================================================
   MARQUEE
   ===================================================================== */

function Marquee({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const str = items.join('  ·  ') + '  ·  ';
  return (
    <div className="marquee">
      <div className={`marquee__track${reverse ? ' marquee__track--rev' : ''}`}>
        <span aria-hidden>{str}</span>
        <span aria-hidden>{str}</span>
        <span aria-hidden>{str}</span>
      </div>
    </div>
  );
}

/* =====================================================================
   NAV
   ===================================================================== */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 28);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const close = () => setOpen(false);

  return (
    <nav className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <div className="nav__inner">
        <a href="#top" className="nav__logo">CUTFRAME</a>
        <div className={`nav__links${open ? ' nav__links--open' : ''}`}>
          <a href="#video-reviews" className="nav__link" onClick={close}>Work</a>
          <a href="#process"       className="nav__link" onClick={close}>Process</a>
          <a href="#team"          className="nav__link" onClick={close}>Team</a>
          <a href="#pricing"       className="nav__link" onClick={close}>Pricing</a>
          <a href="v2/"            className="nav__link" onClick={close}>Founders</a>
          <a href="#contact"       className="nav__cta"  onClick={close}>Start a project →</a>
        </div>
        <button className="nav__hamburger" onClick={() => setOpen(v => !v)} aria-label="Toggle menu">
          {open ? '✕' : '≡'}
        </button>
      </div>
    </nav>
  );
}

/* =====================================================================
   HERO
   ===================================================================== */

function Hero() {
  const floatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf: number;
    let t = 0;
    const tick = () => {
      t += 0.012;
      if (floatRef.current) {
        floatRef.current.style.transform = `translateY(${Math.sin(t) * 6}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="hero" id="top">
      <div className="hero__bg">
        <LiquidEther
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
          mouseForce={22}
          cursorSize={150}
          resolution={0.48}
          autoDemo={true}
          autoSpeed={0.28}
          autoIntensity={2.5}
          autoRampDuration={1.2}
          BFECC={true}
        />
      </div>
      <div className="hero__overlay" />

      <div className="hero__content">
        <div className="hero__badge">Ukrainian video editors 🇺🇦</div>

        <h1 className="hero__h1">
          Stop <span className="hero__h1-yellow">editing</span><br />
          your own videos.
        </h1>

        <p className="hero__sub">
          A team of Ukrainian video editors takes over your post-production —
          reels, YouTube edits, thumbnails. You shoot. We ship.
        </p>

        <div className="hero__actions">
          <a href="#contact" className="btn-primary">Start a project →</a>
          <a href="#video-reviews" className="btn-ghost">See the work</a>
        </div>
      </div>

      {/* floating delivery card */}
      <div className="hero__float" ref={floatRef}>
        <div className="hero__float-icon">✓</div>
        <div>
          <div className="hero__float-title">YouTube Ep. 46 — Done</div>
          <div className="hero__float-sub">Delivered · 2 minutes ago</div>
        </div>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span className="hero__scroll-label">scroll</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}

/* =====================================================================
   STATS
   ===================================================================== */

function CountNum({ value }: { value: string }) {
  const ref    = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.5 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const match  = value.match(/^([↑+]?)(\d[\d,]*)([+×h%]?)$/);
  const prefix = match ? match[1] : '';
  const raw    = match ? parseInt(match[2].replace(/,/g, ''), 10) : NaN;
  const suffix = match ? match[3] : '';
  const [display, setDisplay] = useState(match ? '0' : value);

  useEffect(() => {
    if (!shown || isNaN(raw)) { setDisplay(value); return; }
    let start: number | null = null;
    const duration = 1400;
    const ease = (t: number) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const cur = Math.round(ease(p) * raw);
      setDisplay(raw >= 1000 ? cur.toLocaleString() : String(cur));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [shown, raw, value]);

  return (
    <div ref={ref} className="stat-num">
      {match ? `${prefix}${display}${suffix}` : value}
    </div>
  );
}

function Stats() {
  return (
    <section className="stats-section reveal">
      <div className="stats-strip">
        {STATS.map((s, i) => (
          <div key={s.num} className={`stat-cell${i < STATS.length - 1 ? ' stat-cell--border' : ''}`}>
            <CountNum value={s.num} />
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =====================================================================
   SERVICES
   ===================================================================== */

function Services() {
  return (
    <section className="services-section">
      <div className="container">
        <div className="services-eyebrow reveal">What we do</div>
        {SERVICES_LIST.map((svc) => (
          <div key={svc.num} className="svc-row reveal">
            <div className="svc-row__num">{svc.num}</div>
            <div className="svc-row__center">
              <div className="svc-row__name">{svc.name}</div>
              <div className="svc-row__sub">{svc.sub}</div>
            </div>
            <div className="svc-row__arrow">→</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =====================================================================
   WORK
   ===================================================================== */

function Work() {
  return (
    <section className="section" id="work">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-num">Our work</div>
          <h2 className="section-h2">Client video<br />testimonials.</h2>
        </div>
      </div>

      <div className="work-grid-fullbleed reveal">
        {THUMBS.map(t => (
          <div key={t.id} className="thumb thumb--video">
            <iframe
              src={t.instagram}
              frameBorder="0"
              scrolling="no"
              allowTransparency
              allow="encrypted-media"
              title={t.tag}
              className="thumb__iframe"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/* =====================================================================
   BIG QUOTE
   ===================================================================== */

function BigQuote() {
  return (
    <section className="quote-section">
      <div className="quote-inner reveal">
        <div className="quote-mark">"</div>
        <p className="quote-text">
          From 3% to 6.4% CTR in the first week. My old editor took five days. These guys shipped it in 36 hours.
        </p>
        <div className="quote-attr">— @contentcraft_ua · 240K followers</div>
      </div>
    </section>
  );
}

/* =====================================================================
   PROCESS
   ===================================================================== */

function Process() {
  return (
    <section className="section" id="process">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-num">How it works</div>
          <h2 className="section-h2">Simple.<br />Repeatable.<br />Reliable.</h2>
        </div>

        <div className="process-list">
          {PROCESS_STEPS.map((step) => (
            <div key={step.num} className="process-step reveal">
              <div className="process-step__top-line" />
              <div className="process-step__inner">
                <div className="process-step__num" aria-hidden>{step.num}</div>
                <div className="process-step__body">
                  <div className="process-step__title">{step.title}</div>
                  <div className="process-step__desc">{step.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
   TESTIMONIALS
   ===================================================================== */

function Testimonials() {
  return (
    <section className="section section--alt">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-num">Testimonials</div>
          <h2 className="section-h2">Real messages.<br />Real results.</h2>
        </div>

        <div className="testi-grid reveal">
          {TESTIMONIALS.map((t, ti) => (
            <div key={ti} className="testi-card">
              <div className="testi-bar">
                <span className="testi-bar__platform">Telegram</span>
                <span className="testi-bar__online" />
              </div>
              <div className="testi-msgs">
                {t.msgs.map((msg, mi) => (
                  <div key={mi} className={`testi-msg${msg.out ? ' testi-msg--out' : ''}`}>
                    <div className="testi-bubble">{msg.text}</div>
                    <span className="testi-time">{msg.time}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
   VIDEO TESTIMONIALS
   ===================================================================== */

const VIDEO_TESTIMONIALS = [
  { url: 'https://www.instagram.com/p/DU07FgIEV7z/', caption: 'Thank you Tayo' },
  { url: 'https://www.instagram.com/p/DTnWQpKjXHI/', caption: 'Thank you, Carter' },
  { url: 'https://www.instagram.com/p/DKQ7tX8tMK1/', caption: 'Client testimonial' },
  { url: 'https://www.instagram.com/p/DMflFPTRVmQ/', caption: 'Thank you Jeremy' },
];

function VideoTestimonials() {
  return (
    <section className="section" id="video-reviews">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-num">Real founders. Real editors. Real outcomes.</div>
          <h2 className="section-h2">Video testimonials.</h2>
        </div>

        <div className="video-testi-grid reveal">
          {VIDEO_TESTIMONIALS.map((v, i) => (
            <div key={i} className="video-testi-card">
              <iframe
                src={`${v.url}embed`}
                frameBorder="0"
                scrolling="no"
                allowTransparency
                allow="encrypted-media"
                title={v.caption}
                className="video-testi-iframe"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
   TEAM
   ===================================================================== */

function Team() {
  return (
    <section className="section" id="team">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-num">Team</div>
          <h2 className="section-h2">The editors</h2>
        </div>

        <div className="team-list">
          {TEAM.map(m => (
            <div key={m.name} className="team-row reveal">
              <div className="team-row__left">
                <div className="team-row__name">{m.name}</div>
                <div className="team-row__role">{m.role}</div>
              </div>
              <div className="team-row__bio">{m.bio}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
   PRICING
   ===================================================================== */

function FeaturedCard({ plan }: { plan: typeof PLANS[0] }) {
  const tiltRef = useTilt(8);
  return (
    <div ref={tiltRef} className="pricing-card pricing-card--feat" style={{ willChange: 'transform' }}>
      <span className="pricing-feat-badge">Most popular</span>
      <div className="pricing-tier">{plan.tier}</div>
      <div className="pricing-price"><sup>$</sup>{plan.price}</div>
      <div className="pricing-period">per month</div>
      <div className="pricing-line" />
      <ul className="pricing-list">
        {plan.items.map((item, i) => (
          <li key={i} className={`pricing-item${i === 0 ? ' pricing-item--hi' : ''}`}>{item}</li>
        ))}
      </ul>
      <button className="pricing-btn">Get started →</button>
    </div>
  );
}

function Pricing() {
  return (
    <section className="section section--alt" id="pricing">
      <div className="container">
        <div className="section-header section-header--center reveal">
          <div className="section-num">Pricing</div>
          <h2 className="section-h2">Simple pricing</h2>
          <p className="section-sub">No hidden fees. No long-term commitments. Cancel any month.</p>
        </div>

        <div className="pricing-grid reveal">
          {PLANS.map(plan =>
            plan.feat
              ? <FeaturedCard key={plan.tier} plan={plan} />
              : (
                <div key={plan.tier} className="pricing-card">
                  <div className="pricing-tier">{plan.tier}</div>
                  <div className="pricing-price"><sup>$</sup>{plan.price}</div>
                  <div className="pricing-period">per month</div>
                  <div className="pricing-line" />
                  <ul className="pricing-list">
                    {plan.items.map((item, i) => (
                      <li key={i} className={`pricing-item${i === 0 ? ' pricing-item--hi' : ''}`}>{item}</li>
                    ))}
                  </ul>
                  <button className="pricing-btn">Get started →</button>
                </div>
              )
          )}
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
   CTA
   ===================================================================== */

function CTA() {
  return (
    <section className="cta-section" id="contact">
      <div className="cta-glow" aria-hidden />
      <div className="container">
        <div className="cta-box reveal">
          <div className="cta-eyebrow">Ready?</div>
          <h2 className="cta-h2">Let's work.</h2>
          <p className="cta-sub">
            Tell us about your content. We'll match the right editor
            and deliver a trial edit in 48 hours — no commitment.
          </p>
          <div className="cta-btns">
            <a href="https://calendly.com/pechenchis/strategy-call" target="_blank" rel="noopener noreferrer" className="btn-primary btn-primary--lg">
              Book a strategy call →
            </a>
            <a href="mailto:hello@cutframe.studio" className="btn-ghost btn-ghost--lg">
              hello@cutframe.studio
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
   FOOTER
   ===================================================================== */

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <span className="footer__logo">CUTFRAME</span>
        <div className="footer__links">
          <a href="#video-reviews" className="footer__link">Work</a>
          <a href="#process"       className="footer__link">Process</a>
          <a href="#pricing"       className="footer__link">Pricing</a>
          <a href="v2/"            className="footer__link">Founders</a>
          <a href="#contact"       className="footer__link">Contact</a>
        </div>
        <span className="footer__copy">© 2025 Cutframe</span>
      </div>
    </footer>
  );
}

/* =====================================================================
   APP
   ===================================================================== */

export default function App() {
  useScrollReveal();

  return (
    <>
      <CursorGlow />
      <Nav />
      <Hero />
      <Marquee items={TICKER_A} />
      <Stats />
      <Services />
      <BigQuote />
      <Process />
      <Marquee items={TICKER_B} reverse />
      <Testimonials />
      <VideoTestimonials />
      <Team />
      <Pricing />
      <CTA />
      <Footer />
    </>
  );
}
