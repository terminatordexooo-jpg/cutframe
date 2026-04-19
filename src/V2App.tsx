import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LiquidEther } from './LiquidEther';

/* =====================================================================
   Shared hooks (copied from App.tsx to keep V2 self-contained)
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

function useTilt(strength = 8) {
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
      if (dotRef.current)  dotRef.current.style.transform  = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf.current); };
  }, []);
  return (<>
    <div ref={dotRef}  className="cursor-dot"  aria-hidden />
    <div ref={ringRef} className="cursor-ring" aria-hidden />
  </>);
}

/* =====================================================================
   DATA
   ===================================================================== */

const STATS = [
  { num: '7 days',    label: 'Editor fully live on your team' },
  { num: 'Same-day',  label: 'Turnaround on agreed clip volume' },
  { num: '↑60%',      label: 'Revision time cut for agency clients' },
  { num: '0×',        label: 'Midnight editing sessions' },
];

const TICKER_A = [
  'Full-time Ukrainian editor', 'Same-day turnaround', '7-day placement',
  'No micromanagement', 'Captions + thumbnails', 'Weekly content recap', 'Backup editors ready'
];
const TICKER_B = [
  '30-day fit guarantee', 'Turnaround guarantee', 'Real operators',
  'Trained on your ICP', 'Short + long form', 'Multi-platform repurposing', 'Scale to more seats'
];

const PAIN = [
  { num: '01', text: "You're making real money, but still chopping clips at midnight.",             tag: 'Midnight grind' },
  { num: '02', text: "You've tried VAs and 'unlimited editing' and ended up fixing everything yourself.", tag: 'Burned by cheap' },
  { num: '03', text: "Podcasts, sales calls, and trainings are rotting on a hard drive.",            tag: 'Content decay' },
  { num: '04', text: "Every time you hire an editor, you micromanage or re-do their work.",          tag: 'Management tax' },
  { num: '05', text: "Content should be a system — right now it's vibes, guilt, and random posts.",  tag: 'No system' },
];

const PROBLEMS = [
  {
    p: 'Random freelancers disappear or slow down.',
    w: 'No pipeline, no backup, and no standards.',
    s: 'We run a dedicated Ukrainian editor pipeline with stress-tests, English checks, and backup editors ready if someone drops.'
  },
  {
    p: '"Editors don\'t get my niche."',
    w: "They're video people, not marketers.",
    s: 'We unpack your offers, ICP, and sales calls first, then train your editor on your playbook before they touch a file.'
  },
  {
    p: '"This will take too much of my time."',
    w: 'You had to brief, chase, and QA everything.',
    s: 'You record once a week. We handle briefs, editing, captions, thumbnails, scheduling, and QA. You just approve.'
  },
];

const WORK = [
  { tag: 'Raw → Final clip',          title: 'Zoom call → platform-native shorts',  sub: 'Captions, pattern interrupts, and a clear CTA — all from one raw recording.', slot: 'Before / After' },
  { tag: 'Feed transformation',       title: '1–2 posts/month → 2–3 posts/day',     sub: 'Before: dusty feed. After: structured grid in under 60 days.',                 slot: 'Feed grid' },
  { tag: 'Multi-platform repurposing',title: 'One 45-min call → 6 content formats', sub: 'IG/TikTok/Shorts, YouTube cut, LinkedIn clips, and carousels — from one session.', slot: 'Repurpose reel' },
];

const PROCESS = [
  { num: '01', day: 'Day 1',     title: 'Fit call',                           desc: 'We map your offers, ICP, content goals, and current bottlenecks. This becomes the brief your editor is trained on.' },
  { num: '02', day: 'Days 2–3',  title: 'Sourcing & testing',                 desc: 'From our Ukrainian pipeline we shortlist editors, run test projects, and check English and attention to detail.' },
  { num: '03', day: 'Day 4',     title: 'Final interview',                    desc: 'You meet 1–2 finalists. You pick who you vibe with and trust.' },
  { num: '04', day: 'Days 5–7',  title: 'Style lock + first same-day edits',  desc: 'You send raw footage. We lock your style on the first batch and start same-day edit cycles.' },
  { num: '∞',  day: 'After that', title: 'You record. They edit same day.',   desc: 'We monitor quality and speed and swap fast if standards slip. You just keep recording.' },
];

const PROOF = [
  {
    msgs: [
      { out: false, text: "I haven't opened CapCut in weeks. Feels insane.",                         time: '11:02' },
      { out: true,  text: 'that\'s the goal. record → we ship. keep going',                            time: '11:05' },
      { out: false, text: 'posted 9 clips last week. 3 hit 10k+',                                       time: '11:06' },
    ]
  },
  {
    msgs: [
      { out: false, text: 'this is the best hire we\'ve made this year, no joke',                     time: '16:20' },
      { out: true,  text: 'appreciate that. editor is locked in on your style now',                     time: '16:24' },
      { out: false, text: 'we\'re probably adding a second seat next month',                           time: '16:25' },
    ]
  },
  {
    msgs: [
      { out: false, text: 'we\'re finally consistent and it\'s not on my plate anymore',              time: '09:44' },
      { out: true,  text: 'that\'s the whole point. you record, we run the play',                      time: '09:46' },
      { out: false, text: 'two client calls this week came straight from the reels 🔥',                 time: '09:47' },
    ]
  },
];

const CASES = [
  {
    init: 'BC', role: 'Founder, B2B Coach', rev: '~$80k/month',
    before: '2–3 random posts a month, editing nights and weekends, no clear content strategy.',
    after:  '2–3 clips a day across IG, TikTok, and Shorts in 45 days. No more self-editing. More inbound, warmer calls.',
    afterLabel: 'After editor seat',
  },
  {
    init: 'SM', role: 'SMMA Agency', rev: '~$150k/month',
    before: 'Three flaky freelancers, missed deadlines, founder stuck as part-time editor.',
    after:  'Stable delivery, revision time slashed, founder back in sales and client strategy.',
    afterLabel: 'After two editor seats',
  },
];

const PLANS = [
  {
    tier: 'All-In Editor Seat',
    desc: 'For founders & agencies who want to record once and have content shipped every day.',
    items: [
      '1 full-time embedded Ukrainian editor',
      'Same-day turnaround on agreed clip volume',
      'Short-form clips, long-form cuts, thumbnails, captions',
      'Sourcing, tests, onboarding, QA, fast replacements',
      'Weekly content recap + monthly performance review',
    ],
    feat: true,
    cta: 'Book a call →',
  },
  {
    tier: 'Pro Editor Placement',
    desc: 'For teams with an existing content lead who just need a killer editor.',
    items: [
      'Vetted editor placed in 7 days or less',
      'Paid test project before you commit',
      '30-day free replacement window if not a fit',
    ],
    feat: false,
    cta: 'Talk about placement →',
  },
];

const VIDEO_TESTIMONIALS = [
  { url: 'https://www.instagram.com/p/DU07FgIEV7z/', caption: 'Thank you Tayo' },
  { url: 'https://www.instagram.com/p/DTnWQpKjXHI/', caption: 'Thank you, Carter' },
  { url: 'https://www.instagram.com/p/DKQ7tX8tMK1/', caption: 'Client testimonial' },
  { url: 'https://www.instagram.com/p/DMflFPTRVmQ/', caption: 'Thank you Jeremy' },
];

const GUARANTEES = [
  { icon: '✓', title: '30-Day Fit Guarantee',   body: "If you're not confident in your editor within the first 30 days, we replace them and cover the next 2 weeks of their work at our cost." },
  { icon: '⚡', title: 'Turnaround Guarantee',  body: "If we miss same-day turnaround on the agreed clip volume more than once in a month, you don't pay our management fee for that month." },
];

const FAQ = [
  { q: 'What happens if my editor quits or underperforms?',         a: "We coach first. If it doesn't fix fast, we swap them from our bench at no extra cost. You never go back to zero." },
  { q: 'How good is their English?',                                a: 'All editors pass written and spoken English checks. If you want, we only show you candidates who can join client-facing calls.' },
  { q: 'How much of my time does this really take?',                a: 'Plan on 30–60 minutes a week: record, then review a batch once. No endless back-and-forth unless you want it.' },
  { q: 'Who handles captions, thumbnails, and posting?',            a: 'Your editor handles editing, captions, thumbnails, and scheduling inside your tools. You approve strategy once; we run the play.' },
  { q: 'What if I already have a YouTube editor?',                  a: 'We plug in around them: shorts, carousels, and repurposed clips while your current editor keeps long-form.' },
  { q: 'What if I want to scale to multiple brands or shows?',      a: 'We add more seats and standardize the system so each new brand is a copy-paste, not a fresh headache.' },
];

/* =====================================================================
   COMPONENTS
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
        <a href="../" className="nav__logo">CUTFRAME</a>
        <div className={`nav__links${open ? ' nav__links--open' : ''}`}>
          <a href="#timeline" className="nav__link" onClick={close}>Timeline</a>
          <a href="#results"  className="nav__link" onClick={close}>Results</a>
          <a href="#faq"      className="nav__link" onClick={close}>FAQ</a>
          <a href="../"       className="nav__link" onClick={close}>Main</a>
          <a href="#book"     className="nav__cta"  onClick={close}>Book a call →</a>
        </div>
        <button className="nav__hamburger" onClick={() => setOpen(v => !v)} aria-label="Toggle menu">
          {open ? '✕' : '≡'}
        </button>
      </div>
    </nav>
  );
}

function Hero() {
  const floatRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf: number; let t = 0;
    const tick = () => {
      t += 0.012;
      if (floatRef.current) floatRef.current.style.transform = `translateY(${Math.sin(t) * 6}px)`;
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
        <div className="hero__badge">For founders &amp; agencies · $30k–$250k/mo</div>
        <h1 className="hero__h1 hero__h1--v2">
          Stop <span className="hero__h1-yellow">editing</span><br />
          your own videos.
        </h1>
        <p className="hero__sub">
          We place and manage a full-time Ukrainian video editor on your team in 7 days or less,
          with same-day turnaround on your clips — so you can publish daily and never touch Premiere or CapCut again.
        </p>
        <div className="hero__actions">
          <a href="#book" className="btn-primary">Book a 20-min fit call →</a>
          <a href="#results" className="btn-ghost">See the work</a>
        </div>
      </div>
      <div className="hero__float" ref={floatRef}>
        <div className="hero__float-icon">✓</div>
        <div>
          <div className="hero__float-title">Editor placed · 7 days</div>
          <div className="hero__float-sub">Same-day edits · live now</div>
        </div>
      </div>
      <div className="hero__scroll" aria-hidden="true">
        <span className="hero__scroll-label">scroll</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}

function CountNum({ value }: { value: string }) {
  const ref = useRef<HTMLDivElement>(null);
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

function Pain() {
  return (
    <section className="services-section">
      <div className="container">
        <div className="services-eyebrow reveal">Why you're here</div>
        {PAIN.map((p) => (
          <div key={p.num} className="svc-row reveal">
            <div className="svc-row__num">{p.num}</div>
            <div className="svc-row__center">
              <div className="svc-row__name pain-quote">{p.text}</div>
              <div className="svc-row__sub">{p.tag}</div>
            </div>
            <div className="svc-row__arrow">→</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function BigQuote() {
  return (
    <section className="quote-section">
      <div className="quote-inner reveal">
        <div className="quote-mark">"</div>
        <p className="quote-text">
          You don't need another editor. You need an operator and a system.
        </p>
        <div className="quote-attr">— The Cutframe thesis</div>
      </div>
    </section>
  );
}

function Problem() {
  return (
    <section className="section" id="problem">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-num">The real problem</div>
          <h2 className="section-h2">Operator &amp; system.<br />Not another freelancer.</h2>
        </div>
        <div className="ptable reveal">
          <div className="ptable__head">
            <div>Problem</div>
            <div>Why</div>
            <div>What we do instead</div>
          </div>
          {PROBLEMS.map((row, i) => (
            <div key={i} className="ptable__row">
              <div>{row.p}</div>
              <div>{row.w}</div>
              <div>{row.s}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Work() {
  return (
    <section className="section section--alt" id="results">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-num">See the work</div>
          <h2 className="section-h2">Raw call in →<br />finished content out.</h2>
        </div>
        <div className="v2-work-grid reveal">
          {WORK.map((w, i) => (
            <div key={i} className="v2-work-card">
              <div className="v2-work-card__visual">{w.slot}</div>
              <div>
                <div className="v2-work-card__tag">{w.tag}</div>
                <div className="v2-work-card__title">{w.title}</div>
                <div className="v2-work-card__sub">{w.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="section" id="timeline">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-num">Your editor, fully live in 7 days</div>
          <h2 className="section-h2">Simple.<br />Repeatable.<br />Reliable.</h2>
        </div>
        <div className="process-list">
          {PROCESS.map((step) => (
            <div key={step.num} className="process-step reveal">
              <div className="process-step__top-line" />
              <div className="process-step__inner">
                <div className="process-step__num" aria-hidden>{step.num}</div>
                <div className="process-step__body">
                  <div className="process-step__day">{step.day}</div>
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

function Proof() {
  return (
    <section className="section section--alt">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-num">Wall of proof</div>
          <h2 className="section-h2">Real messages.<br />Real results.</h2>
        </div>
        <div className="testi-grid reveal">
          {PROOF.map((t, ti) => (
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

function Cases() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-num">What this looks like when it works</div>
          <h2 className="section-h2">Real founders.<br />Real numbers.</h2>
        </div>
        <div className="cases-grid reveal">
          {CASES.map(c => (
            <div key={c.init} className="case-card">
              <div className="case-card__head">
                <div className="case-card__ava">{c.init}</div>
                <div>
                  <div className="case-card__role">{c.role}</div>
                  <div className="case-card__rev">{c.rev}</div>
                </div>
              </div>
              <div className="case-card__label">Before</div>
              <div className="case-card__body">{c.before}</div>
              <div className="case-card__label">{c.afterLabel}</div>
              <div className="case-card__body">{c.after}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedCard({ plan }: { plan: typeof PLANS[0] }) {
  const tiltRef = useTilt(8);
  return (
    <div ref={tiltRef} className="pricing-card pricing-card--feat" style={{ willChange: 'transform' }}>
      <span className="pricing-feat-badge">Most popular</span>
      <div className="pricing-tier">{plan.tier}</div>
      <div className="pricing-desc">{plan.desc}</div>
      <div className="pricing-line" />
      <ul className="pricing-list">
        {plan.items.map((item, i) => (
          <li key={i} className={`pricing-item${i === 0 ? ' pricing-item--hi' : ''}`}>{item}</li>
        ))}
      </ul>
      <a href="#book" className="pricing-btn">{plan.cta}</a>
    </div>
  );
}

function Pricing() {
  return (
    <section className="section section--alt" id="plans">
      <div className="container">
        <div className="section-header section-header--center reveal">
          <div className="section-num">Choose your editor seat</div>
          <h2 className="section-h2">Full-time editors.<br />Zero management drama.</h2>
        </div>
        <div className="pricing-grid pricing-grid--v2 reveal">
          {PLANS.map(plan =>
            plan.feat
              ? <FeaturedCard key={plan.tier} plan={plan} />
              : (
                <div key={plan.tier} className="pricing-card">
                  <div className="pricing-tier">{plan.tier}</div>
                  <div className="pricing-desc">{plan.desc}</div>
                  <div className="pricing-line" />
                  <ul className="pricing-list">
                    {plan.items.map((item, i) => (
                      <li key={i} className={`pricing-item${i === 0 ? ' pricing-item--hi' : ''}`}>{item}</li>
                    ))}
                  </ul>
                  <a href="#book" className="pricing-btn">{plan.cta}</a>
                </div>
              )
          )}
        </div>
      </div>
    </section>
  );
}

function Guarantees() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-num">Risk reversal</div>
          <h2 className="section-h2">"What if this<br />doesn't work?"</h2>
          <p className="section-sub">You get the outcome or you don't pay for our management.</p>
        </div>
        <div className="gg-grid reveal">
          {GUARANTEES.map((g, i) => (
            <div key={i} className="gg-card">
              <div className="gg-card__icon">{g.icon}</div>
              <div className="gg-card__title">{g.title}</div>
              <div className="gg-card__body">{g.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="section section--alt" id="faq">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-num">Questions founders ask before they start</div>
          <h2 className="section-h2">Every objection.<br />Answered straight.</h2>
        </div>
        <div className="faq-list reveal">
          {FAQ.map((f, i) => (
            <details key={i} className="faq-item">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="cta-section" id="book">
      <div className="cta-glow" aria-hidden />
      <div className="container">
        <div className="cta-box reveal">
          <div className="cta-eyebrow">Ready?</div>
          <h2 className="cta-h2">Let's work.</h2>
          <p className="cta-sub">
            Tell us how you're doing content now, and we'll show you exactly how a full-time Ukrainian editor plugs in.
            If it's not a clear win on the call, we don't work together.
          </p>
          <div className="cta-btns">
            <a href="https://calendly.com/pechenchis/strategy-call" target="_blank" rel="noopener noreferrer" className="btn-primary btn-primary--lg">
              Book a 20-min fit call →
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

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <span className="footer__logo">CUTFRAME</span>
        <div className="footer__links">
          <a href="../"         className="footer__link">Main site</a>
          <a href="#timeline"   className="footer__link">Timeline</a>
          <a href="#results"    className="footer__link">Results</a>
          <a href="#faq"        className="footer__link">FAQ</a>
          <a href="#book"       className="footer__link">Book</a>
        </div>
        <span className="footer__copy">© 2026 Cutframe</span>
      </div>
    </footer>
  );
}

/* =====================================================================
   APP
   ===================================================================== */

export default function V2App() {
  useScrollReveal();
  return (
    <>
      <CursorGlow />
      <Nav />
      <Hero />
      <Marquee items={TICKER_A} />
      <Stats />
      <Pain />
      <BigQuote />
      <Problem />
      <Work />
      <Marquee items={TICKER_B} reverse />
      <Process />
      <Proof />
      <VideoTestimonials />
      <Cases />
      <Pricing />
      <Guarantees />
      <Faq />
      <CTA />
      <Footer />
    </>
  );
}
