import { useState, useEffect, useCallback } from "react";
import StoriesBar from "./components/StoriesBar";
import type { StoryType } from "./types/story";
import StoryModal from "./components/StoryModal";
import { defaultStories } from "./data/defaultStories";
import CreateStoryModal from "./components/CreateStoryModal";
import styles from "./App.module.css";

// ======================================================================================
/**
 * MAIN APP COMPONENT
 *
 * Purpose: Acts as the root feed container, managing the list of stories, new user
 * uploads, and dynamic story view switching (modals).
 *
 * Key Features:
 * 1. Safe Array Updates: Implements functional prevStories updates to safely handle
 *    asynchronous base64 uploads without data race conditions.
 * 2. Carousel Traversal: Computes runtime pointers (index offsets) dynamically to map
 *    the current modal snapshot with 'next' and 'previous' navigation controls.
 * 3. Defensive Fallbacks: Implements an active memory guard clause to gracefully absorb
 *    state mismatches instead of hard-crashing the view framework.
 */
// ======================================================================================

export default function App() {
  // ------------------------------------------
  // HOOKS & STATES (Always at the top level!)
  // ------------------------------------------

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("app-theme") as "light" | "dark") || "light";
  });

  // Track which story is currently open. 'null' means no story is active/open.
  const [activeStoryId, setActiveStoryId] = useState<null | number>(null);

  const [tempImage, setTempImage] = useState<string | null>(null);
  const [inputName, setInputName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("none");

  const [stories, setStories] = useState<StoryType[]>(() => {
    const savedStories = localStorage.getItem("insta_stories");
    if (savedStories) {
      const parsedStories: StoryType[] = JSON.parse(savedStories);

      // TODO: Temporary test configuration - Set expiry interval to 10 seconds (10 * 1000) to
      // verify automatic cleanup behavior.
      const twentyFourHoursInMs = 24 * 60 * 60 * 1000;
      const currentTime = Date.now();

      // Filter out stories that are older than 24 hours
      const validStories = parsedStories.filter((story) => {
        // Agar story ke paas 'createdAt' nahi hai (Default Mock Stories), toh usay rakho
        if (!story.createdAt) return true;

        // Check karo ke kya time difference 24 ghante se kam hai
        const isStillValid =
          currentTime - story.createdAt < twentyFourHoursInMs;
        return isStillValid;
      });

      return validStories;
    } else {
      // Default dummy stories array mapping...
      return defaultStories;
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("insta_stories", JSON.stringify(stories));
  }, [stories]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // ------------------------------------------
  // RUNTIME POINTER CALCULATIONS
  // ------------------------------------------

  const currentStory = activeStoryId !== null ? stories[activeStoryId] : null;

  // ------------------------------------------
  // 1. STORY UPLOAD & CAROUSEL TRAVERSAL LOGIC
  // ------------------------------------------

  /**
   * HANDLER: Base64 Media Push
   * Assembles a structured type object block for custom files and safely prepends it
   * to the head of the current global dataset list using a real-time memory snapshot.
   */

  // ------------------------------------------
  //
  // ------------------------------------------

  const handleFilePicked = (base64String: string) => {
    setTempImage(base64String);
  };

  const handlePublishStory = () => {
    if (!tempImage) return;

    const finalAvatarUrl =
      selectedAvatar === "none"
        ? ""
        : `https://i.pravatar.cc/100?img=${selectedAvatar}`;

    const newStory: StoryType = {
      id: Date.now(),
      name: inputName.trim() || "You",
      avatar: finalAvatarUrl,
      image: tempImage,
      createdAt: Date.now(),
    };

    setStories((prevStories) => [newStory, ...prevStories]);
    setTempImage(null);
    setInputName("");
    setSelectedAvatar("none");
  };

  // Traverses forward inside the stories array collection or closes when list boundary ends
  const handleNextStory = useCallback(() => {
    if (activeStoryId !== null && activeStoryId < stories.length - 1) {
      setActiveStoryId(activeStoryId + 1);
    } else {
      setActiveStoryId(null);
    }
  }, [activeStoryId, stories.length]); // Explicit dependencies for clean reference tracking

  // Traverses backward inside the list collection to display the previous memory index
  const handlePrevStory = useCallback(() => {
    if (activeStoryId !== null && activeStoryId > 0) {
      setActiveStoryId(activeStoryId - 1);
    }
  }, [activeStoryId]);

  const triggerUpload = () => {
    const fileInput = document.getElementById("global-story-input");
    if (fileInput) fileInput.click();
  };

  // ==========================================
  // SCREEN RENDER (RETURN)
  // ==========================================

  return (
    <div className={styles.appContainer}>
      <div className={styles.appFrame}>
        {/* MODERN HEADER SECTION */}
        <header className={styles.appHeader}>
          {/* Left: Branding Layout */}
          <div className={styles.headerLeft}>
            <span className={styles.brandLogo}>
              <svg
                className={styles.cameraLogoSvg}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Outer Technical/Circuit Background Lines */}
                <path
                  d="M40 15H55V22H40V15Z"
                  stroke="url(#instaGradient)"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M25 45C18 45 15 38 15 32C15 25 20 22 28 22H65V32"
                  stroke="url(#instaGradient)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

                {/* Main Dynamic Tripod/Base Lines */}
                <line
                  x1="40"
                  y1="55"
                  x2="28"
                  y2="88"
                  stroke="url(#instaGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <line
                  x1="60"
                  y1="55"
                  x2="72"
                  y2="88"
                  stroke="url(#instaGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <line
                  x1="35"
                  y1="72"
                  x2="65"
                  y2="72"
                  stroke="url(#instaGradient)"
                  strokeWidth="2"
                />
                <line
                  x1="38"
                  y1="80"
                  x2="62"
                  y2="80"
                  stroke="url(#instaGradient)"
                  strokeWidth="2"
                />

                {/* Central Focus Lens Element */}
                <circle
                  cx="50"
                  cy="46"
                  r="16"
                  stroke="url(#instaGradient)"
                  strokeWidth="4.5"
                />
                <circle
                  cx="50"
                  cy="46"
                  r="9"
                  stroke="url(#instaGradient)"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
                <path
                  d="M62 38C64 40 65 43 65 46"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

                {/* Side Speed Trails (Glow Lines) */}
                <line
                  x1="72"
                  y1="40"
                  x2="88"
                  y2="40"
                  stroke="#f99d1c"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="72"
                  y1="46"
                  x2="92"
                  y2="46"
                  stroke="#da2f7f"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Gradient Definition Machine */}
                <defs>
                  <linearGradient
                    id="instaGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#f99d1c" />
                    <stop offset="50%" stopColor="#da2f7f" />
                    <stop offset="100%" stopColor="#7c3cb5" />
                  </linearGradient>
                </defs>
              </svg>
            </span>

            {/* ── NEW SPLIT TEXT VIEW STRINGS FOR PAPER-CUT DESIGN ── */}
            <h1 className={styles.brandName} aria-label="Stories">
              <span className={styles.letter}>S</span>
              <span className={styles.letter}>t</span>
              <span className={styles.letter}>o</span>
              <span className={styles.letter}>r</span>
              <span className={styles.letter}>i</span>
              <span className={styles.letter}>e</span>
              <span className={styles.letter}>s</span>
            </h1>
          </div>

          {/* Right: Modern Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className={styles.iconBtn}
            aria-label="Toggle Theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </header>

        {/* Horizontal horizontal list layer block with uploaded asset receivers  */}
        <StoriesBar
          onSelectStoryById={(id) =>
            setActiveStoryId(stories.findIndex((s) => s.id === id))
          }
          stories={stories}
          onUploadStory={handleFilePicked}
        />

        <div className={styles.dashboardArea}>
          <div className={styles.dashboardCard}>
            <div className={styles.dashboardIcon}>📸</div>
            <h2 className={styles.dashboardTitle}>Share Your Moments</h2>
            <p className={styles.dashboardDesc}>
              Upload your favorite images as ephemeral stories. Photos will
              automatically clear from local memory after 24 hours.
            </p>

            <button
              onClick={triggerUpload}
              className={styles.dashboardUploadBtn}
            >
              Upload Story
            </button>

            {/* Real-time active stories dynamic indicator code */}
            <div className={styles.statusBadge}>
              Active Stories: <strong>{stories.length}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden layout input node for native file handling triggers */}
      <input
        type="file"
        id="global-story-input"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => handleFilePicked(reader.result as string);
            reader.readAsDataURL(file);
          }
        }}
      />

      {/* Conditional Rendering modal viewport context activation overlay */}
      {activeStoryId !== null && stories[activeStoryId] && (
        <StoryModal
          currentStory={stories[activeStoryId]}
          stories={stories}
          onClose={() => setActiveStoryId(null)}
          onNext={handleNextStory}
          onPrev={handlePrevStory}
        />
      )}

      {tempImage && (
        <CreateStoryModal
          tempImage={tempImage}
          inputName={inputName}
          selectedAvatar={selectedAvatar}
          onNameChange={setInputName}
          onAvatarChange={setSelectedAvatar}
          onCancel={() => {
            setTempImage(null);
            setSelectedAvatar("none");
            setInputName("");
          }}
          onPublish={handlePublishStory}
        />
      )}
    </div>
  );
}
