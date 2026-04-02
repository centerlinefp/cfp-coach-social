"use client";
import { useState, useEffect, useCallback } from "react";

const BRAND_CONTEXT = `You are a social media strategist for Centerline Fitness & Performance, a specialized strength and conditioning gym in Mobile, Alabama. Centerline focuses on combat sports training and HYROX competition prep. The gym's culture is gritty, community-driven, and performance-focused — not a commercial box gym.

Key brand attributes:
- Specialized, not generic. This is where serious athletes and everyday people who want to train like athletes come to get better.
- HYROX is a major focus — functional fitness racing combining running and functional workout stations.
- Strong community vibe. Members support each other. It's a team, not just a gym.
- Coaching-led. Every session is coached, not just supervised.
- The tone is direct, confident, and encouraging — never cheesy or corporate. Think "your coach talking to you" not "marketing department."

Content themes to focus on:
1. HYROX training and events — workouts, race prep tips, results, event hype
2. Community and member spotlights — celebrating wins, featuring members, showing the culture
3. Elevate — Centerline's group weightlifting class. Coached barbell work in a team setting. Highlight the programming, the energy, and members hitting PRs together.
4. Personal Training — one-on-one coaching for individualized goals. Showcase transformations, the coach-athlete relationship, and what makes PT at a performance gym different from a big box.

Target platforms: Instagram, Facebook, TikTok
Posting cadence: 3-4 times per week

CRITICAL WRITING STYLE RULES (follow every single one):

PUNCTUATION:
- Use commas and periods to create pauses. NEVER use em dashes (—) or double hyphens (--). Not once.
- One exclamation point max per caption. Usually zero.

BANNED PATTERNS (using ANY of these is a failure):
- NEVER use contrast framing: "The people who X... the people who don't Y," "Not just X, but Y," "It's not about X, it's about Y," "This isn't X, this is Y." No version of this structure. Ever.
- NEVER use dramatic reveals: "Then boom," "And then it hits you," "That's when you realize," "That's the difference."
- NEVER personify body parts for drama: "Your legs are questioning life choices," "Your shoulders are screaming," "Your lungs are begging." Just say it was hard.
- NEVER use performative storytelling: "Sounds simple until...," "Nobody talks about...," "Here's what people don't realize..."
- NEVER use these phrases: "hits different," "built different," "let's be honest," "here's the thing," "the truth is," "if you know you know," "let that sink in," "game changer," "level up," "show up," "just saying," "that's a wrap," "where the magic happens," "trust the process," "embrace the grind," "earn it every day."

VOICE:
- You are a coach who just finished a session and grabbed your phone. You're telling a friend what happened today.
- Talk TO people like a person, not AT them like a brand. No dramatic buildup. No clever turns. No punchlines.
- Use "I" and "we." Say what happened. Say why it was hard or cool or worth showing up for. That's it.
- Keep it flat and real. If something was tough, just say it was tough. Don't dramatize it.
- Short sentences. Fragments are fine. A little messy is good. Don't be polished.
- Don't start with "So" or "Look."
- Do not use "y'all."
- End with a simple, low-pressure CTA. "DM us if you want to come train" not "Ready to find out what you're made of?"

EXAMPLE OF WHAT WE WANT:
"We ran wall balls into running today. Six rounds. By the third round your shoulders are done from the sled pushes and you still have to get that ball above the line. That's the part of HYROX nobody warns you about, doing stations back to back when you're already tired. Proud of the crew today. They put in the work. DM us if you want to come train."

EXAMPLE OF WHAT WE DO NOT WANT:
"That sound hits different. Twenty wall balls, then straight to running. Sounds simple until you're 6 rounds deep. Your legs are questioning every life choice. This is where the magic happens. The people who trained keep moving. The people who didn't... well, they learn a lesson about preparation."`;


const PLATFORMS = ["Instagram", "Facebook", "TikTok"];
const THEMES = ["HYROX Training & Events", "Community / Member Spotlights", "Elevate (Group Weightlifting)", "Personal Training"];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const FULL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function getWeekDates(offset = 0) {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1) + offset * 7);
  return DAYS.map((d, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return {
      day: d,
      fullDay: FULL_DAYS[i],
      date: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      isToday:
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear(),
    };
  });
}

const STORAGE_KEY = "centerline-social-posts";

function loadPosts() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function savePosts(posts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (e) {
    console.error("Storage error:", e);
  }
}

async function callClaude(prompt) {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, system: BRAND_CONTEXT }),
  });
  if (!response.ok) {
    throw new Error("API call failed");
  }
  const data = await response.json();
  return data.text;
}

function PostCard({ post, onDelete, onEdit }) {
  const platformColors = {
    Instagram: { bg: "rgba(225,48,108,0.15)", text: "#E1306C", border: "rgba(225,48,108,0.3)" },
    Facebook: { bg: "rgba(24,119,242,0.15)", text: "#1877F2", border: "rgba(24,119,242,0.3)" },
    TikTok: { bg: "rgba(0,242,234,0.15)", text: "#00F2EA", border: "rgba(0,242,234,0.3)" },
  };
  const colors = platformColors[post.platform] || { bg: "rgba(255,255,255,0.05)", text: "#aaa", border: "rgba(255,255,255,0.1)" };

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 10,
      padding: 16,
      marginBottom: 10,
      position: "relative",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          padding: "3px 8px",
          borderRadius: 4,
          background: colors.bg,
          color: colors.text,
          border: `1px solid ${colors.border}`,
        }}>{post.platform}</span>
        <span style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.35)",
          fontWeight: 500,
        }}>{post.theme}</span>
      </div>
      {post.idea && (
        <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)", marginBottom: 6 }}>
          {post.idea}
        </div>
      )}
      {post.caption && (
        <div style={{
          fontSize: 12.5,
          color: "rgba(255,255,255,0.55)",
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
          background: "rgba(0,0,0,0.2)",
          borderRadius: 6,
          padding: 10,
          marginTop: 6,
        }}>
          {post.caption}
        </div>
      )}
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button onClick={onEdit} style={{
          fontSize: 11, color: "rgba(255,255,255,0.4)", background: "none", border: "none",
          cursor: "pointer", padding: 0, fontFamily: "inherit",
        }}>Edit</button>
        <button onClick={onDelete} style={{
          fontSize: 11, color: "rgba(255,100,100,0.5)", background: "none", border: "none",
          cursor: "pointer", padding: 0, fontFamily: "inherit",
        }}>Remove</button>
      </div>
    </div>
  );
}

function CaptionCard({ platform, caption, btnSecondary }) {
  const [copied, setCopied] = useState(false);
  const platformColors = { Instagram: "#E1306C", Facebook: "#1877F2", TikTok: "#00F2EA" };
  const c = platformColors[platform];
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${c}33`,
      borderRadius: 10,
      padding: 20,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <span style={{
          fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
          padding: "4px 10px", borderRadius: 4,
          background: `${c}22`, color: c, border: `1px solid ${c}44`,
        }}>{platform}</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(caption);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          style={{
            ...btnSecondary, padding: "6px 14px", fontSize: 11,
            background: copied ? "rgba(208,255,0,0.15)" : "rgba(255,255,255,0.05)",
            color: copied ? "#D0FF00" : "rgba(255,255,255,0.7)",
            borderColor: copied ? "rgba(208,255,0,0.3)" : "rgba(255,255,255,0.15)",
          }}
        >{copied ? "Copied!" : "Copy"}</button>
      </div>
      <div style={{
        fontSize: 13.5, color: "rgba(255,255,255,0.8)", lineHeight: 1.7,
        whiteSpace: "pre-wrap", background: "rgba(0,0,0,0.2)",
        borderRadius: 8, padding: 16,
      }}>
        {caption}
      </div>
    </div>
  );
}

export default function Page() {
  const [view, setView] = useState("calendar");
  const [posts, setPosts] = useState({});
  const [weekOffset, setWeekOffset] = useState(0);
  const [generating, setGenerating] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);
  const [showComposer, setShowComposer] = useState(false);
  const [composerData, setComposerData] = useState({ platforms: ["Instagram"], theme: THEMES[0], idea: "", caption: "" });
  const [ideaResults, setIdeaResults] = useState([]);
  const [captionResults, setCaptionResults] = useState({});
  const [editingPost, setEditingPost] = useState(null);
  const [captionPlatforms, setCaptionPlatforms] = useState(["Instagram"]);
  const [captionIdea, setCaptionIdea] = useState("");
  const [captionTheme, setCaptionTheme] = useState(THEMES[0]);
  const [ideaTheme, setIdeaTheme] = useState(THEMES[0]);
  const [mounted, setMounted] = useState(false);

  const weekDates = getWeekDates(weekOffset);

  useEffect(() => {
    setPosts(loadPosts());
    setMounted(true);
  }, []);

  const saveAndUpdate = useCallback((newPosts) => {
    setPosts(newPosts);
    savePosts(newPosts);
  }, []);

  const addPost = (dayKey, post) => {
    const updated = { ...posts };
    if (!updated[dayKey]) updated[dayKey] = [];
    updated[dayKey] = [...updated[dayKey], { ...post, id: Date.now() }];
    saveAndUpdate(updated);
  };

  const removePost = (dayKey, postId) => {
    const updated = { ...posts };
    updated[dayKey] = (updated[dayKey] || []).filter((p) => p.id !== postId);
    if (updated[dayKey].length === 0) delete updated[dayKey];
    saveAndUpdate(updated);
  };

  const updatePost = (dayKey, postId, newData) => {
    const updated = { ...posts };
    updated[dayKey] = (updated[dayKey] || []).map((p) => (p.id === postId ? { ...p, ...newData } : p));
    saveAndUpdate(updated);
  };

  const generateIdeas = async () => {
    setGenerating("ideas");
    try {
      const prompt = `Generate 5 specific, ready-to-execute social media post ideas for Centerline Fitness & Performance.

Theme: ${ideaTheme}

For each idea, provide:
- A clear, specific post concept (1-2 sentences)
- The visual needed in 5 words or less (e.g., "quick phone video" or "photo at the rig")

Format each idea as:
IDEA: [concept]
VISUAL: [brief visual type]

Make these specific and actionable. Think about what would actually stop someone mid-scroll. Reference real scenarios that happen at a combat sports and HYROX gym.`;

      const result = await callClaude(prompt);
      const ideas = result
        .split(/IDEA:\s*/)
        .filter(Boolean)
        .map((block) => {
          const [idea, ...rest] = block.split(/VISUAL:\s*/);
          return {
            idea: idea.trim(),
            visual: rest.join("").trim(),
          };
        });
      setIdeaResults(ideas);
    } catch (e) {
      console.error(e);
      setIdeaResults([{ idea: "Error generating ideas. Check connection and try again.", visual: "" }]);
    }
    setGenerating("");
  };

  const generateCaption = async () => {
    if (captionPlatforms.length === 0) return;
    setGenerating("caption");
    setCaptionResults({});
    const platformGuides = {
      Instagram: "Instagram: 1-3 short paragraphs. Punchy opener that hooks. Use line breaks for readability. Include 5-8 relevant hashtags at the end. Include a call to action.",
      Facebook: "Facebook: Conversational tone. 2-4 sentences. Ask a question or encourage comments. No hashtags or maybe 1-2 max. More community-focused.",
      TikTok: "TikTok: Very short, punchy. 1-2 lines max. Use trending language naturally (not forced). Include 3-4 hashtags. Think hook + payoff.",
    };
    try {
      const results = {};
      await Promise.all(
        captionPlatforms.map(async (platform) => {
          const prompt = `Write a social media caption for Centerline Fitness & Performance.

Platform: ${platform}
Theme: ${captionTheme}
Post concept: ${captionIdea || "General post about " + captionTheme}

Platform-specific guidelines:
- ${platformGuides[platform]}

STYLE REMINDER: You just finished a session and grabbed your phone. Say what happened, say why it was hard or cool, and move on. No drama, no clever turns, no contrast framing, no personifying body parts, no punchlines. Commas and periods only, never em dashes. Flat and real. Low-pressure CTA at the end.

Write ONLY the caption text, nothing else. No labels or meta-commentary.`;
          try {
            results[platform] = await callClaude(prompt);
          } catch {
            results[platform] = "Error generating caption for " + platform;
          }
        })
      );
      setCaptionResults(results);
    } catch (e) {
      console.error(e);
    }
    setGenerating("");
  };

  const thisWeekPostCount = weekDates.reduce((sum, d) => sum + (posts[d.key]?.length || 0), 0);

  const navStyle = (v) => ({
    padding: "10px 20px",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.2s",
    background: view === v ? "rgba(208,255,0,0.12)" : "transparent",
    color: view === v ? "#D0FF00" : "rgba(255,255,255,0.4)",
    borderBottom: view === v ? "2px solid #D0FF00" : "2px solid transparent",
  });

  const btnPrimary = {
    padding: "10px 20px",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.05em",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontFamily: "inherit",
    background: "#D0FF00",
    color: "#0a0a0a",
  };

  const btnSecondary = {
    padding: "10px 20px",
    fontSize: 13,
    fontWeight: 600,
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 6,
    cursor: "pointer",
    fontFamily: "inherit",
    background: "rgba(255,255,255,0.05)",
    color: "rgba(255,255,255,0.7)",
  };

  const selectStyle = {
    padding: "8px 12px",
    fontSize: 13,
    fontWeight: 600,
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 6,
    fontFamily: "inherit",
    background: "rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.8)",
    outline: "none",
  };

  const textareaStyle = {
    width: "100%",
    padding: 12,
    fontSize: 13,
    fontFamily: "inherit",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 6,
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.85)",
    outline: "none",
    resize: "vertical",
    lineHeight: 1.6,
    boxSizing: "border-box",
  };

  if (!mounted) return null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "#fff",
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "20px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(255,255,255,0.02)",
      }}>
        <div>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#D0FF00",
          }}>CENTERLINE</div>
          <div style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.3)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginTop: 2,
          }}>Social Command Center</div>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: thisWeekPostCount >= 3 ? "#D0FF00" : thisWeekPostCount >= 1 ? "#FFA500" : "#FF4444",
          }} />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>
            {thisWeekPostCount}/4 this week
          </span>
        </div>
      </div>

      {/* Nav */}
      <div style={{
        display: "flex",
        gap: 4,
        padding: "12px 28px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <button onClick={() => setView("calendar")} style={navStyle("calendar")}>Calendar</button>
        <button onClick={() => setView("ideas")} style={navStyle("ideas")}>Ideas</button>
        <button onClick={() => setView("captions")} style={navStyle("captions")}>Captions</button>
      </div>

      <div style={{ padding: "24px 28px", maxWidth: 900, margin: "0 auto" }}>

        {/* ---- CALENDAR VIEW ---- */}
        {view === "calendar" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <button onClick={() => setWeekOffset(weekOffset - 1)} style={{ ...btnSecondary, padding: "8px 14px" }}>&larr;</button>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>
                  {weekOffset === 0 ? "This Week" : weekOffset === 1 ? "Next Week" : weekOffset === -1 ? "Last Week" : `Week ${weekOffset > 0 ? "+" : ""}${weekOffset}`}
                </div>
              </div>
              <button onClick={() => setWeekOffset(weekOffset + 1)} style={{ ...btnSecondary, padding: "8px 14px" }}>&rarr;</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
              {weekDates.map((d) => {
                const dayPosts = posts[d.key] || [];
                return (
                  <div
                    key={d.key}
                    onClick={() => { setSelectedDay(d); setShowComposer(false); setEditingPost(null); }}
                    style={{
                      background: d.isToday ? "rgba(208,255,0,0.06)" : "rgba(255,255,255,0.02)",
                      border: selectedDay?.key === d.key ? "1px solid rgba(208,255,0,0.4)" : d.isToday ? "1px solid rgba(208,255,0,0.15)" : "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 8,
                      padding: "12px 8px",
                      minHeight: 100,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: d.isToday ? "#D0FF00" : "rgba(255,255,255,0.3)", marginBottom: 4 }}>
                      {d.day}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: d.isToday ? "#D0FF00" : "rgba(255,255,255,0.6)", marginBottom: 8 }}>
                      {d.date}
                    </div>
                    {dayPosts.map((p) => {
                      const c = { Instagram: "#E1306C", Facebook: "#1877F2", TikTok: "#00F2EA" };
                      return (
                        <div key={p.id} style={{
                          fontSize: 10,
                          padding: "3px 6px",
                          borderRadius: 3,
                          marginBottom: 3,
                          background: `${c[p.platform] || "#666"}22`,
                          color: c[p.platform] || "#999",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}>
                          {p.platform?.charAt(0)}: {p.idea?.slice(0, 20) || "Post"}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Day Detail Panel */}
            {selectedDay && (
              <div style={{
                marginTop: 20,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                padding: 24,
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{selectedDay.fullDay}, {selectedDay.date}</div>
                  <button onClick={() => {
                    setShowComposer(true);
                    setEditingPost(null);
                    setComposerData({ platforms: ["Instagram"], theme: THEMES[0], idea: "", caption: "" });
                  }} style={btnPrimary}>+ Add Post</button>
                </div>

                {(posts[selectedDay.key] || []).map((p) => (
                  <PostCard
                    key={p.id}
                    post={p}
                    onDelete={() => removePost(selectedDay.key, p.id)}
                    onEdit={() => {
                      setEditingPost(p);
                      setComposerData({ platforms: [p.platform], theme: p.theme, idea: p.idea, caption: p.caption });
                      setShowComposer(true);
                    }}
                  />
                ))}

                {(posts[selectedDay.key] || []).length === 0 && !showComposer && (
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", textAlign: "center", padding: 20 }}>
                    No posts scheduled. Click &quot;+ Add Post&quot; to plan content for this day.
                  </div>
                )}

                {/* Composer */}
                {showComposer && (
                  <div style={{
                    marginTop: 12,
                    background: "rgba(0,0,0,0.3)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10,
                    padding: 20,
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: "rgba(255,255,255,0.85)" }}>
                      {editingPost ? "Edit Post" : "New Post"}
                    </div>
                    <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
                      {PLATFORMS.map((p) => {
                        const checked = (composerData.platforms || []).includes(p);
                        const pColors = { Instagram: "#E1306C", Facebook: "#1877F2", TikTok: "#00F2EA" };
                        const pc = pColors[p];
                        return (
                          <label key={p} onClick={() => {
                            if (editingPost) return;
                            setComposerData(prev => ({
                              ...prev,
                              platforms: prev.platforms.includes(p)
                                ? prev.platforms.filter(x => x !== p)
                                : [...prev.platforms, p]
                            }));
                          }} style={{
                            display: "flex", alignItems: "center", gap: 6, cursor: editingPost ? "default" : "pointer",
                            padding: "6px 10px", borderRadius: 5,
                            background: checked ? `${pc}18` : "rgba(255,255,255,0.03)",
                            border: `1px solid ${checked ? `${pc}55` : "rgba(255,255,255,0.1)"}`,
                            opacity: editingPost && !checked ? 0.3 : 1,
                            userSelect: "none",
                          }}>
                            <div style={{
                              width: 16, height: 16, borderRadius: 3,
                              border: `2px solid ${checked ? pc : "rgba(255,255,255,0.25)"}`,
                              background: checked ? pc : "transparent",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              {checked && <span style={{ color: "#fff", fontSize: 10, fontWeight: 800 }}>&#10003;</span>}
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 700, color: checked ? pc : "rgba(255,255,255,0.5)" }}>{p}</span>
                          </label>
                        );
                      })}
                      <select value={composerData.theme} onChange={(e) => setComposerData({ ...composerData, theme: e.target.value })} style={selectStyle}>
                        {THEMES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <input
                      placeholder="Post idea or concept..."
                      value={composerData.idea}
                      onChange={(e) => setComposerData({ ...composerData, idea: e.target.value })}
                      style={{ ...textareaStyle, marginBottom: 10, padding: "10px 12px" }}
                    />
                    <textarea
                      placeholder="Caption (paste from Captions tab or write your own)..."
                      value={composerData.caption}
                      onChange={(e) => setComposerData({ ...composerData, caption: e.target.value })}
                      rows={4}
                      style={{ ...textareaStyle, marginBottom: 12 }}
                    />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => {
                          if (editingPost) {
                            updatePost(selectedDay.key, editingPost.id, { ...composerData, platform: composerData.platforms[0] });
                          } else {
                            (composerData.platforms || []).forEach((plat) => {
                              addPost(selectedDay.key, { ...composerData, platform: plat });
                            });
                          }
                          setShowComposer(false);
                          setEditingPost(null);
                          setComposerData({ platforms: ["Instagram"], theme: THEMES[0], idea: "", caption: "" });
                        }}
                        disabled={!composerData.platforms || composerData.platforms.length === 0}
                        style={{ ...btnPrimary, opacity: (!composerData.platforms || composerData.platforms.length === 0) ? 0.5 : 1 }}
                      >
                        {editingPost ? "Save Changes" : "Schedule Post"}
                      </button>
                      <button
                        onClick={() => { setShowComposer(false); setEditingPost(null); }}
                        style={btnSecondary}
                      >Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ---- IDEAS VIEW ---- */}
        {view === "ideas" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Content Ideas</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
                AI-generated post concepts tailored to Centerline&apos;s brand.
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
              <select value={ideaTheme} onChange={(e) => setIdeaTheme(e.target.value)} style={selectStyle}>
                {THEMES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <button onClick={generateIdeas} disabled={generating === "ideas"} style={{
                ...btnPrimary,
                opacity: generating === "ideas" ? 0.6 : 1,
              }}>
                {generating === "ideas" ? "Generating..." : "Generate Ideas"}
              </button>
            </div>

            {ideaResults.length > 0 && (
              <div>
                {ideaResults.map((idea, i) => (
                  <div key={i} style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 10,
                    padding: 16,
                    marginBottom: 10,
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.85)", marginBottom: 6, lineHeight: 1.5 }}>
                      {idea.idea}
                    </div>
                    {idea.visual && (
                      <div style={{ fontSize: 12, color: "rgba(208,255,0,0.6)", marginBottom: 10 }}>
                        Visual: {idea.visual}
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setCaptionIdea(idea.idea);
                        setCaptionTheme(ideaTheme);
                        setCaptionPlatforms([...PLATFORMS]);
                        setView("captions");
                      }}
                      style={{ ...btnSecondary, padding: "6px 14px", fontSize: 11 }}
                    >
                      Write Caption for This &rarr;
                    </button>
                  </div>
                ))}
              </div>
            )}

            {ideaResults.length === 0 && (
              <div style={{
                textAlign: "center",
                padding: 60,
                color: "rgba(255,255,255,0.2)",
                fontSize: 13,
              }}>
                Select a theme, then hit &quot;Generate Ideas&quot; to get started.
              </div>
            )}
          </div>
        )}

        {/* ---- CAPTIONS VIEW ---- */}
        {view === "captions" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Caption Writer</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
                Generate platform-specific captions for Centerline. Select one or more platforms.
              </div>
            </div>
            <div style={{ display: "flex", gap: 16, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
              {PLATFORMS.map((p) => {
                const checked = captionPlatforms.includes(p);
                const platformColors = { Instagram: "#E1306C", Facebook: "#1877F2", TikTok: "#00F2EA" };
                const c = platformColors[p];
                return (
                  <label key={p} onClick={() => {
                    setCaptionPlatforms(prev =>
                      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
                    );
                  }} style={{
                    display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
                    padding: "8px 14px", borderRadius: 6,
                    background: checked ? `${c}18` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${checked ? `${c}55` : "rgba(255,255,255,0.1)"}`,
                    transition: "all 0.15s",
                    userSelect: "none",
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 4,
                      border: `2px solid ${checked ? c : "rgba(255,255,255,0.25)"}`,
                      background: checked ? c : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.15s",
                    }}>
                      {checked && <span style={{ color: "#fff", fontSize: 12, fontWeight: 800, lineHeight: 1 }}>&#10003;</span>}
                    </div>
                    <span style={{
                      fontSize: 13, fontWeight: 700, color: checked ? c : "rgba(255,255,255,0.5)",
                      letterSpacing: "0.03em",
                    }}>{p}</span>
                  </label>
                );
              })}
            </div>
            <div style={{ marginBottom: 12 }}>
              <select value={captionTheme} onChange={(e) => setCaptionTheme(e.target.value)} style={selectStyle}>
                {THEMES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <textarea
              placeholder="Describe the post concept... (e.g., 'Video of Sarah crushing her first HYROX wall balls after 6 weeks of training')"
              value={captionIdea}
              onChange={(e) => setCaptionIdea(e.target.value)}
              rows={3}
              style={{ ...textareaStyle, marginBottom: 12 }}
            />
            <button onClick={generateCaption} disabled={generating === "caption" || captionPlatforms.length === 0} style={{
              ...btnPrimary,
              opacity: (generating === "caption" || captionPlatforms.length === 0) ? 0.5 : 1,
              marginBottom: 20,
            }}>
              {generating === "caption" ? "Writing..." : `Generate Caption${captionPlatforms.length > 1 ? "s" : ""}`}
            </button>

            {Object.keys(captionResults).length > 0 && (
              <div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {PLATFORMS.filter(p => captionResults[p]).map((platform) => (
                    <CaptionCard
                      key={platform}
                      platform={platform}
                      caption={captionResults[platform]}
                      btnSecondary={btnSecondary}
                    />
                  ))}
                </div>
                <button
                  onClick={() => {
                    const platforms = PLATFORMS.filter(p => captionResults[p]);
                    const targetDay = selectedDay || weekDates.find(d => d.isToday) || weekDates[0];
                    if (!selectedDay) setSelectedDay(targetDay);
                    const updated = { ...posts };
                    if (!updated[targetDay.key]) updated[targetDay.key] = [];
                    platforms.forEach((platform) => {
                      updated[targetDay.key] = [...updated[targetDay.key], {
                        platforms: [platform],
                        platform: platform,
                        theme: captionTheme,
                        idea: captionIdea,
                        caption: captionResults[platform],
                        id: Date.now() + Math.random(),
                      }];
                    });
                    saveAndUpdate(updated);
                    setView("calendar");
                  }}
                  style={{ ...btnPrimary, marginTop: 16, width: "100%" }}
                >Add All to Calendar</button>
              </div>
            )}

            {Object.keys(captionResults).length === 0 && (
              <div style={{
                textAlign: "center", padding: 60,
                color: "rgba(255,255,255,0.2)", fontSize: 13,
              }}>
                {captionPlatforms.length === 0
                  ? "Select at least one platform to generate captions."
                  : "Describe a post concept and hit generate to get platform-specific captions."}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
