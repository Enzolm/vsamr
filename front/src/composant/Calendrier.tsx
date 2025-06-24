import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: Date;
  description?: string;
  color: 'blue' | 'green' | 'red' | 'purple' | 'orange';
}

interface CalendarProps {
  events?: Event[];
  onDateSelect?: (date: Date) => void;
  defaultMonth?: Date;
}

const Calendar: React.FC<CalendarProps> = ({ 
  events = [], 
  onDateSelect,
  defaultMonth 
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(defaultMonth || new Date());
  const today = new Date();

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

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
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const isToday = (date: Date): boolean => {
    return today.toDateString() === date.toDateString();
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const navigateMonth = (direction: 'prev' | 'next'): void => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newMonth);
  };

  const getColorClasses = (color: string): string => {
    const colorMap = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      red: 'bg-red-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-500';
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          type="button"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          type="button"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
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
          const isOtherMonth = !isCurrentMonth(date);
          
          return (
            <div
              key={index}
              className={`
                p-2 min-h-[60px] rounded-md transition-colors cursor-pointer relative
                ${isOtherMonth 
                  ? 'text-gray-400 hover:bg-gray-50' 
                  : 'text-gray-900 hover:bg-gray-100'
                }
                ${isTodayDate 
                  ? 'bg-blue-100 border-2 border-blue-500' 
                  : 'border border-transparent'
                }
              `}
              onClick={() => onDateSelect?.(date)}
            >
              <div className="flex flex-col h-full">
                <span className={`text-sm font-medium ${isTodayDate ? 'text-blue-700' : ''}`}>
                  {date.getDate()}
                </span>
                
                {/* Event indicators */}
                {dayEvents.length > 0 && (
                  <div className="flex flex-col gap-1 mt-1 flex-1">
                    {dayEvents.slice(0, 2).map((event, eventIndex) => (
                      <div
                        key={event.id}
                        className={`h-1 rounded-full ${getColorClasses(event.color)}`}
                        title={event.title}
                      />
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayEvents.length - 2}
                      </div>
                    )}
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
  // Données d'exemple pour tester le calendrier
  const sampleEvents: Event[] = [
    {
      id: '1',
      title: 'Réunion équipe',
      date: new Date(2025, 5, 23), // 23 juin 2025
      description: 'Réunion hebdomadaire de l\'équipe développement',
      color: 'blue'
    },
    {
      id: '2',
      title: 'Présentation client',
      date: new Date(2025, 5, 25), // 25 juin 2025
      description: 'Présentation du projet aux clients',
      color: 'red'
    },
    {
      id: '3',
      title: 'Formation React',
      date: new Date(2025, 5, 22), // 22 juin 2025
      description: 'Session de formation sur React et TypeScript',
      color: 'green'
    },
    {
      id: '4',
      title: 'Démo produit',
      date: new Date(2025, 5, 28), // 28 juin 2025
      description: 'Démonstration du nouveau produit',
      color: 'purple'
    }
  ];

  const handleDateSelect = (date: Date): void => {
    console.log('Date sélectionnée:', date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Calendrier
        </h1>
        
        <Calendar 
          events={sampleEvents}
          onDateSelect={handleDateSelect}
          defaultMonth={new Date(2025, 5)} // Juin 2025
        />
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>• Le jour actuel est surligné en bleu</p>
          <p>• Les barres colorées indiquent des événements</p>
          <p>• Cliquez sur une date pour la sélectionner</p>
        </div>
      </div>
    </div>
  );
}