// import React, { useEffect, useState } from 'react'
// import axios from 'axios';

// function HeartBeat() {
//   const [moods, setMoods] = useState<string[]>();

//   useEffect(() => {
//     const fetchMood = async () => {
//       try {
//         const res = await axios.get('http://127.0.0.1:5000');
//         console.log(res.data.predictions)
//         setMoods(res.data.predictions);
//       } catch (err) {
//         console.error(err)
//       }
//     }
//     fetchMood();
//   }, [])
//   return (
//     <>
//       {/* bg-[url(../../public/bg-cat.gif)] */}
//       <div className="h-auto md:h-screen bg-white bg-cover bg-center">
//         <div className='md:fixed top-0 h-12 w-full p-3 bg-black z-50'>
//           <h1 className='font-bold text-white text-2xl mx-5'>Pet's Health</h1>

//         </div>
//         <div className='p-5 pt-16 px-7'>
//           {/* heartbeat  */}
//           <div className='grid grid-cols-3'>
//             <h1 className='col-span-12 text-3xl font-bold mb-4'>Heart Beat</h1>
//             <div className='col-span-3 md:col-span-1'>
//               <div className='p-2 pb-50 border border-black rounded-lg'>
//                 {moods?.map((mood, index) => (
//                   <div key={index}>
//                     <div>{mood}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//           <hr className='mt-5 mb-2' />
//           {/* temp  */}
//           <div className='grid grid-cols-5 mt-3'>
//             <div className='col-span-5 md:col-span-2'>
//               <h1 className='text-3xl font-bold mb-4'>Temperature</h1>
//               <div className='col-span-5 md:col-span-1'>
//                 <div className='p-2 pb-50 border border-black rounded-lg'>

//                 </div>
//               </div>
//             </div>
//             {/* avg temp  */}
//             <div className='col-span-5 mt-3 md:col-span-2 md:mx-5 md:mt-0'>
//               <h1 className='text-3xl font-bold mb-4'>Average Temperature</h1>
//               <div className='col-span-5 md:col-span-1'>
//                 <div className='p-2 pb-50 border border-black rounded-lg'>

//                 </div>
//               </div>
//             </div>
//           </div>
//           <hr className='mt-5 mb-2' />
//           <div className='grid grid-cols-3'>
//             <h1 className='col-span-3 text-3xl font-bold mb-4'>Movement</h1>
//             <div className='px-2'>
//               <h1>Average 5/minute</h1>
//               <h1>Status Waking Up</h1>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>

//   )
// }

// export default HeartBeat;
