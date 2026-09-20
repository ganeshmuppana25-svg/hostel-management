import React, { useState } from 'react';
import { Check, Utensils } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

interface SuggestDishModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuggestDishModal: React.FC<SuggestDishModalProps> = ({ isOpen, onClose }) => {
  const { suggestDish } = useData();
  const { showToast } = useToast();

  const [dishName, setDishName] = useState('');
  const [mealType, setMealType] = useState('Dinner');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const mealOptions = [
    { label: 'Breakfast', value: 'Breakfast' },
    { label: 'Lunch', value: 'Lunch' },
    { label: 'Evening Snacks', value: 'Snacks' },
    { label: 'Dinner', value: 'Dinner' },
    { label: 'Sunday Special Feast', value: 'Special Feast' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName.trim()) {
      setError('Please provide dish name');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      suggestDish({
        dishName: dishName.trim(),
        mealType,
        description: description.trim(),
      });

      setIsSubmitting(false);
      showToast(
        `"${dishName}" added to the Mess Committee review board! Other hostellers can now upvote it.`,
        'success',
        'Suggestion Submitted'
      );
      setDishName('');
      setDescription('');
      setError('');
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Suggest a Menu Item"
      subtitle="Submit dishes you want the hostel mess committee to include in the rotational menu"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Dish / Item Name"
          placeholder="e.g. Masala Dosa with Podi & Ghee"
          value={dishName}
          onChange={(e) => {
            setDishName(e.target.value);
            if (error) setError('');
          }}
          leftIcon={<Utensils className="w-4 h-4" />}
          error={error}
          required
        />

        <Select
          label="Meal Category"
          options={mealOptions}
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Why would students love this? (Optional)
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Good high-protein option for evening workout snack, popular demand during weekend dinners..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-sm rounded-xl p-3 bg-white dark:bg-[#0e1626] text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700/80 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            leftIcon={<Check className="w-4 h-4" />}
          >
            Submit Suggestion
          </Button>
        </div>
      </form>
    </Modal>
  );
};
