import type { FunctionComponent } from 'react';

interface eventsCardProps {
  event: {
    title: string;
    description: string;
    startDate: string;
    location: string;
    media: string | null;
  };
}

const EventsCard: FunctionComponent<eventsCardProps> = ({event}) => {
  return (
    <div className='eventsCard'>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p>{event.startDate}</p>
      <p>{event.location}</p>
      {event.media && <img src={event.media} alt='event'/>}
    </div>
  );
};

export default EventsCard;