import { Route, Routes, useParams } from "react-router-dom";
import SearchBar from "../../components/Actions/searchBar/SearchBar";
import {
  useGetPostsByHashtagQuery,
  useGetTrendsQuery,
} from "../../services/api/postApi";
import PostCard from "../../components/Display/post/PostCard";
import { PostTypes } from "../../utils/types/post.types";
import TabList from "../../components/Base/tabList/TabList";
import { useEffect, useState } from "react";

const Explore = () => {
  const { data: { data: trends } = {}, isLoading, isError } = useGetTrendsQuery();
  const [ hashtagName, setHashtagName ] = useState<string>("");

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  if(!trends) return <div>No data</div>;

  const hashtags = trends.topHashtags;
  const mentions = trends.topMentions;

  
  return (
    <section>
      <SearchBar />
      <TabList
        links={[
          { name: "Tout", to: "/explore", end: true },
          { name: "Thèmes", to: "/explore/hashtags", end: false },
          { name: "Personnes", to: "/explore/people", end: false },
        ]}
      />
      <div
        className="background-blur"
        style={{
          width: "100%",
          height: "350px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Routes>
          <Route path="/" element={<>
            {hashtags ? <HashtagCard {...hashtags[0]} /> : <p>No data</p>}
            {mentions ? <MentionCard {...mentions[0]} /> : <p>No data</p>}
          </>} />
          <Route path="/hashtags" element={hashtags ? <HashtagCard {...hashtags[0]} /> : <p>No data</p>} />
          <Route path="/people" element={mentions ? <MentionCard {...mentions[0]} /> : <p>No data</p>}/>
          <Route path="/hashtags/:hashtag" element={<h2>{hashtagName}</h2>} />
        </Routes>
      </div>
      <Routes>
        <Route path="/" element={<ExploreAll />} />
        <Route path="/hashtags" element={<ExploreTopTags />} />
        <Route path="/people" element={<ExploreTopPeople />} />
        <Route path="/hashtags/:hashtag" element={<ExploreTags setHashtagName={setHashtagName} />} />
      </Routes>
    </section>
  );
};

export default Explore;

const HashtagCard = (hashtag: {
  hashtagId: string;
  count: number;
  hashtag: { name: string };
}) => {
  if (!hashtag.hashtagId) return <p>No hashtag</p>;
  return (
    <div>
      <h3>{hashtag?.hashtag?.name}</h3>
      <p className="fs-15-500">{hashtag?.count} posts</p>
    </div>
  );
};

const MentionCard = (mention: {
  mentionedUserId: string;
  count: number;
  mentionedUser: { username: string };
}) => {
  if (!mention.mentionedUserId) return <p>No mention</p>;
  return (
    <div>
      <h3>{mention?.mentionedUser?.username}</h3>
      <p className="fs-15-500">{mention?.count} posts</p>
    </div>
  );
};

const ExploreAll = () => {
  const { data: { data: trends } = {} } = useGetTrendsQuery();
  const hashtags = trends?.topHashtags;
  const mentions = trends?.topMentions;
  return (
    <div>
      <h2>Tendances pour vous</h2>
      <ul>
        {hashtags?.map((hashtag) => (
          <li key={hashtag.hashtagId}>
            <HashtagCard {...hashtag} />
          </li>
        ))}
      </ul>
      <h2>Personnes</h2>
      <ul>
        {mentions?.map((mention) => (
          <li key={mention.mentionedUserId}>
            <MentionCard {...mention} />
          </li>
        ))}
      </ul>
    </div>
  );
};


const ExploreTopTags = () => {
  const { data: { data: trends } = {} } = useGetTrendsQuery();
  const hashtags = trends?.topHashtags;
  return (
    <div>
      <h2>Explore Tags</h2>
      <ul>
        {hashtags?.map((hashtag) => (
          <li key={hashtag.hashtagId}>
            <HashtagCard {...hashtag} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const ExploreTopPeople = () => {
  const { data: { data: trends } = {} } = useGetTrendsQuery();
  const mentions = trends?.topMentions;
  return (
    <div>
      <h2>Explore People</h2>
      <ul>
        {mentions?.map((mention) => (
          <li key={mention.mentionedUserId}>
            <MentionCard {...mention} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const ExploreTags = ({ setHashtagName }: { setHashtagName: (hashtag: string) => void }) => {
  const hashtag = useParams<{ hashtag: string }>().hashtag;

  useEffect(() => {
    setHashtagName(hashtag || "");
  }, [hashtag]);

  const { data: { data: postsByHashtag } = {} } = useGetPostsByHashtagQuery(hashtag as string);
  
  return (
    <div>
      <ul>
        {postsByHashtag?.map((post: PostTypes) => (
          <li key={post.id}>
            <PostCard post={post} origin="post-page" />
          </li>
        ))}
      </ul>
    </div>
  );
};
