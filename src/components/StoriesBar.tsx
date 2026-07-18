import StoryItem from "./StoryItem";
import { useRef } from "react"; // <-- Create the Ref hook

/*
 * StoriesBar
 * Displays a horizontal list of story previews.
 * Manages the stories data and renders each StoryItem.
 */

// TODO:
// Move this interface to a shared types.ts file.
// It will be reused by multiple components and helps avoid duplication.

export interface StoryType {
  id: number;
  name: string;
  avatar: string;
  image: string;
}

interface StoriesBarProps {
  // Callback function triggered when a user selects a specific story badge/item
  onSelectStory: (id: number) => void;
  onUploadStory: (base64Image: string) => void;
  stories: StoryType[];
}
// ======================================================================================
// STORIES BAR COMPONENT
// Purpose: Displays a list of user stories with a custom "+" button to upload new media.
//
// Key Features:
// 1. Hidden File Input: Built-in HTML `<input type="file">` is hidden via CSS for aesthetic styling.
// 2. DOM Manipulation via Ref: `fileInputRef` triggers the hidden input's `.click()` method
//    programmatically when the styled custom "+" button is clicked.
// 3. Event Handling: `handleFileChange` catches the native browser change event once a file
//    is successfully selected by the user.
// ======================================================================================

// ======================================================================================
// 1. MAIN COMPONENT (Renders the horizontal list of user stories at the top of the feed)
// ======================================================================================

export default function StoriesBar({
  onSelectStory,
  onUploadStory,
  stories,
}: StoriesBarProps) {
  // ------------------------------------------
  // HOOKS & REFS (Always at the top level!)
  // ------------------------------------------
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ------------------------------------------
  // 1. STORY CLICK & RENDER LOGIC
  // ------------------------------------------
  // Click handler for individual story circles to log action and notify parent App component
  function handleStoryClick(id: number) {
    console.log("Story with id # ", id, " has been clicked");
    // Send the clicked story's ID back up to the parent component to open the modal
    onSelectStory(id);
  }

  // Renders a single story item
  function renderStory(story: StoryType) {
    return (
      <StoryItem key={story.id} story={story} onStoryClick={handleStoryClick} />
    );
  }

  // ------------------------------------------
  // 2. FILE UPLOAD LOGIC (FileReader)
  // ------------------------------------------
  function handlePlusClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      /**
       * CRITICAL ORDER RULE:
       * Always attach event listeners (onload / onerror) BEFORE triggering the read operation.
       * This prevents a race condition where small files finish scanning faster than JavaScript
       * can register the listeners, causing the callbacks to never fire.
       */

      // 1. SUCCESS CALLBACK: Fires only when the file is fully and successfully read
      reader.onload = () => {
        const base64String = reader.result as string;
        console.log("User nay file select ke hai: ", file.name);
        onUploadStory(base64String);
      };

      // 2. ERROR CALLBACK: Fallback safety if the browser fails to process the file
      reader.onerror = () => {
        console.error("Error! FileReader failed to process the chosen file.");
        alert("Could not read the file. Please try uploading another image.");
      };

      // 3. ACTION TRIGGER: Turn on the scanner machine to process the file asynchronously
      reader.readAsDataURL(file);
    }
  }

  // ====================================================================================
  // SCREEN RENDER (RETURN)
  // ====================================================================================

  return (
    // Horizontal scrollable container for story items
    <div
      // A flex container with spacing (gap) and padding
      style={{
        display: "flex",
        gap: "12px",
        padding: "12px",
        overflowX: "auto",
        scrollBehavior: "smooth",
      }}
    >
      {/* ---- NEW: PLUS BUTTON START ---- */}
      <div
        onClick={handlePlusClick}
        style={{
          padding: "5px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        {/* Hidden input element */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: "none" }}
        />

        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f0f0f0",
            border: "2px dashed #dbdbdb",
            fontSize: "24px",
            color: "#000000",
            fontWeight: "bold",
          }}
        >
          +
        </div>
        <p style={{ fontSize: "12px", marginTop: "6px", color: "#555" }}>
          Your Story
        </p>
      </div>

      {stories.map(renderStory)}
    </div>
  );
}
