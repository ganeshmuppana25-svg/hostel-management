import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Upload, X, Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { ComplaintCategory, ComplaintPriority } from '../../types';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

interface RequestMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestMaintenanceModal: React.FC<RequestMaintenanceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addComplaint, profile } = useData();
  const { showToast } = useToast();

  const [category, setCategory] = useState<ComplaintCategory>('Fan / AC');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<ComplaintPriority>('High');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const categoryOptions = [
    { label: 'Fan / AC', value: 'Fan / AC' },
    { label: 'Electrical', value: 'Electrical' },
    { label: 'Plumbing', value: 'Plumbing' },
    { label: 'Wi-Fi & Network', value: 'Wi-Fi' },
    { label: 'Furniture / Carpentry', value: 'Furniture' },
    { label: 'Housekeeping & Cleaning', value: 'Cleaning' },
    { label: 'Other', value: 'Other' },
  ];

  const priorityOptions = [
    { label: 'Low (Within 48 hours)', value: 'Low' },
    { label: 'Medium (Within 24 hours)', value: 'Medium' },
    { label: 'High (Same day priority)', value: 'High' },
    { label: 'Urgent (Immediate attention)', value: 'Urgent' },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; description?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Please enter a summary of the issue';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Title should be at least 5 characters';
    }

    if (!description.trim()) {
      newErrors.description = 'Please describe the problem in detail';
    } else if (description.trim().length < 8) {
      newErrors.description = 'Description should be at least 8 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const created = addComplaint({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        imageUrl: imagePreview || undefined,
      });

      setIsSubmitting(false);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {}

      showToast(
        `Ticket ${created.id} created successfully. Assigned to facility maintenance.`,
        'success',
        'Request Logged'
      );

      // Reset form
      setTitle('');
      setDescription('');
      setImagePreview(null);
      setErrors({});
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Report Maintenance Issue"
      subtitle="Submit an issue for technician inspection and repair"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category"
            options={categoryOptions}
            value={category}
            onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
            required
          />

          <Select
            label="Priority Level"
            options={priorityOptions}
            value={priority}
            onChange={(e) => setPriority(e.target.value as ComplaintPriority)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Room Number"
            value={profile.roomNumber || 'B-204'}
            disabled
            helperText="Auto-assigned to your resident room"
          />

          <Input
            label="Hostel Block"
            value={`${profile.block} • ${profile.floor}`}
            disabled
          />
        </div>

        <Input
          label="Issue Title"
          placeholder="e.g. Ceiling fan speed regulator loose & making clicking noise"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors({ ...errors, title: undefined });
          }}
          error={errors.title}
          required
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Detailed Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="Explain when this happens, which corner of the room, or any safety hazards..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors({ ...errors, description: undefined });
            }}
            className={`w-full text-sm rounded-xl p-3 bg-white dark:bg-[#0e1626] text-slate-900 dark:text-white border ${
              errors.description
                ? 'border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-300 dark:border-slate-700/80 focus:ring-indigo-500/20 focus:border-indigo-600'
            } outline-none focus:ring-4 placeholder:text-slate-400`}
            required
          />
          {errors.description && (
            <p className="mt-1 text-xs text-rose-500 font-medium">{errors.description}</p>
          )}
        </div>

        {/* Optional Image Upload UI */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Attach Photo (Optional)
          </label>
          {imagePreview ? (
            <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-48 w-full group">
              <img
                src={imagePreview}
                alt="Issue preview"
                className="w-full h-44 object-cover"
              />
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-rose-600 text-white rounded-lg transition-colors"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50/20 transition-all text-center">
              <Upload className="w-6 h-6 text-slate-400 mb-1" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Click to upload issue photo
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                PNG, JPG or WEBP (Max 5MB)
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Action Buttons */}
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
            Submit Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};
