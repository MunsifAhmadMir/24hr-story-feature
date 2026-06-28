

/*
 * StoryItem
 * Displays a single story preview with a circular image and username.
*/


// TODO:
// Move shared interfaces to a common types.ts file.
// This prevents duplicate type definitions across components.


interface StoryType {
        id: number;
        name: string;
        image: string;
}



// Props received by the StoryItem component
interface StoryItemProps {
    story: StoryType;
    onStoryClick: (id: number) => void;
}


export default function StoryItem( {story, onStoryClick}: StoryItemProps ) {


    return(

        <div
        onClick = {function() {
            onStoryClick(story.id);
        }}
        // Each story as a vertical card (image top, name bottom, centered)
                                    // OR
        // / Vertical layout for a single story
        style={{
            border: "1px solid blue",
            padding: "5px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}

        >


            <img
            src={story.image}
            alt={story.name}
            // Sets circle size, border, and padding for the avatar (i.e. Circular avatar styling)
            style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                border: "1px solid red",
                padding: "2px",
            }}
            />


            <p
            // Displays the user's name
            style={{
                fontSize:"12px",
                marginTop:"6px",
                color:"#555",
            }}
            >
                {story.name} </p>
        </div>
    );
}