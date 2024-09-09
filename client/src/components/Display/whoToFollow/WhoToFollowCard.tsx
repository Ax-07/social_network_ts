import type { FunctionComponent } from 'react';

interface WhoToFollowCardProps {
  name: string;
}

const WhoToFollowCard: FunctionComponent<WhoToFollowCardProps> = ({name}) => {
  return (
    <div>
      <h2>{name}</h2>
      
    </div>
  );
};

export default WhoToFollowCard;