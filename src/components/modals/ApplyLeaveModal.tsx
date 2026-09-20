import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Check, MapPin, Phone } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { LeaveType } from '../../types';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({ isOpen, onClose }) => {
  const { applyLeave, profile } = useData();
  const { showToast } = useToast();

  const todayStr = new Date().toISOString().split('T')[0];

  const [fromDate, setFromDate] = useState(todayStr);
  const [toDate, setToDate] = useState(todayStr);
  const [leaveType, setLeaveType] = useState<LeaveType>('Home Visit');
  const [destination, setDestination] = useState('');
  const [reason, setReason] = useState('');
  const [emergencyContact, setEmergencyContact] = useState(
    profile.guardian?.phone || profile.emergencyContact?.phone || '+91 98450 11223'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const leaveTypeOptions = [
    { label: 'Home Visit', value: 'Home Visit' },
    { label: 'Family Function', value: 'Family Function' },
    { label: 'Medical Treatment / Appointment', value: 'Medical' },
    { label: 'Personal Work', value: 'Personal' },
    { label: 'Other', value: 'Other' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!fromDate) {
      newErrors.fromDate = 'Please select departure date';
    }
    if (!toDate) {
      newErrors.toDate = 'Please select return date';
    }
    if (fromDate && toDate && new Date(toDate) < new Date(fromDate)) {
      newErrors.toDate = 'Return date cannot be earlier than departure date';
    }

    if (!destination.trim()) {
      newErrors.destination = 'Please provide destination city or address';
    }

    if (!reason.trim()) {
      newErrors.reason = 'Please state the reason for leave';
    } else if (reason.trim().length < 8) {
      newErrors.reason = 'Reason should be more descriptive (at least 8 characters)';
    }

    if (!emergencyContact.trim()) {
      newErrors.emergencyContact = 'Parent or emergency contact phone is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const created = applyLeave({
        fromDate,
        toDate,
        leaveType,
        destination: destination.trim(),
        reason: reason.trim(),
        emergencyContact: emergencyContact.trim(),
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
        `Leave Request ${created.id} submitted for Warden verification. Status: Pending.`,
        'success',
        'Leave Application Filed'
      );

      // Reset
      setDestination('');
      setReason('');
      setErrors({});
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Apply for Hostel Outstation / Leave"
      subtitle="Digital leave pass request reviewed by the Chief Warden office"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="date"
            label="Departure Date (From)"
            value={fromDate}
            min={todayStr}
            onChange={(e) => {
              setFromDate(e.target.value);
              if (new Date(e.target.value) > new Date(toDate)) {
                setToDate(e.target.value);
              }
              if (errors.fromDate) setErrors({ ...errors, fromDate: '' });
            }}
            error={errors.fromDate}
            required
          />

          <Input
            type="date"
            label="Return Date (To)"
            value={toDate}
            min={fromDate || todayStr}
            onChange={(e) => {
              setToDate(e.target.value);
              if (errors.toDate) setErrors({ ...errors, toDate: '' });
            }}
            error={errors.toDate}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Leave Type"
            options={leaveTypeOptions}
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value as LeaveType)}
            required
          />

          <Input
            label="Emergency / Parent Phone"
            placeholder="+91 98450 11223"
            value={emergencyContact}
            onChange={(e) => {
              setEmergencyContact(e.target.value);
              if (errors.emergencyContact) setErrors({ ...errors, emergencyContact: '' });
            }}
            leftIcon={<Phone className="w-4 h-4" />}
            error={errors.emergencyContact}
            required
          />
        </div>

        <Input
          label="Destination City & Address"
          placeholder="e.g. Coimbatore, Tamil Nadu (Home)"
          value={destination}
          onChange={(e) => {
            setDestination(e.target.value);
            if (errors.destination) setErrors({ ...errors, destination: '' });
          }}
          leftIcon={<MapPin className="w-4 h-4" />}
          error={errors.destination}
          required
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Detailed Reason for Leave <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Attending elder brother's wedding ceremony with family members..."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (errors.reason) setErrors({ ...errors, reason: '' });
            }}
            className={`w-full text-sm rounded-xl p-3 bg-white dark:bg-[#0e1626] text-slate-900 dark:text-white border ${
              errors.reason
                ? 'border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-300 dark:border-slate-700/80 focus:ring-indigo-500/20 focus:border-indigo-600'
            } outline-none focus:ring-4 placeholder:text-slate-400`}
            required
          />
          {errors.reason && (
            <p className="mt-1 text-xs text-rose-500 font-medium">{errors.reason}</p>
          )}
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 space-y-1">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            Hostel Gate Clearance Note:
          </p>
          <p>
            An SMS confirmation will be sent to the guardian contact. Digital QR gate pass will be
            available immediately upon approval.
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
            Submit Application
          </Button>
        </div>
      </form>
    </Modal>
  );
};
