import React from 'react';
import { NavLink } from 'react-router-dom';
import { Utensils, Star, Clock, ArrowRight, Flame } from 'lucide-react';
import { Card } from '../common/Card';
import { useData } from '../../context/DataContext';

export const MessTodayWidget: React.FC = () => {
  const { todayMeals } = useData();

  // Determine current active meal based on time
  const currentHour = new Date().getHours();
  let currentMealName: 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner' = 'Dinner';
  if (currentHour < 10) currentMealName = 'Breakfast';
  else if (currentHour < 15) currentMealName = 'Lunch';
  else if (currentHour < 18) currentMealName = 'Snacks';
  else currentMealName = 'Dinner';

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Today's Mess Highlights
              </h3>
              <p className="text-xs text-slate-400">Central Student Dining Hall</p>
            </div>
          </div>
          <NavLink
            to="/mess"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            Full Menu <ArrowRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>

        {/* 4 meals overview */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {todayMeals.map((meal) => {
            const isCurrent = meal.name === currentMealName;

            return (
              <div
                key={meal.id}
                className={`p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? 'border-emerald-400 dark:border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-white">
                      {meal.name}
                    </span>
                    {isCurrent && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500 text-white animate-pulse">
                        Now
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-xs font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" />
                    {meal.currentRating}
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-2">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{meal.timing}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-medium">
                  {meal.items.slice(0, 3).join(', ')}
                  {meal.items.length > 3 ? '...' : ''}
                </p>

                <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                  <span className={meal.isVeg ? 'text-emerald-600' : 'text-amber-600'}>
                    {meal.isVeg ? '● Pure Veg' : '● Special Non-Veg / Veg'}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Flame className="w-3 h-3 text-orange-400" /> {meal.calories}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
