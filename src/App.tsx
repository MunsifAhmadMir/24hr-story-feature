import StoriesBar from "./components/StoriesBar";

export default function App() {
  return(
    <div>
      <h1>Storie App</h1>

      <StoriesBar />
    </div>
  );
}












































// import {useState} from 'react';
// import Counter from './components/counter';

// export default function App() {
//   const [stories, setStories]= useState<string[]>([]);

//   function addStory() {
//     setStories([...stories, "New Story"]);
//   }

//   function renderStory(story: string, index: number) {
//         return(
//           <p key={index}>{story}</p>
//         );
//   }

//   return(
//     <div>
//       <h1>Stories App</h1>

//       <Counter />

//       <br />

//       <button onClick={addStory}>Add Story</button>

//       {stories.map(renderStory)}

//     </div>
//   );
// }





















// type MyButtonProps = {
//   count: number;
//   onClick: () => void;
// };

// export default function App() {
//   const [count, setCount] = useState(0);

//   function handleClick() {
//     setCount(count + 1);
//   }

//   return (
//     <div>
//       <h1>My first React App</h1>

//         <MyButton count={count} onClick={handleClick}/>
//         <br />
//         <MyButton count={count} onClick={handleClick}/>
//         <br />
        
//         <button>Normal Button</button>
//     </div>
//   );
// }




// function MyButton({ count, onClick}: MyButtonProps) {

// return (
//   <button onClick={onClick}>
//     Click {count} times
//   </button>
// );
// }






