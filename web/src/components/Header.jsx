import { useEffect, useState } from "react";

const Header = ({info}) => {
  const [author, setAuthor] = useState("Author");
  const [institute, setInstitute] = useState("Institute");
  const [description, setDescription] =
    useState(`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
  tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor
  sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
  ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur
  adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
  magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit,
  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`);

  useEffect(() => {
    if (info && info && info.results) {
      setAuthor(info.results.name);
      setDescription(info.results.summary);
    }
  }, [info]);

  return (
    <div className="absolute top-40 flex-col left-[370px] w-[1000px] font-serif p-4">
  <h1 className="text-xl sm:text-3xl mb-2">{author}</h1>
  <p className="text-sm sm:text-base">{description}</p>
</div>
  )
};

export default Header;
