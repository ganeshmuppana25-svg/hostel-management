import React, { useState } from 'react';
import { Check, Clock, ShieldCheck } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

interface RequestVisitorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestVisitorModal: React.FC<RequestVisitorModalProps> = ({ isOpen, onClose }) => {
  const { requestVisitorPass } = useData();
  const { showToast } = useToast();

  const todayStr = new Date().toISOString().split('T')[0];

  const [visitorName, setVisitorName] = useState('');
  const [relation, setRelation] = useState('Parent');
  const [purpose, setPurpose] = useState('');
  const [visitDate, setVisitDate] = useState(todayStr);
  const [visitTime, setVisitTime] = useState('04:30 PM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const relationOptions = [
    { label: 'Parent / Guardian', value: 'Parent' },
    { label: 'Sibling (Brother / Sister)', value: 'Sibling' },
    { label: 'Relative', value: 'Relative' },
    { label: 'Friend / Classmate', value: 'Friend' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!visitorName.trim()) {
      newErrors.visitorName = 'Please enter visitor name';
    }
    if (!purpose.trim()) {
      newErrors.purpose = 'Please specify the purpose of visit';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const pass = requestVisitorPass({
        visitorName: visitorName.trim(),
        relation,
        purpose: purpose.trim(),
        visitDate,
        visitTime,
      });

      setIsSubmitting(false);
      showToast(
        `Visitor pass ${pass.passCode} issued for ${visitorName}. Valid at Main Gate security.`,
        'success',
        'Visitor Pass Created'
      );
      setVisitorName('');
      setPurpose('');
      setErrors({});
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Campus Visitor Pass"
      subtitle="Issue a digital entry authorization for visiting parents or relatives"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Visitor Full Name"
          placeholder="e.g. Venkatesh Kumar"
          value={visitorName}
          onChange={(e) => {
            setVisitorName(e.target.value);
            if (errors.visitorName) setErrors({ ...errors, visitorName: '' });
          }}
          error={errors.visitorName}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Relationship"
            options={relationOptions}
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
            required
          />

          <Input
            type="date"
            label="Date of Visit"
            min={todayStr}
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            required
          />
        </div>

        <Input
          label="Expected Arrival Time"
          placeholder="e.g. 04:30 PM"
          value={visitTime}
          onChange={(e) => setVisitTime(e.target.value)}
          leftIcon={<Clock className="w-4 h-4" />}
          required
        />

        <Input
          label="Purpose of Visit"
          placeholder="e.g. Delivering luggage, books and festival sweets"
          value={purpose}
          onChange={(e) => {
            setPurpose(e.target.value);
            if (errors.purpose) setErrors({ ...errors, purpose: '' });
          }}
          error={errors.purpose}
          required
        />

        <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-800 dark:text-indigo-300 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-indigo-600 dark:text-indigo-400" />
          <p>
            Visiting hours: <strong>04:00 PM – 07:30 PM</strong> on weekdays, <strong>10:00 AM – 08:00 PM</strong> on weekends. Visitors must carry a government photo ID.
          </p>
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
            Generate Visitor Pass
          </Button>
        </div>
      </form>
    </Modal>
  );
};
