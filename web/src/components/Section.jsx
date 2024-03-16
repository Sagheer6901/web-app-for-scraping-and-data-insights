import { GoDotFill } from "react-icons/go";
import Chart from "./Chart";
import Button from "./Button";
import Chat from "./Chat";
import { useEffect } from "react";

const Section = ({info, chatFunc, chat}) => {
  const articles =
    info && info.results && info.results.top_articles
      ? info.results.top_articles
      : ["Article 1", "Article 2", "Article 3", "Article 4", "Article 5"];

  const tags =
    info && info.results && info.results.interests
      ? info.results.interests
      : ["machine learning", "data science", "python", "javascript"];

  useEffect(() => {
    info && console.log(info, info.results);
  }, [info]);

  return (
    <div className="absolute top-[420px] flex-col left-[370px] w-[1000px] font-serif">
      <h1 className="text-4xl">Top Articles</h1>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row">
  <div className="flex-1">
    <ul>
      {articles.map((article, index) => (
        <li className="text-xl mt-2" key={index}>
          -  {article}
        </li>
      ))}
    </ul>
  </div>
  <div className="lg:flex-1 lg:ml-8"> {/* Adjust the margin-left as needed */}
    {/* Insert Chart Component Here */}
  </div>
</div>

      <div>
        <h1 className="text-4xl mt-16">Research Info</h1>
        <div className="tags-container flex flex-wrap mt-3 -translate-x-5">
          {tags.map((tag, index) => (
            <span
              className="text-sm rounded-full mx-2 px-3 bg-white p-1"
              key={index}
            >
              <GoDotFill className="inline-block" color="blue" /> {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="chart-container w-[500px] bg-white absolute top-0 -right-20 p-4 rounded-lg">
        <Chart info={info && info.cited_by_graph ? info.cited_by_graph : null } />
      </div>
      <div className="mt-20">
        <h1 className="text-4xl">Professor is best for?</h1>
        <p className="mt-2">
          {info && info.results && info.results.position
            ? info.results.position
            : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
        </p>
      </div>
      <div className="mt-20 flex justify-center">
        <Button url={info && info.google_scholar_url ? info.google_scholar_url : null } />
      </div>
      <div>
        <Chat authorId={info ? info.search_term : null } chatFunc={chatFunc} chat={chat} />
      </div>
    </div>
  );
};

export default Section;
