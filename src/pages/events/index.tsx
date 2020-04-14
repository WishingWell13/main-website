import React from 'react'

import {EventsArray, EventObject, getAllEvents} from '../../api/EventsAPI';

import './style.less';

export type EventTime = {
  days: JSX.Element,
  times: string
}

const Events: React.FC = () => {
  const [events, setEvents] = React.useState<EventsArray>();

  React.useEffect(() => {
    if (!events) {
      updateEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateEvents = async () => {
    const eventsArray: EventsArray | undefined = await getAllEvents();
    if (eventsArray === undefined) {
      setEvents(new Array<EventObject>());
    }
    setEvents(eventsArray?.slice(0,5));
    console.log(eventsArray?.slice(0,5));
  }

  const parseDate = (value: EventObject) : EventTime => {
    const minutes = (n: number): string => {
      return n > 9 ? "" + n: "0" + n;
    }
    const months = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];
    const aMpM = ["am", "pm"];
    const hoursInHalfDay = 12;
    let startDate = new Date(value.start);
    let endDate = new Date(value.end);
    let days: JSX.Element;
    if (startDate.getDay() !== endDate.getDay()) {
      days = (
        <h2>
          <b className="month">{months[startDate.getMonth()] + ' '}</b>
          {startDate.getDate() + ' - '}
          <b className="month">{months[endDate.getMonth()] + ' '}</b>
          {endDate.getDate()}
        </h2>
      )
    } else {
      days = (
        <h2>
          <b className="month">{months[startDate.getMonth()] + ' '}</b>
          {startDate.getDate()}
        </h2>
      )
    }
    let times = (startDate.getHours() % hoursInHalfDay) + ':' +
      minutes(startDate.getMinutes()) + aMpM[Math.floor(startDate.getHours() / hoursInHalfDay)]
      + ' - ' + (endDate.getHours() % hoursInHalfDay) + ':' +
      minutes(endDate.getMinutes()) + aMpM[Math.floor(endDate.getHours() / hoursInHalfDay)];
    return { days, times };
  }

  return (
    <div className="events-page">
      <div className="events-header">
        <h1>Events</h1>
        <p>ACM hosts a wide range of events to provide for the unique array of talent and interests of student members.</p>
      </div>
      <div className="events">
        {events && events.map((value, index) => {
          const date = parseDate(value);
          return (<div className="event" key={index}>
            {date.days}
            <h1 className={"index" + (index % 5)}>{value.title}</h1>
            <h3>{value.location}</h3>
            <h3>{date.times}</h3>
          </div>
          )}
        )}
      </div>
    </div>
  );
}

export default Events;