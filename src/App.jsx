// import Header from "./components/Header";
// import Hero from "./components/Hero";
// import WorkListing from "./components/WorkListing";

// const App = () => {
//   return (
//     <div className="min-h-screen bg-white">
//       <Header />
//       <Hero />
//       <WorkListing />
//     </div>
//   );
// };

// export default App;

import Header from "./components/Header";
import Hero from "./components/Hero";
import WorkListing from "./components/WorkListing";
// 1. Import your new component
import HowItWorks from "./components/HowItWorks"; 

const App = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <WorkListing />
      {/* 2. Place it here to appear after the Work Listings */}
      <HowItWorks /> 
    </div>
  );
};

export default App;
