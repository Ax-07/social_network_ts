import { useEffect, useState, type FunctionComponent } from "react";

interface DatePickerProps {
  selected: Date;
  onChange: (date: Date) => void;
}

const DatePicker: FunctionComponent<DatePickerProps> = ({
  selected,
  onChange,
}) => {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth()); // Mois courant (0 = janvier)
  const [day, setDay] = useState<number>(new Date().getDate());
  const [hour, setHour] = useState<number>(0);
  const [minute, setMinute] = useState<number>(0);
  const [isOpenCalendar, setIsOpenCalendar] = useState<boolean>(false);

  const years = Array.from(
    { length: 3 },
    (_, i) => i + new Date().getFullYear()
  );
  const monthsNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  const daysOfWeekNames = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];

  // Calcul du nombre de jours dans le mois sélectionné
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Jour de la semaine du premier jour du mois sélectionné
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Fonction pour obtenir le nom du jour de la semaine pour un jour donné
  const getDayWithWeekday = (day: number) => {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay(); // 0 = Dimanche, 1 = Lundi, etc.
    return `${daysOfWeekNames[dayOfWeek]} ${day}`;
  };

  // Gestion de la navigation dans le calendrier
  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  useEffect(() => {
    const newDate = new Date(year, month, day, hour, minute);
    onChange(newDate);
  }, [year, month, day, hour, minute]);

  return (
    <div className="datePicker">
      <div className="datePicker__wrapper">
        {isOpenCalendar && (
          <div className="calendar">
            <button onClick={()=> setIsOpenCalendar(false)} className="modal-close">❌</button>
            <div className="calendar__header">
              <span onClick={handlePrevMonth}>{"<"}</span>
              <h3>
                {monthsNames[month]} {year}
              </h3>
              <span onClick={handleNextMonth}>{">"}</span>
            </div>
            <table className="calendar__table">
              <thead>
                <tr>
                  {daysOfWeekNames.map((dayName, index) => (
                    <th key={index}>{dayName.slice(0, 3)}</th> // Abréviation des jours
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Génération des lignes du calendrier */}
                {Array.from({ length: 6 }, (_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }, (_, j) => {
                      const dayNumber = i * 7 + j - firstDayOfMonth + 1;
                      const isCurrentMonth =
                        dayNumber > 0 && dayNumber <= daysInMonth;
                      const isCurrentDay = isCurrentMonth && dayNumber === day;

                      return (
                        <td
                          key={j}
                          className={`${isCurrentDay ? "current-day" : ""} ${
                            !isCurrentMonth ? "not-current-month" : ""
                          }`}
                          onClick={() => isCurrentMonth && setDay(dayNumber)}
                        >
                          {isCurrentMonth ? (
                            <span>{dayNumber}</span>
                          ) : (
                            <span></span> // Case vide pour les jours en dehors du mois
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p>Choisissez une date et une heure</p>
        <div className="timer__options">
          <div className="drop-menu">
            <p>Jours</p>
            <select
              className="drop-menu__select"
              name="jours"
              id="jours"
              onChange={(e) => setDay(parseInt(e.target.value))}
              value={day}
            >
              {Array.from({ length: daysInMonth }, (_, i) => (
                <option className="drop-menu__option" key={i} value={i + 1}>
                  {getDayWithWeekday(i + 1)}{" "}
                  {/* Affiche le jour de la semaine avec la date */}
                </option>
              ))}
            </select>
          </div>
          <div className="drop-menu">
            <p>Mois</p>
            <select
              className="drop-menu__select"
              name="mois"
              id="mois"
              onChange={(e) => setMonth(parseInt(e.target.value))}
              value={month}
            >
              {monthsNames.map((monthName, i) => (
                <option className="drop-menu__option" key={i} value={i}>
                  {monthName}
                </option>
              ))}
            </select>
          </div>
          <div className="drop-menu">
            <p>Années</p>
            <select
              className="drop-menu__select"
              name="années"
              id="années"
              onChange={(e) => setYear(parseInt(e.target.value))}
              value={year}
            >
              {years.map((yearOption, i) => (
                <option
                  className="drop-menu__option"
                  key={i}
                  value={yearOption}
                >
                  {yearOption}
                </option>
              ))}
            </select>
          </div>
          <img
            className="datePicker__btn-calendar"
            src={"/src/assets/icons/faCalendarAlt.svg"}
            alt=""
            onClick={() => setIsOpenCalendar(!isOpenCalendar)}
          />
        </div>
        <div className="timer__options">
          <div className="drop-menu">
            <p>Heures</p>
            <select
              className="drop-menu__select"
              name="heures"
              id="heures"
              onChange={(e) => setHour(parseInt(e.target.value))}
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option className="drop-menu__option" key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
          <div className="drop-menu">
            <p>Minutes</p>
            <select
              className="drop-menu__select"
              name="minutes"
              id="minutes"
              onChange={(e) => setMinute(parseInt(e.target.value))}
            >
              {Array.from({ length: 60 }, (_, i) => (
                <option className="drop-menu__option" key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
