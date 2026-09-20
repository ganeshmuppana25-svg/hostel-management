import React, { useState } from 'react';
import {
  Star,
  Clock,
  Flame,
  ThumbsUp,
  Plus,
  Check,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { SuggestDishModal } from '../components/modals/SuggestDishModal';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { MealInfo } from '../types';

export const MessPage: React.FC = () => {
  const { todayMeals, weeklyMenu, suggestions, rateMeal, voteSuggestion } = useData();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'today' | 'weekly' | 'suggestions'>('today');
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [suggestModalOpen, setSuggestModalOpen] = useState(false);

  // Rating modal state
  const [ratingModalMeal, setRatingModalMeal] = useState<MealInfo | null>(null);
  const [selectedStars, setSelectedStars] = useState<number>(5);
  const [ratingComment, setRatingComment] = useState('');

  const currentHour = new Date().getHours();
  let currentMealName: 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner' = 'Dinner';
  if (currentHour < 10) currentMealName = 'Breakfast';
  else if (currentHour < 15) currentMealName = 'Lunch';
  else if (currentHour < 18) currentMealName = 'Snacks';
  else currentMealName = 'Dinner';

  const handleRateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingModalMeal) return;

    rateMeal(ratingModalMeal.id, selectedStars);
    showToast(
      `Your ${selectedStars}-star rating for ${ratingModalMeal.name} recorded! Thank you for feedback.`,
      'success',
      'Meal Feedback Submitted'
    );
    setRatingModalMeal(null);
    setSelectedStars(5);
    setRatingComment('');
  };

  const handleVote = (id: string, name: string) => {
    voteSuggestion(id);
    showToast(`Updated your vote for "${name}".`, 'info');
  };

  const currentDayMenu = weeklyMenu.find((d) => d.day === selectedDay) || weeklyMenu[0];

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Mess Operations & Nutrition"
        subtitle="Daily dining schedule, weekly rotational menu, student meal ratings, and dish wishlist"
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setSuggestModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Suggest Dish
          </Button>
        }
      />

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('today')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'today'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Today's Menu & Ratings
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'weekly'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Weekly 7-Day Schedule
        </button>
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'suggestions'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Student Wishlist & Suggestions ({suggestions.length})
        </button>
      </div>

      {/* Tab 1: Today's Menu & Interactive Ratings */}
      {activeTab === 'today' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {todayMeals.map((meal) => {
              const isCurrent = meal.name === currentMealName;

              return (
                <Card
                  key={meal.id}
                  className={`relative overflow-hidden ${
                    isCurrent
                      ? 'ring-2 ring-emerald-500/40 border-emerald-300 dark:border-emerald-600'
                      : ''
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Active Serving
                    </div>
                  )}

                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {meal.name}
                        </h3>
                        <Badge variant={meal.isVeg ? 'success' : 'warning'} size="sm">
                          {meal.isVeg ? 'Vegetarian' : 'Veg + Non-Veg'}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {meal.timing}
                      </p>
                    </div>

                    {/* Star Rating Badge */}
                    <div className="flex flex-col items-end">
                      <div className="flex items-center text-sm font-bold text-amber-500">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                        {meal.currentRating} / 5
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {meal.totalRatings} student reviews
                      </span>
                    </div>
                  </div>

                  {/* Menu Items List */}
                  <div className="my-4 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Dishes & Courses
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                      {meal.items.map((item, i) => (
                        <li
                          key={i}
                          className="text-xs font-medium text-slate-700 dark:text-slate-200 flex items-start gap-2 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer with Calories & Submit Rating Button */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span>{meal.calories}</span>
                    </div>

                    <Button
                      variant={meal.userRating ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => setRatingModalMeal(meal)}
                      leftIcon={<Star className="w-3.5 h-3.5" />}
                    >
                      {meal.userRating ? `Rated ★ ${meal.userRating}` : 'Rate This Meal'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Weekly 7-Day Menu */}
      {activeTab === 'weekly' && (
        <div className="space-y-6">
          {/* Day selection pill bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {weeklyMenu.map((day) => (
              <button
                key={day.day}
                onClick={() => setSelectedDay(day.day)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedDay === day.day
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {day.day}
              </button>
            ))}
          </div>

          <Card>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {currentDayMenu.day} Rotational Menu
                </h3>
                <p className="text-xs text-slate-400">Standard hostel mess cyclic timetable</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                Weekly Cycle A
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Breakfast */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Breakfast
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {currentDayMenu.breakfast.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>

              {/* Lunch */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Lunch
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {currentDayMenu.lunch.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>

              {/* Snacks */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-500" /> Evening Snacks
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {currentDayMenu.snacks.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>

              {/* Dinner */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" /> Dinner
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {currentDayMenu.dinner.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: Suggest Menu Item / Student Wishlist */}
      {activeTab === 'suggestions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <p className="text-xs text-slate-500">
              Community voted dishes considered by the Student Mess Committee for the next monthly menu rotation.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setSuggestModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Suggest New Dish
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((sug) => (
              <Card key={sug.id} hoverEffect className="flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {sug.dishName}
                    </h4>
                    <Badge variant="purple" size="sm">
                      {sug.mealType}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {sug.description || 'Popular student dish proposal.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">By {sug.studentName}</span>

                  <button
                    onClick={() => handleVote(sug.id, sug.dishName)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold transition-all ${
                      sug.hasVoted
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{sug.votes} Votes</span>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Rate Meal Modal */}
      {ratingModalMeal && (
        <Modal
          isOpen={!!ratingModalMeal}
          onClose={() => setRatingModalMeal(null)}
          title={`Rate ${ratingModalMeal.name}`}
          subtitle="Your feedback is shared directly with the mess catering supervisor"
          maxWidth="sm"
        >
          <form onSubmit={handleRateSubmit} className="space-y-4">
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 mb-2">Tap stars to rate quality & taste</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setSelectedStars(star)}
                    className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= selectedStars
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2">
                {selectedStars === 5
                  ? '⭐⭐⭐⭐⭐ Outstanding'
                  : selectedStars === 4
                  ? '⭐⭐⭐⭐ Very Good'
                  : selectedStars === 3
                  ? '⭐⭐⭐ Average'
                  : selectedStars === 2
                  ? '⭐⭐ Needs Improvement'
                  : '⭐ Poor Quality'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Feedback / Comments (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Sambar was perfectly spiced, idlis were soft..."
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                className="w-full text-xs rounded-xl p-3 bg-white dark:bg-[#0e1626] text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setRatingModalMeal(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                leftIcon={<Check className="w-4 h-4" />}
              >
                Save Rating
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Suggest Dish Modal */}
      <SuggestDishModal
        isOpen={suggestModalOpen}
        onClose={() => setSuggestModalOpen(false)}
      />
    </div>
  );
};
