import React from "react";

const TransactingOvelay = ({ text = "Transacting..." } = {}) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black opacity-80 flex flex-col items-center justify-center">
      <img
        src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmJyaDg4OG1yemp0YmI3eXNwb3Zyc2Y3aDR5ZGoyMnNxb3FscTU3NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/RODiNw1qKHct74LACe/giphy.webp"
        alt="Ethereum Logo"
        className="h-64 w-64"
      />
      <div className="text-white text-lg">{text}</div>
    </div>
  );
};

export default TransactingOvelay;
