import { useState, useEffect } from "react";
import StoriesBar from "./components/StoriesBar";
import { type StoryType } from "./components/StoriesBar";
import StoryModal from "./components/StoryModal";

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

  // Track which story is currently open. 'null' means no story is active/open.
  const [activeStoryId, setActiveStoryId] = useState<null | number>(null);

  const [tempImage, setTempImage] = useState<string | null>(null);
  const [inputName, setInputName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("1");

  const [stories, setStories] = useState<StoryType[]>(() => {
    const savedStories = localStorage.getItem("insta_stories");

    if (savedStories) {
      const parsedStories: StoryType[] = JSON.parse(savedStories);

      // TODO: Temporary test configuration - Set expiry interval to 10 seconds (10 * 1000) to
      // verify automatic cleanup behavior.
      const twentyFourHoursInMs = 10 * 1000;
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
      return [
        {
          id: 1,
          name: "Sara",
          avatar: "https://i.pravatar.cc/100?img=1",
          image: "https://picsum.photos/id/1084/1080/1920",
        },
        {
          id: 2,
          name: "Muhammad",
          avatar: "https://i.pravatar.cc/100?img=2",
          image: "https://picsum.photos/id/1012/1080/1920",
        },
        {
          id: 3,
          name: "Osama",
          avatar: "https://i.pravatar.cc/100?img=3",
          image: "https://picsum.photos/id/1060/1080/1920",
        },
        {
          id: 4,
          name: "Hashir",
          avatar: "https://i.pravatar.cc/100?img=4",
          image: "https://picsum.photos/id/1067/1080/1920",
        },
        {
          id: 5,
          name: "Manha",
          avatar: "https://i.pravatar.cc/100?img=5",
          image: "https://picsum.photos/id/1043/1080/1920",
        },
        {
          id: 6,
          name: "Anoosh",
          avatar: "https://i.pravatar.cc/100?img=6",
          image: "https://picsum.photos/id/14/1080/1920",
        },
        {
          id: 7,
          name: "Orhan",
          avatar: "https://i.pravatar.cc/100?img=7",
          image: "https://picsum.photos/id/1033/1080/1920",
        },
        {
          id: 8,
          name: "Memoona",
          avatar: "https://i.pravatar.cc/100?img=8",
          image: "https://picsum.photos/id/1027/1080/1920",
        },
        {
          id: 9,
          name: "Zoha",
          avatar: "https://i.pravatar.cc/100?img=9",
          image: "https://picsum.photos/id/1025/1080/1920",
        },
        {
          id: 10,
          name: "Uhanna",
          avatar: "https://i.pravatar.cc/100?img=10",
          image: "https://picsum.photos/id/1011/1080/1920",
        },
      ];
    }
  });

  useEffect(() => {
    localStorage.setItem("insta_stories", JSON.stringify(stories));
  }, [stories]);

  // ------------------------------------------
  // RUNTIME POINTER CALCULATIONS
  // ------------------------------------------

  const currentStory = stories.find((story) => story.id === activeStoryId);

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

    const newStory: StoryType = {
      id: Date.now(),
      name: inputName.trim() || "You",
      avatar: `https://i.pravatar.cc/100?img=${selectedAvatar}`,
      image: tempImage,
      createdAt: Date.now(),
    };

    setStories((prevStories) => [newStory, ...prevStories]);

    setTempImage(null);
    setInputName("");
    setSelectedAvatar("1");
  };

  // Traverses forward inside the stories array collection or closes when list boundary ends
  const handleNextStory = () => {
    const currentIndex = stories.findIndex((s) => s.id === activeStoryId);
    if (currentIndex < stories.length - 1) {
      setActiveStoryId(stories[currentIndex + 1].id);
    } else {
      setActiveStoryId(null);
    }
  };

  // Traverses backward inside the list collection to display the previous memory index
  const handlePrevStory = () => {
    const currentIndex = stories.findIndex((s) => s.id === activeStoryId);
    if (currentIndex > 0) {
      setActiveStoryId(stories[currentIndex - 1].id);
    }
  };

  // ------------------------------------------
  // DEFENSIVE PROGRAMMING (GUARD CLAUSES)
  // ------------------------------------------

  // Safety fallback interceptor to shield renderer pipeline if target indices shift out-of-sync
  //if (activeStoryId !== null && !currentStory) {
  // return null; // Suppresses layout pipeline without rendering unhandled stack trace errors
  //}

  // ==========================================
  // SCREEN RENDER (RETURN)
  // ==========================================

  return (
    <div>
      <h1>Stories App</h1>

      {/* Horizontal horizontal list layer block with uploaded asset receivers  */}
      <StoriesBar
        onSelectStory={setActiveStoryId}
        stories={stories}
        onUploadStory={handleFilePicked}
      />

      {/* Conditional Rendering modal viewport context activation overlay */}
      {currentStory && (
        <StoryModal
          currentStory={currentStory}
          stories={stories}
          onClose={() => setActiveStoryId(null)}
          onNext={handleNextStory}
          onPrev={handlePrevStory}
        />
      )}

      {tempImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
            color: "#fff",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              color: "#333",
              padding: "25px",
              borderRadius: "12px",
              width: "350px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            <h2
              style={{ marginTop: 0, fontSize: "18px", marginBottom: "15px" }}
            >
              Create Your Story{" "}
            </h2>

            {/* Live Preview Box */}
            <img
              src={tempImage}
              alt="Preview"
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "15px",
                border: "2px solid #add",
              }}
            />

            {/* Name Input field */}
            <input
              type="text"
              placeholder="Enter your name..."
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1x solid #ccc",
                fontSize: "14px",
                marginBottom: "15px",
              }}
            />

            {/* Avatar Dropdown */}
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <label style={{ fontSize: "14px", color: "#666" }}>
                Select Profile Avatar
              </label>
              <select
                value={selectedAvatar}
                onChange={(e) => setSelectedAvatar(e.target.value)}
                style={{
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                <option value="1">Avatar 1 (Female)</option>
                <option value="7">Avatar 2 (Male)</option>
                <option value="12">Avatar 3 (Cool)</option>
                <option value="60">Avatar 4 (Tech)</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "10px", width: "100%" }}>
              <button
                onClick={() => setTempImage(null)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  backgroundColor: "#eee",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Cancel
              </button>

              <button
                onClick={handlePublishStory}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#0095f6",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Publish Story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/*const handleUploadStory = (base64String: string) => {
    const newStory: StoryType = {
      id: Date.now(),
      name: "You",
      avatar: "",
      image: base64String,
      createdAt: Date.now(),
    };
    setStories((prevStories) => [newStory, ...prevStories]);
  };*/
