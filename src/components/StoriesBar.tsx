import {useState} from 'react';
import StoryItem from "./StoryItem";


/*
 * StoriesBar
 * Displays a horizontal list of story previews.
 * Manages the stories data and renders each StoryItem.
 */


// TODO:
// Move this interface to a shared types.ts file.
// It will be reused by multiple components and helps avoid duplication.




interface StoryType {
        id: number;
        name: string; 
        image: string;
    }


export default function StoriesBar() {

    // Holds the list of available stories
    const [stories, setStories] = useState<StoryType[]>([
        { id: 1, name: "Ali", image: "https://i.pravatar.cc/100?img=1" },
        { id: 2, name: "Zain", image: "https://i.pravatar.cc/100?img=3" },
        { id: 3, name: "Sara", image: "https://i.pravatar.cc/100?img=2"}
    ]);


    // Renders a single story item
    function renderStory( story: StoryType) {

        return(
            <StoryItem key={story.id} 
            story = {story}
            onStoryClick = {handleStoryClick}
            />
        );
    }

    function handleStoryClick(id: number){
        console.log("Story with id # ", id, " has been clicked");
    }

    return(

        // Horizontal scrollable container for story items
        <div
        // A flex container with spacing (gap) and padding
        style={{
            border: "1px solid red",
            display: "flex",
            gap: "12px",
            padding: "12px",
            overflowX: "auto",
            scrollBehavior:"smooth",
            }}
            >

            { stories.map(renderStory) }
        </div>
    )
}