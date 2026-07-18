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
  const handleUploadStory = (base64String: string) => {
    const newStory: StoryType = {
      id: Date.now(),
      name: "You",
      avatar: "",
      image: base64String,
      createdAt: Date.now(),
    };
    setStories((prevStories) => [newStory, ...prevStories]);
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
  if (activeStoryId !== null && !currentStory) {
    return null; // Suppresses layout pipeline without rendering unhandled stack trace errors
  }

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
        onUploadStory={handleUploadStory}
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

      {/* Test: Conditional Rendering: Only show the Story View modal/overlay 
      if an actual story ID is selected 
      {activeStoryId !== null && <div> Story Khul Gaye </div>}
      */}
    </div>
  );
}
