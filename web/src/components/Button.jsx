import { IoMail } from "react-icons/io5";
import { useEffect, useState } from "react";

const Button = ({url}) => {
  const [href, setHref] = useState(url ? url : "");
  useEffect(() => {
    setHref(url ? url : "");
  }, [url]);
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-1 sm:py-2 px-4 sm:px-6 rounded-3xl inline-flex items-center text-xs sm:text-sm md:text-base hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 transition ease-in-out duration-150">
        <IoMail className="mr-2 text-lg md:text-xl" />
        View Profile on Google Scholar
      </button>
    </a>
  )  
};

export default Button;
