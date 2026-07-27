import { useState, useEffect, useCallback } from "react";
import StoriesBar from "./components/StoriesBar";
import type { StoryType } from "./types/story";
import StoryModal from "./components/StoryModal";
import { defaultStories } from "./data/defaultStories";
import CreateStoryModal from "./components/CreateStoryModal";
import styles from "./App.module.css";
import { FiSun, FiMoon } from "react-icons/fi";

// ======================================================================================
// MAIN COMPONENT
// ======================================================================================

export default function App() {
  // ======================================================================================
  // COMPONENT STATE
  // ======================================================================================

  // Current application theme
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("app-theme") as "light" | "dark") || "light";
  });

  // Currently opened story
  const [activeStoryId, setActiveStoryId] = useState<null | number>(null);

  // Temporary image selected for a new story
  const [tempImage, setTempImage] = useState<string | null>(null);

  // User name entered while creating a story
  const [inputName, setInputName] = useState("");

  // Selected avatar for the new story
  const [selectedAvatar, setSelectedAvatar] = useState("none");

  // Load stories from local storage and remove expired stories
  const [stories, setStories] = useState<StoryType[]>(() => {
    const savedStories = localStorage.getItem("insta_stories");

    if (savedStories) {
      const parsedStories: StoryType[] = JSON.parse(savedStories);

      const twentyFourHoursInMs = 24 * 60 * 60 * 1000;
      const currentTime = Date.now();

      return parsedStories.filter((story) => {
        if (!story.createdAt) return true;

        return currentTime - story.createdAt < twentyFourHoursInMs;
      });
    } else {
      return defaultStories;
    }
  });

  // ======================================================================================
  // EFFECTS
  // ======================================================================================

  // Persist theme changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Persist stories in local storage
  useEffect(() => {
    try {
      localStorage.setItem("insta_stories", JSON.stringify(stories));
    } catch (error) {
      console.error("Storage full!", error);
      if (stories.length > 2) {
        const trimmedStories = stories.slice(0, 2);
        setStories(trimmedStories);
        alert(
          "The oldest stories were automatically deleted because the memory was full.",
        );
      }
    }
  }, [stories]);

  // Returns the currently selected story
  const currentStory = stories.find((story) => story.id === activeStoryId);

  // ======================================================================================
  // EVENT HANDLERS
  // ======================================================================================

  // Validates the selected image before creating a story
  const handleFilePicked = (base64String: string) => {
    const stringLength = base64String.length - (base64String.indexOf(",") + 1);
    const sizeInBytes = (stringLength * 3) / 4;
    const sizeInMB = sizeInBytes / (1024 * 1024);

    if (sizeInMB > 1.5) {
      alert(
        "The image is too large! Please select an image smaller than 1.5 MB",
      );
      return;
    }
    setTempImage(base64String);
  };

  // Creates and publishes a new story
  const handlePublishStory = () => {
    if (!tempImage) return;

    // Resolve the selected avatar
    const finalAvatarUrl =
      selectedAvatar === "none"
        ? ""
        : `https://i.pravatar.cc/150?img=${selectedAvatar}`;

    // Create the new story object
    const newStory: StoryType = {
      id: Date.now(),
      name: inputName.trim() || "You",
      avatar: finalAvatarUrl,
      image: tempImage,
      createdAt: Date.now(),
    };

    setStories((prevStories) => [newStory, ...prevStories]);

    // Reset the story creation form
    setTempImage(null);
    setInputName("");
    setSelectedAvatar("none");
  };

  // ======================================================================================
  // STORY NAVIGATION
  // ======================================================================================

  // Navigate to the next story
  const handleNextStory = useCallback(() => {
    const currentIndex = stories.findIndex((s) => s.id === activeStoryId);
    if (currentIndex < stories.length - 1) {
      setActiveStoryId(stories[currentIndex + 1].id);
    } else {
      setActiveStoryId(null);
    }
  }, [activeStoryId, stories]);

  // Navigate to the previous story
  const handlePrevStory = useCallback(() => {
    const currentIndex = stories.findIndex((s) => s.id === activeStoryId);
    if (currentIndex > 0) {
      setActiveStoryId(stories[currentIndex - 1].id);
    }
  }, [activeStoryId, stories]);

  // ====================================================================================
  // RENDER UI (RETURN)
  // ====================================================================================

  return (
    <div className={styles.appContainer}>
      <div className={styles.appFrame}>
        {/* Application header */}
        <header className={styles.appHeader}>
          {/* Brand logo */}
          <div
            className={styles.headerLeft}
            onClick={() => {
              setActiveStoryId(null);
              setTempImage(null);
            }}
            title="Go to Home"
          >
            <span className={styles.brandLogo}>
              <svg
                className={styles.cameraLogoSvg}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
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

          {/* Theme toggle button */}
          <button
            onClick={toggleTheme}
            className={styles.iconBtn}
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <FiMoon size={22} /> : <FiSun size={22} />}
          </button>
        </header>

        {/* Stories list */}
        <StoriesBar
          onSelectStory={setActiveStoryId}
          stories={stories}
          onUploadStory={handleFilePicked}
        />

        {/* Dashboard */}
        <div className={styles.dashboardArea}>
          <div className={styles.dashboardCard}>
            <div className={styles.dashboardIcon}>📸</div>

            <h2 className={styles.dashboardTitle}>Share Your Moments</h2>

            <p className={styles.dashboardDesc}>
              Upload your favorite images as ephemeral stories. Photos will
              automatically clear from local memory after 24 hours.
            </p>

            <div className={styles.buttonGroupRow}>
              {/* Upload story button */}
              <button
                onClick={() => {
                  window.dispatchEvent(new Event("trigger-story-upload"));
                }}
                className={styles.dashboardUploadBtn}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Upload Story
              </button>

              {/* Active stories counter */}
              <div className={styles.statusBadge}>
                Active Stories: {stories.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Story viewer modal */}
      {currentStory && (
        <StoryModal
          key={currentStory.id}
          currentStory={currentStory}
          stories={stories}
          onClose={() => setActiveStoryId(null)}
          onNext={handleNextStory}
          onPrev={handlePrevStory}
        />
      )}

      {/* Story creation modal */}
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
