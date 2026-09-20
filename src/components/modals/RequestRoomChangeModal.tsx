import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

interface RequestRoomChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestRoomChangeModal: React.FC<RequestRoomChangeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { requestRoomChange, profile } = useData();
  const { showToast } = useToast();

  const [preferredBlock, setPreferredBlock] = useState('Block A');
  const [preferredFloor, setPreferredFloor] = useState('1st Floor');
  const [roomType, setRoomType] = useState('2-Sharing AC');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const blockOptions = [
    { label: 'Block A (Senior Wing)', value: 'Block A' },
    { label: 'Block B (Current - Tech Wing)', value: 'Block B' },
    { label: 'Block C (Quiet Study Block)', value: 'Block C' },
  ];

  const floorOptions = [
    { label: 'Ground Floor', value: 'Ground Floor' },
    { label: '1st Floor', value: '1st Floor' },
    { label: '2nd Floor (Current)', value: '2nd Floor' },
    { label: '3rd Floor', value: '3rd Floor' },
  ];

  const typeOptions = [
    { label: '2-Sharing Non-AC', value: '2-Sharing Non-AC' },
    { label: '2-Sharing AC Premium', value: '2-Sharing AC' },
    { label: '4-Sharing Non-AC (Current Type)', value: '4-Sharing Non-AC' },
    { label: 'Single Occupancy Study Room', value: 'Single' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please describe your reason for requesting a room change');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      requestRoomChange({
        reason: reason.trim(),
        preferredBlock,
        preferredFloor,
      });

      setIsSubmitting(false);
      showToast(
        'Room change request submitted to Chief Warden for next semester / slot allocation review.',
        'success',
        'Request Logged'
      );
      setReason('');
      setError('');
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Room Change"
      subtitle={`Current Room: ${profile.roomNumber} (${profile.block}, ${profile.floor})`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Preferred Block"
            options={blockOptions}
            value={preferredBlock}
            onChange={(e) => setPreferredBlock(e.target.value)}
          />

          <Select
            label="Preferred Floor"
            options={floorOptions}
            value={preferredFloor}
            onChange={(e) => setPreferredFloor(e.target.value)}
          />
        </div>

        <Select
          label="Desired Room Type"
          options={typeOptions}
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Reason for Relocation <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Medical reasons requiring lower floor, project collaboration with peers, study habits..."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError('');
            }}
            className={`w-full text-sm rounded-xl p-3 bg-white dark:bg-[#0e1626] text-slate-900 dark:text-white border ${
              error
                ? 'border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-300 dark:border-slate-700/80 focus:ring-indigo-500/20 focus:border-indigo-600'
            } outline-none focus:ring-4 placeholder:text-slate-400`}
            required
          />
          {error && <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>}
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
          Room re-allocations are subject to vacancy in the requested block and mutual roommate consent where applicable.
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
            Submit Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};
