'use client'
import { useState, useEffect, useRef } from "react";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const USERS = [
  { id: 1, name: "Amara Osei", role: "CEO & Founder", company: "NovaPay", avatar: "AO", bio: "Fintech founder building the next generation of payment infrastructure for emerging markets. Previously at Stripe.", skills: ["Fintech", "Payments", "Fundraising", "Product Strategy"], type: "Cofounder", location: "San Francisco, CA", match: 94, lookingFor: "Technical cofounder with backend expertise", connections: 312, raised: "$2.4M Seed" },
  { id: 2, name: "James Whitfield", role: "CTO", company: "HealthBridge", avatar: "JW", bio: "Full-stack engineer turned CTO. Passionate about using AI to democratize healthcare access globally.", skills: ["AI/ML", "Healthcare", "Engineering", "System Design"], type: "Cofounder", location: "Austin, TX", match: 91, lookingFor: "Business-minded cofounder for go-to-market", connections: 187, raised: "$800K Pre-Seed" },
  { id: 3, name: "Priya Sharma", role: "Startup Adviser", company: "ScaleUp Partners", avatar: "PS", bio: "3x founder (2 exits). Now advising early-stage startups on product-market fit and growth strategies.", skills: ["Growth", "PMF", "Fundraising", "SaaS"], type: "Adviser", location: "New York, NY", match: 88, lookingFor: "Ambitious founders pre-Series A", connections: 524, raised: "2 exits totaling $45M" },
  { id: 4, name: "Marcus Chen", role: "Growth Consultant", company: "Independent", avatar: "MC", bio: "Helped 40+ startups scale from $0 to $1M ARR. Specializing in B2B SaaS go-to-market strategies.", skills: ["B2B SaaS", "Sales", "Marketing", "Revenue Ops"], type: "Consultant", location: "Seattle, WA", match: 85, lookingFor: "Startups ready to scale past first $100K ARR", connections: 298, raised: "N/A — Consultant" },
  { id: 5, name: "Sofia Rodriguez", role: "Founder & CEO", company: "EduLaunch", avatar: "SR", bio: "EdTech entrepreneur reimagining professional development. Background in instructional design and product.", skills: ["EdTech", "Product", "UX Research", "Community"], type: "Cofounder", location: "Miami, FL", match: 82, lookingFor: "Engineering cofounder passionate about education", connections: 156, raised: "$500K Pre-Seed" },
  { id: 6, name: "David Kimura", role: "Venture Partner", company: "Catalyst Ventures", avatar: "DK", bio: "Early-stage investor and operator. Focused on marketplace and platform businesses in underserved verticals.", skills: ["Investing", "Marketplaces", "Strategy", "Operations"], type: "Adviser", location: "Chicago, IL", match: 79, lookingFor: "Marketplace founders with unique supply-side advantages", connections: 743, raised: "$120M fund" },
];

const MESSAGES = [
  { id: 1, from: USERS[2], preview: "I'd love to chat about your go-to-market strategy. I've seen similar patterns...", time: "2m ago", unread: true },
  { id: 2, from: USERS[0], preview: "Thanks for connecting! Your background in payments is exactly what we need.", time: "1h ago", unread: true },
  { id: 3, from: USERS[4], preview: "Great meeting you at the demo day. Let's schedule a follow-up this week.", time: "3h ago", unread: false },
  { id: 4, from: USERS[3], preview: "I put together some notes on the growth framework we discussed.", time: "1d ago", unread: false },
];

const FEED_POSTS = [
  { id: 1, author: USERS[2], content: "Hot take: Most startups don't fail because of bad ideas. They fail because founders wait too long to talk to customers. Ship early, learn fast, iterate relentlessly.", time: "2h ago", likes: 47, comments: 12, tag: "Insight" },
  { id: 2, author: USERS[5], content: "We just closed our $120M Fund III focused on marketplace businesses. If you're building something with a unique supply-side advantage, let's talk.", time: "5h ago", likes: 83, comments: 31, tag: "Opportunity" },
  { id: 3, author: USERS[0], content: "Looking for a technical cofounder with backend/infrastructure experience. We're building payment rails for emerging markets and just closed our seed round. DM me!", time: "8h ago", likes: 29, comments: 8, tag: "Seeking Cofounder" },
  { id: 4, author: USERS[3], content: "Just published my framework for going from $0 to $100K ARR in B2B SaaS. Spoiler: it's not about the product, it's about the sales motion. Link in bio.", time: "1d ago", likes: 156, comments: 42, tag: "Resource" },
];

// ─── Styles ──────────────────────────────────────────────────────────────────

const colors = {
  bg: "#0B0E11",
  bgCard: "#12161B",
  bgCardHover: "#181D24",
  bgElevated: "#1A1F27",
  gold: "#D4A853",
  goldLight: "#E8C97A",
  goldDim: "rgba(212,168,83,0.15)",
  goldBorder: "rgba(212,168,83,0.25)",
  text: "#E8E6E1",
  textMuted: "#8A8B8D",
  textDim: "#5A5B5D",
  border: "rgba(255,255,255,0.06)",
  accent: "#4A9EFF",
  green: "#4ADE80",
  greenDim: "rgba(74,222,128,0.12)",
  red: "#F87171",
};

// ─── Reusable Components ─────────────────────────────────────────────────────

function Avatar({ initials, size = 44, gold = false }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: gold ? `linear-gradient(135deg, ${colors.gold}, ${colors.goldLight})` : `linear-gradient(135deg, #2A2F38, #1A1F27)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.34, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
      color: gold ? colors.bg : colors.textMuted,
      border: `1.5px solid ${gold ? colors.gold : colors.border}`,
      flexShrink: 0,
    }}>{initials}</div>
  );
}

function Badge({ children, variant = "default" }) {
  const styles = {
    default: { bg: "rgba(255,255,255,0.06)", color: colors.textMuted, border: colors.border },
    gold: { bg: colors.goldDim, color: colors.gold, border: colors.goldBorder },
    green: { bg: colors.greenDim, color: colors.green, border: "rgba(74,222,128,0.2)" },
    accent: { bg: "rgba(74,158,255,0.1)", color: colors.accent, border: "rgba(74,158,255,0.2)" },
  };
  const s = styles[variant];
  return (
    <span style={{
      padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.02em", whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

function Button({ children, variant = "primary", onClick, style = {}, small = false }) {
  const [hovered, setHovered] = useState(false);
  const base = {
    padding: small ? "8px 16px" : "12px 28px",
    borderRadius: small ? 8 : 10,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600,
    fontSize: small ? 13 : 14,
    cursor: "pointer",
    transition: "all 0.25s ease",
    border: "none",
    letterSpacing: "0.01em",
  };
  const variants = {
    primary: {
      background: hovered ? colors.goldLight : colors.gold,
      color: colors.bg,
      boxShadow: hovered ? `0 4px 20px rgba(212,168,83,0.4)` : `0 2px 12px rgba(212,168,83,0.25)`,
    },
    secondary: {
      background: hovered ? "rgba(255,255,255,0.08)" : "transparent",
      color: colors.text,
      border: `1.5px solid ${hovered ? "rgba(255,255,255,0.2)" : colors.border}`,
    },
    ghost: {
      background: hovered ? "rgba(255,255,255,0.06)" : "transparent",
      color: colors.textMuted,
    },
  };
  return (
    <button
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >{children}</button>
  );
}

function Card({ children, style = {}, onClick, hoverable = true }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        background: hovered && hoverable ? colors.bgCardHover : colors.bgCard,
        border: `1px solid ${hovered && hoverable ? "rgba(255,255,255,0.1)" : colors.border}`,
        borderRadius: 16, padding: 24, transition: "all 0.3s ease",
        cursor: onClick ? "pointer" : "default", ...style,
      }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >{children}</div>
  );
}

function MatchRing({ percent, size = 48 }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={3} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={colors.gold} strokeWidth={3}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <span style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 700, color: colors.gold, fontFamily: "'DM Sans', sans-serif",
      }}>{percent}%</span>
    </div>
  );
}

function NavItem({ icon, label, active, onClick, badge: badgeCount }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10,
      background: active ? colors.goldDim : "transparent", border: "none",
      color: active ? colors.gold : colors.textMuted, cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: active ? 600 : 400,
      transition: "all 0.2s ease", width: "100%", position: "relative",
    }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span>{label}</span>
      {badgeCount > 0 && (
        <span style={{
          marginLeft: "auto", background: colors.gold, color: colors.bg,
          fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 10,
        }}>{badgeCount}</span>
      )}
    </button>
  );
}

// ─── Landing Page ────────────────────────────────────────────────────────────

function LandingPage({ onEnterApp }) {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const handleJoin = () => {
    if (email.includes("@")) setJoined(true);
  };

  return (
    <div style={{
      minHeight: "100vh", background: colors.bg, color: colors.text,
      fontFamily: "'DM Sans', sans-serif", overflow: "hidden",
    }}>
      {/* Ambient background */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 800px 600px at 20% 20%, rgba(212,168,83,0.06), transparent),
          radial-gradient(ellipse 600px 800px at 80% 80%, rgba(74,158,255,0.04), transparent),
          radial-gradient(ellipse 900px 400px at 50% 50%, rgba(212,168,83,0.03), transparent)
        `,
      }} />

      {/* Nav */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "24px 48px", position: "relative", zIndex: 10,
        opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(-20px)",
        transition: "all 0.8s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldLight})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 800, color: colors.bg,
          }}>M</div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em" }}>Monarch</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Button variant="ghost" small onClick={onEnterApp}>Sign In</Button>
          <Button variant="primary" small onClick={onEnterApp}>Get Early Access</Button>
        </div>
      </nav>

      {/* Hero */}
      <main style={{
        maxWidth: 1200, margin: "0 auto", padding: "80px 48px 60px",
        textAlign: "center", position: "relative", zIndex: 5,
      }}>
        <div style={{
          opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)",
          transition: "all 1s ease 0.2s",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 20,
            background: colors.goldDim, border: `1px solid ${colors.goldBorder}`,
            marginBottom: 32,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: colors.green }} />
            <span style={{ fontSize: 13, color: colors.gold, fontWeight: 500 }}>97 founders already on the waitlist</span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: "clamp(40px, 6vw, 76px)",
            fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.025em",
            margin: "0 auto 28px", maxWidth: 800,
          }}>
            Where founders find their
            <span style={{
              display: "block",
              background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldLight}, #F0DCA0)`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}> missing half</span>
          </h1>

          <p style={{
            fontSize: 18, color: colors.textMuted, maxWidth: 560, margin: "0 auto 48px",
            lineHeight: 1.65, fontWeight: 300,
          }}>
            Monarch connects entrepreneurs, cofounders, advisers, and consultants through intelligent matching — so you can build what matters, together.
          </p>

          {/* Email Input */}
          {!joined ? (
            <div style={{
              display: "flex", gap: 12, maxWidth: 480, margin: "0 auto",
              justifyContent: "center", flexWrap: "wrap",
            }}>
              <input
                type="email" placeholder="Enter your email"
                value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleJoin()}
                style={{
                  flex: 1, minWidth: 240, padding: "14px 20px", borderRadius: 10,
                  background: "rgba(255,255,255,0.05)", border: `1.5px solid ${colors.border}`,
                  color: colors.text, fontSize: 15, fontFamily: "'DM Sans', sans-serif",
                  outline: "none", transition: "border-color 0.3s ease",
                }}
                onFocus={e => e.target.style.borderColor = colors.gold}
                onBlur={e => e.target.style.borderColor = colors.border}
              />
              <Button onClick={handleJoin}>Join Waitlist →</Button>
            </div>
          ) : (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "14px 28px", borderRadius: 12,
              background: colors.greenDim, border: `1px solid rgba(74,222,128,0.2)`,
            }}>
              <span style={{ fontSize: 20 }}>✓</span>
              <span style={{ color: colors.green, fontWeight: 600 }}>You're on the list! Check your email.</span>
            </div>
          )}
        </div>

        {/* Feature Cards */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 20, marginTop: 100,
          opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(40px)",
          transition: "all 1s ease 0.6s",
        }}>
          {[
            { icon: "◇", title: "Smart Matching", desc: "AI-powered matching connects you with the right cofounders, advisers, and collaborators based on skills, stage, and goals." },
            { icon: "◈", title: "Secure Messaging", desc: "Built-in messaging with scheduling and document sharing. Keep all your founder conversations in one place." },
            { icon: "▣", title: "Expert Marketplace", desc: "Book sessions with vetted consultants and advisers. Get the strategic guidance you need, when you need it." },
            { icon: "◎", title: "Community Feed", desc: "Share insights, find opportunities, and stay connected with a curated network of builders and operators." },
          ].map((f, i) => (
            <Card key={i} style={{ textAlign: "left", padding: 28 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: colors.goldDim, border: `1px solid ${colors.goldBorder}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, color: colors.gold, marginBottom: 18,
              }}>{f.icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, margin: "0 0 10px", letterSpacing: "-0.01em" }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: colors.textMuted, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </Card>
          ))}
        </div>

        {/* Social Proof */}
        <div style={{
          marginTop: 100, paddingTop: 60,
          borderTop: `1px solid ${colors.border}`,
          opacity: visible ? 1 : 0, transition: "all 1s ease 0.9s",
        }}>
          <p style={{ fontSize: 13, color: colors.textDim, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600, marginBottom: 32 }}>
            Trusted by founders from
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap", opacity: 0.4 }}>
            {["Y Combinator", "Techstars", "a16z", "Sequoia", "500 Global"].map(name => (
              <span key={name} style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: colors.text }}>{name}</span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: 100, paddingBottom: 80 }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700,
            marginBottom: 16, letterSpacing: "-0.02em",
          }}>Ready to find your match?</h2>
          <p style={{ color: colors.textMuted, marginBottom: 32, fontSize: 16 }}>Join the network that's redefining how startups get built.</p>
          <Button onClick={onEnterApp} style={{ fontSize: 16, padding: "16px 40px" }}>Enter Monarch →</Button>
        </div>
      </main>
    </div>
  );
}

// ─── App Pages ───────────────────────────────────────────────────────────────

function DiscoverPage({ onSelectUser }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const types = ["All", "Cofounder", "Adviser", "Consultant"];

  const filtered = USERS.filter(u =>
    (filter === "All" || u.type === filter) &&
    (search === "" || u.name.toLowerCase().includes(search.toLowerCase()) || u.skills.some(s => s.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>Discover</h1>
        <p style={{ color: colors.textMuted, fontSize: 14, marginTop: 6 }}>Find your next cofounder, adviser, or consultant</p>
      </div>

      {/* Search & Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap", alignItems: "center" }}>
        <input
          placeholder="Search by name or skill..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: 200, padding: "10px 16px", borderRadius: 10,
            background: "rgba(255,255,255,0.04)", border: `1px solid ${colors.border}`,
            color: colors.text, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none",
          }}
        />
        <div style={{ display: "flex", gap: 6 }}>
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{
              padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
              background: filter === t ? colors.goldDim : "rgba(255,255,255,0.04)",
              color: filter === t ? colors.gold : colors.textMuted,
              transition: "all 0.2s ease",
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* User Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
        {filtered.map(user => (
          <Card key={user.id} onClick={() => onSelectUser(user)} style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <Avatar initials={user.avatar} size={48} gold={user.match >= 90} />
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{user.name}</h3>
                    <p style={{ margin: "2px 0 0", fontSize: 13, color: colors.textMuted }}>{user.role} · {user.company}</p>
                  </div>
                </div>
                <MatchRing percent={user.match} />
              </div>

              <p style={{ fontSize: 13, color: colors.textMuted, lineHeight: 1.55, margin: "0 0 16px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {user.bio}
              </p>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                <Badge variant="gold">{user.type}</Badge>
                {user.skills.slice(0, 2).map(s => <Badge key={s}>{s}</Badge>)}
              </div>

              <div style={{
                padding: "12px 0 0", borderTop: `1px solid ${colors.border}`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{ fontSize: 12, color: colors.textDim }}>📍 {user.location}</span>
                <Button variant="secondary" small>Connect</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProfilePage({ user, onBack }) {
  if (!user) return null;
  return (
    <div>
      <button onClick={onBack} style={{
        display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
        color: colors.textMuted, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
        fontSize: 14, marginBottom: 24, padding: 0,
      }}>← Back to Discover</button>

      <Card hoverable={false} style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
          <Avatar initials={user.avatar} size={80} gold={user.match >= 90} />
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6, flexWrap: "wrap" }}>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>{user.name}</h1>
              <Badge variant="gold">{user.type}</Badge>
            </div>
            <p style={{ color: colors.textMuted, fontSize: 15, margin: "0 0 4px" }}>{user.role} at {user.company}</p>
            <p style={{ color: colors.textDim, fontSize: 13, margin: "0 0 16px" }}>📍 {user.location} · {user.connections} connections</p>
            <div style={{ display: "flex", gap: 10 }}>
              <Button small>Send Message</Button>
              <Button variant="secondary" small>Request Intro</Button>
            </div>
          </div>
          <MatchRing percent={user.match} size={72} />
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card hoverable={false}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, margin: "0 0 12px", fontWeight: 600 }}>About</h3>
          <p style={{ fontSize: 14, color: colors.textMuted, lineHeight: 1.7, margin: 0 }}>{user.bio}</p>
        </Card>
        <Card hoverable={false}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, margin: "0 0 12px", fontWeight: 600 }}>Looking For</h3>
          <p style={{ fontSize: 14, color: colors.textMuted, lineHeight: 1.7, margin: "0 0 16px" }}>{user.lookingFor}</p>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, margin: "0 0 12px", fontWeight: 600 }}>Raised</h3>
          <p style={{ fontSize: 14, color: colors.gold, fontWeight: 600, margin: 0 }}>{user.raised}</p>
        </Card>
      </div>

      <Card hoverable={false} style={{ marginTop: 20 }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, margin: "0 0 16px", fontWeight: 600 }}>Skills & Expertise</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {user.skills.map(s => <Badge key={s} variant="gold">{s}</Badge>)}
        </div>
      </Card>
    </div>
  );
}

function MessagesPage() {
  const [selected, setSelected] = useState(null);
  const [newMsg, setNewMsg] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const handleSend = () => {
    if (!newMsg.trim()) return;
    setChatMessages([...chatMessages, { from: "me", text: newMsg, time: "now" }]);
    setNewMsg("");
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        from: "them", text: "Thanks for reaching out! I'd love to discuss this further. Are you free for a call this week?", time: "now",
      }]);
    }, 1500);
  };

  return (
    <div style={{ display: "flex", gap: 0, height: "calc(100vh - 120px)", marginTop: -8 }}>
      {/* Sidebar */}
      <div style={{
        width: 340, borderRight: `1px solid ${colors.border}`, paddingRight: 0,
        overflowY: "auto", flexShrink: 0,
      }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, margin: "0 0 24px", letterSpacing: "-0.02em", paddingRight: 20 }}>Messages</h1>
        {MESSAGES.map(m => (
          <div key={m.id} onClick={() => { setSelected(m); setChatMessages([{ from: "them", text: m.preview, time: m.time }]); }}
            style={{
              display: "flex", gap: 12, padding: "16px 20px 16px 0", cursor: "pointer",
              borderBottom: `1px solid ${colors.border}`,
              background: selected?.id === m.id ? "rgba(212,168,83,0.05)" : "transparent",
              transition: "background 0.2s ease",
            }}>
            <Avatar initials={m.from.avatar} size={40} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontWeight: m.unread ? 700 : 500, fontSize: 14 }}>{m.from.name}</span>
                <span style={{ fontSize: 11, color: colors.textDim }}>{m.time}</span>
              </div>
              <p style={{
                margin: 0, fontSize: 13, color: m.unread ? colors.text : colors.textMuted,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                fontWeight: m.unread ? 500 : 400,
              }}>{m.preview}</p>
            </div>
            {m.unread && <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors.gold, flexShrink: 0, marginTop: 6 }} />}
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingLeft: 24 }}>
        {selected ? (
          <>
            <div style={{
              display: "flex", alignItems: "center", gap: 12, paddingBottom: 16,
              borderBottom: `1px solid ${colors.border}`, marginBottom: 16,
            }}>
              <Avatar initials={selected.from.avatar} size={36} />
              <div>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{selected.from.name}</h3>
                <p style={{ margin: 0, fontSize: 12, color: colors.textMuted }}>{selected.from.role} · {selected.from.company}</p>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{
                  alignSelf: msg.from === "me" ? "flex-end" : "flex-start",
                  maxWidth: "70%",
                }}>
                  <div style={{
                    padding: "12px 16px", borderRadius: 14, fontSize: 14, lineHeight: 1.5,
                    background: msg.from === "me" ? colors.gold : colors.bgElevated,
                    color: msg.from === "me" ? colors.bg : colors.text,
                    borderBottomRightRadius: msg.from === "me" ? 4 : 14,
                    borderBottomLeftRadius: msg.from === "me" ? 14 : 4,
                  }}>{msg.text}</div>
                  <span style={{ fontSize: 11, color: colors.textDim, marginTop: 4, display: "block", textAlign: msg.from === "me" ? "right" : "left" }}>{msg.time}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, paddingTop: 16, borderTop: `1px solid ${colors.border}`, marginTop: 16 }}>
              <input
                placeholder="Type a message..."
                value={newMsg} onChange={e => setNewMsg(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                style={{
                  flex: 1, padding: "12px 16px", borderRadius: 10,
                  background: "rgba(255,255,255,0.04)", border: `1px solid ${colors.border}`,
                  color: colors.text, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none",
                }}
              />
              <Button small onClick={handleSend}>Send</Button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.2 }}>💬</div>
            <p style={{ color: colors.textDim, fontSize: 15 }}>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MarketplacePage() {
  const experts = USERS.filter(u => u.type === "Adviser" || u.type === "Consultant");
  return (
    <div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.02em" }}>Expert Marketplace</h1>
      <p style={{ color: colors.textMuted, fontSize: 14, marginTop: 0, marginBottom: 32 }}>Book sessions with vetted advisers and consultants</p>

      {experts.map(expert => (
        <Card key={expert.id} style={{ marginBottom: 16, padding: 0 }}>
          <div style={{ padding: 28 }}>
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
              <Avatar initials={expert.avatar} size={56} gold />
              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{expert.name}</h3>
                  <Badge variant="gold">{expert.type}</Badge>
                  <Badge variant="green">Available</Badge>
                </div>
                <p style={{ margin: "2px 0 12px", fontSize: 14, color: colors.textMuted }}>{expert.role} · {expert.company}</p>
                <p style={{ fontSize: 14, color: colors.textMuted, lineHeight: 1.6, margin: "0 0 16px" }}>{expert.bio}</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
                  {expert.skills.map(s => <Badge key={s}>{s}</Badge>)}
                </div>
                <div style={{
                  display: "flex", gap: 16, alignItems: "center",
                  padding: "16px 0 0", borderTop: `1px solid ${colors.border}`,
                }}>
                  <div>
                    <span style={{ fontSize: 24, fontWeight: 700, color: colors.gold, fontFamily: "'DM Sans', sans-serif" }}>$150</span>
                    <span style={{ fontSize: 13, color: colors.textDim, marginLeft: 4 }}>/ 30 min</span>
                  </div>
                  <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
                    <Button variant="secondary" small>View Profile</Button>
                    <Button small>Book Session</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function FeedPage() {
  const [liked, setLiked] = useState({});
  return (
    <div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.02em" }}>Community</h1>
      <p style={{ color: colors.textMuted, fontSize: 14, marginTop: 0, marginBottom: 28 }}>Insights and opportunities from the Monarch network</p>

      {/* Compose */}
      <Card hoverable={false} style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <Avatar initials="YO" size={40} gold />
          <div style={{ flex: 1 }}>
            <textarea placeholder="Share an insight, opportunity, or question..."
              style={{
                width: "100%", minHeight: 80, padding: "12px 0", border: "none",
                background: "transparent", color: colors.text, fontSize: 14, resize: "none",
                fontFamily: "'DM Sans', sans-serif", outline: "none", lineHeight: 1.6,
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: `1px solid ${colors.border}` }}>
              <Button small>Post</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Posts */}
      {FEED_POSTS.map(post => (
        <Card key={post.id} hoverable={false} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 14 }}>
            <Avatar initials={post.author.avatar} size={40} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2, flexWrap: "wrap" }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{post.author.name}</span>
                <Badge variant="accent">{post.tag}</Badge>
                <span style={{ fontSize: 12, color: colors.textDim, marginLeft: "auto" }}>{post.time}</span>
              </div>
              <p style={{ fontSize: 13, color: colors.textDim, margin: "0 0 12px" }}>{post.author.role} · {post.author.company}</p>
              <p style={{ fontSize: 14, color: colors.text, lineHeight: 1.65, margin: "0 0 16px" }}>{post.content}</p>
              <div style={{ display: "flex", gap: 24 }}>
                <button onClick={() => setLiked(p => ({ ...p, [post.id]: !p[post.id] }))} style={{
                  display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
                  color: liked[post.id] ? colors.gold : colors.textDim, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
                }}>
                  {liked[post.id] ? "★" : "☆"} {post.likes + (liked[post.id] ? 1 : 0)}
                </button>
                <span style={{ fontSize: 13, color: colors.textDim }}>💬 {post.comments}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function MyProfilePage() {
  return (
    <div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, margin: "0 0 28px", letterSpacing: "-0.02em" }}>My Profile</h1>
      <Card hoverable={false}>
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
          <Avatar initials="YO" size={80} gold />
          <div style={{ flex: 1, minWidth: 240 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, margin: "0 0 4px", fontWeight: 700 }}>Your Name</h2>
            <p style={{ color: colors.textMuted, fontSize: 14, margin: "0 0 16px" }}>Founder · Your Company</p>
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <Button small>Edit Profile</Button>
              <Button variant="secondary" small>Share Profile</Button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, padding: "20px 0 0", borderTop: `1px solid ${colors.border}` }}>
              {[["Connections", "47"], ["Profile Views", "312"], ["Match Score", "—"]].map(([label, val]) => (
                <div key={label}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: colors.gold, fontFamily: "'DM Sans', sans-serif" }}>{val}</div>
                  <div style={{ fontSize: 12, color: colors.textDim, marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card hoverable={false} style={{ marginTop: 20 }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, margin: "0 0 16px", fontWeight: 600 }}>Complete Your Profile</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "Add your bio", done: false },
            { label: "List your skills", done: false },
            { label: "Upload a photo", done: false },
            { label: "Set what you're looking for", done: false },
            { label: "Connect social accounts", done: false },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
              borderRadius: 10, background: "rgba(255,255,255,0.03)", border: `1px solid ${colors.border}`,
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6,
                border: `2px solid ${item.done ? colors.green : colors.textDim}`,
                background: item.done ? colors.greenDim : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, color: colors.green,
              }}>{item.done ? "✓" : ""}</div>
              <span style={{ fontSize: 14, color: item.done ? colors.textDim : colors.text }}>{item.label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────

function AppShell() {
  const [page, setPage] = useState("discover");
  const [selectedUser, setSelectedUser] = useState(null);

  const renderPage = () => {
    if (selectedUser) return <ProfilePage user={selectedUser} onBack={() => setSelectedUser(null)} />;
    switch (page) {
      case "discover": return <DiscoverPage onSelectUser={setSelectedUser} />;
      case "messages": return <MessagesPage />;
      case "marketplace": return <MarketplacePage />;
      case "feed": return <FeedPage />;
      case "profile": return <MyProfilePage />;
      default: return <DiscoverPage onSelectUser={setSelectedUser} />;
    }
  };

  return (
    <div style={{
      display: "flex", minHeight: "100vh", background: colors.bg, color: colors.text,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Sidebar */}
      <aside style={{
        width: 240, padding: "24px 16px", borderRight: `1px solid ${colors.border}`,
        display: "flex", flexDirection: "column", flexShrink: 0,
        position: "sticky", top: 0, height: "100vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36, paddingLeft: 14 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldLight})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 800, color: colors.bg,
          }}>M</div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700 }}>Monarch</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <NavItem icon="◇" label="Discover" active={page === "discover" && !selectedUser} onClick={() => { setPage("discover"); setSelectedUser(null); }} />
          <NavItem icon="💬" label="Messages" active={page === "messages"} onClick={() => { setPage("messages"); setSelectedUser(null); }} badge={2} />
          <NavItem icon="◈" label="Marketplace" active={page === "marketplace"} onClick={() => { setPage("marketplace"); setSelectedUser(null); }} />
          <NavItem icon="◎" label="Community" active={page === "feed"} onClick={() => { setPage("feed"); setSelectedUser(null); }} />
        </div>

        <div style={{ marginTop: "auto" }}>
          <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: 12 }}>
            <NavItem icon="●" label="My Profile" active={page === "profile"} onClick={() => { setPage("profile"); setSelectedUser(null); }} />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "32px 40px", maxWidth: 960, overflowY: "auto" }}>
        {renderPage()}
      </main>
    </div>
  );
}

// ─── Root ────────────────────────────────────────────────────────────────────

export default function Monarch() {
  const [showApp, setShowApp] = useState(false);

  if (!showApp) return <LandingPage onEnterApp={() => setShowApp(true)} />;
  return <AppShell />;
}
