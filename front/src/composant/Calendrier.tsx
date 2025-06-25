import React, { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: Date;
  description?: string;
  color: "blue" | "green" | "red" | "purple" | "orange";
}

interface CalendarProps {
  events?: Event[];
  onDateSelect?: (date: Date) => void;
  defaultMonth?: Date;
  selectedDate?: Date | null;
}

const Calendar: React.FC<CalendarProps> = ({ events = [], onDateSelect, defaultMonth, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(defaultMonth || new Date());
  const today = new Date();

  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  const weekDays = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: Date[] = [];
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      days.push(new Date(date));
    }

    return days;
  };

  const getEventsForDate = (date: Date): Event[] => {
    return events.filter((event) => event.date.toDateString() === date.toDateString());
  };

  const isToday = (date: Date): boolean => {
    return today.toDateString() === date.toDateString();
  };

  const isSelected = (date: Date): boolean => {
    return selectedDate ? selectedDate.toDateString() === date.toDateString() : false;
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const navigateMonth = (direction: "prev" | "next"): void => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentMonth(newMonth);
  };

  const getColorClasses = (color: string): string => {
    const colorMap = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      red: "bg-red-500",
      purple: "bg-purple-500",
      orange: "bg-orange-500",
    };
    return colorMap[color as keyof typeof colorMap] || "bg-gray-500";
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigateMonth("prev")} className="p-2 hover:bg-gray-100 rounded-md transition-colors" type="button">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <button onClick={() => navigateMonth("next")} className="p-2 hover:bg-gray-100 rounded-md transition-colors" type="button">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-xs font-medium text-gray-500 text-center p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const dayEvents = getEventsForDate(date);
          const isTodayDate = isToday(date);
          const isSelectedDate = isSelected(date);
          const isOtherMonth = !isCurrentMonth(date);

          return (
            <div
              key={index}
              className={`
                p-2 min-h-[60px] rounded-md transition-colors cursor-pointer relative
                ${isOtherMonth ? "text-gray-400 hover:bg-gray-50" : "text-gray-900 hover:bg-gray-100"}
                ${isTodayDate ? "bg-blue-100 border-2 border-blue-500" : "border border-transparent"}
                ${isSelectedDate && !isTodayDate ? "bg-blue-50 border-2 border-blue-300" : ""}
              `}
              onClick={() => onDateSelect?.(date)}
            >
              <div className="flex flex-col h-full">
                <span className={`text-sm font-medium ${isTodayDate ? "text-blue-700" : isSelectedDate ? "text-blue-600" : ""}`}>{date.getDate()}</span>

                {/* Event indicators */}
                {dayEvents.length > 0 && (
                  <div className="flex flex-col gap-1 mt-1 flex-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div key={event.id} className={`h-1 rounded-full ${getColorClasses(event.color)}`} title={event.title} />
                    ))}
                    {dayEvents.length > 2 && <div className="text-xs text-gray-500 text-center">+{dayEvents.length - 2}</div>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Exemple d'utilisation avec données de test
export default function CalendarExample() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isClosing, setIsClosing] = useState<boolean>(false);

  // Données d'exemple pour tester le calendrier
  const sampleEvents: Event[] = [
    {
      id: "1",
      title: "Réunion équipe",
      date: new Date(2025, 5, 23), // 23 juin 2025
      description: "Réunion hebdomadaire de l'équipe développement",
      color: "blue",
    },
    {
      id: "2",
      title: "Présentation client",
      date: new Date(2025, 5, 25), // 25 juin 2025
      description: "Présentation du projet aux clients",
      color: "red",
    },
    {
      id: "3",
      title: "Formation React",
      date: new Date(2025, 5, 22), // 22 juin 2025
      description: "Session de formation sur React et TypeScript",
      color: "green",
    },
    {
      id: "4",
      title: "Démo produit",
      date: new Date(2025, 5, 28), // 28 juin 2025
      description: "Démonstration du nouveau produit",
      color: "purple",
    },
    {
      id: "5",
      title: "Rendez-vous médecin",
      date: new Date(), // Aujourd'hui
      description: "Consultation de routine",
      color: "orange",
    },
  ];

  const handleDateSelect = (date: Date): void => {
    setSelectedDate(date);
    setIsClosing(false);
    console.log("Date sélectionnée:", date);
  };

  const closePopup = (): void => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedDate(null);
      setIsClosing(false);
    }, 300); // Durée de l'animation de fermeture
  };

  const getEventsForSelectedDate = (): Event[] => {
    if (!selectedDate) return [];
    return sampleEvents.filter((event) => event.date.toDateString() === selectedDate.toDateString());
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getColorBadgeClasses = (color: string): string => {
    const colorMap = {
      blue: "bg-blue-100 text-blue-800",
      green: "bg-green-100 text-green-800",
      red: "bg-red-100 text-red-800",
      purple: "bg-purple-100 text-purple-800",
      orange: "bg-orange-100 text-orange-800",
    };
    return colorMap[color as keyof typeof colorMap] || "bg-gray-100 text-gray-800";
  };

  const handleBackdropClick = (e: React.MouseEvent): void => {
    // Fermer seulement si on clique sur l'arrière-plan, pas sur la popup elle-même
    if (e.target === e.currentTarget) {
      closePopup();
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes slideDown {
            from { transform: translateY(0); opacity: 1; }
            to { transform: translateY(20px); opacity: 0; }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
          .animate-fadeOut {
            animation: fadeOut 0.3s ease-out;
          }
          .animate-slideUp {
            animation: slideUp 0.3s ease-out;
          }
          .animate-slideDown {
            animation: slideDown 0.3s ease-out;
          }
        `,
        }}
      />

      <Calendar events={sampleEvents} onDateSelect={handleDateSelect} selectedDate={selectedDate} defaultMonth={new Date(2025, 5)} />

      <div className="mt-4 text-center text-sm text-gray-600 space-y-1">
        <p>• Le jour actuel est surligné en bleu</p>
        <p>• Les barres colorées indiquent des événements</p>
        <p>• Cliquez sur une date pour voir les détails</p>
      </div>

      {/* Popup modale pour les détails des événements */}
      {selectedDate && (
        <div className={`fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm cursor-pointer ${isClosing ? "animate-fadeOut" : "animate-fadeIn"}`} onClick={handleBackdropClick}>
          <div className={`bg-white rounded-xl shadow-2xl max-w-md w-full max-h-96 overflow-y-auto border border-gray-100 cursor-default ${isClosing ? "animate-slideDown" : "animate-slideUp"}`} onClick={(e) => e.stopPropagation()}>
            {/* Header de la popup */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <h3 className="text-lg font-semibold text-gray-800">{formatDate(selectedDate)}</h3>
              <button onClick={closePopup} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 hover:rotate-90" type="button">
                ×
              </button>
            </div>

            {/* Contenu de la popup */}
            <div className="p-5">
              {getEventsForSelectedDate().length > 0 ? (
                <div className="space-y-4">
                  {getEventsForSelectedDate().map((event, index) => (
                    <div
                      key={event.id}
                      className="border-l-4 border-gray-300 pl-4 py-3 bg-gradient-to-r from-gray-50 to-white rounded-r-lg transition-all duration-200 hover:shadow-md hover:scale-102 opacity-0"
                      style={{
                        borderLeftColor: `var(--${event.color}-500)`,
                        animation: `slideUp 0.4s ease-out ${index * 0.1}s forwards`,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getColorBadgeClasses(event.color)} transition-all duration-200 hover:scale-105 shadow-sm`}>{event.title}</span>
                      </div>
                      {event.description && <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-3 animate-bounce">📅</div>
                  <p className="text-gray-500 mb-4">Aucun événement prévu ce jour</p>
                  <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl active:scale-95" onClick={() => console.log("Ajouter un événement pour", selectedDate)}>
                    + Ajouter un événement
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
