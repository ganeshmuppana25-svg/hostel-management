import React, { useState } from 'react';
import { Check, Mail, Phone, User as UserIcon, Heart, Building2, Clock, Shield } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useData();
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const isStaff = user && user.role !== 'student';

  // Common or student initial state
  const [phone, setPhone] = useState(() => (isStaff ? user?.phone || '' : profile.phone || ''));
  const [email, setEmail] = useState(() => (isStaff ? user?.email || '' : profile.email || ''));
  const [officeLocation, setOfficeLocation] = useState(() => user?.officeLocation || user?.checkpoint || '');
  const [dutyHours, setDutyHours] = useState(() => user?.dutyHours || user?.shift || '');

  // Student specific
  const [bloodGroup, setBloodGroup] = useState(profile.bloodGroup || 'O+ Positive');
  const [guardianName, setGuardianName] = useState(profile.guardian?.name || '');
  const [guardianPhone, setGuardianPhone] = useState(profile.guardian?.phone || '');

  // Emergency contact (Staff or Student)
  const [emergencyName, setEmergencyName] = useState(() => {
    if (isStaff) return user?.emergencyContact?.name || '';
    return profile.emergencyContact?.name || '';
  });
  const [emergencyPhone, setEmergencyPhone] = useState(() => {
    if (isStaff) return user?.emergencyContact?.phone || '';
    return profile.emergencyContact?.phone || '';
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      if (isStaff && user) {
        updateUser({
          phone: phone.trim(),
          email: email.trim(),
          ...(user.role === 'security'
            ? { checkpoint: officeLocation.trim(), shift: dutyHours.trim() }
            : { officeLocation: officeLocation.trim(), dutyHours: dutyHours.trim() }),
          emergencyContact: {
            name: emergencyName.trim(),
            relation: user.emergencyContact?.relation || (user.role === 'warden' ? 'Deputy Warden' : user.role === 'maintenance' ? 'Central Estate Office' : 'Control Room'),
            phone: emergencyPhone.trim(),
          },
        });
      } else {
        updateProfile({
          phone: phone.trim(),
          email: email.trim(),
          bloodGroup: bloodGroup.trim(),
          guardian: {
            name: guardianName.trim(),
            relation: profile.guardian?.relation || 'Parent',
            phone: guardianPhone.trim(),
          },
          emergencyContact: {
            name: emergencyName.trim(),
            relation: profile.emergencyContact?.relation || 'Guardian',
            phone: emergencyPhone.trim(),
          },
        });
        updateUser({
          phone: phone.trim(),
          email: email.trim(),
        });
      }

      setIsSubmitting(false);
      showToast('Profile contact details updated and saved successfully.', 'success', 'Profile Updated');
      onClose();
    }, 350);
  };

  const getModalTitle = () => {
    if (user?.role === 'warden') return 'Edit Warden Profile & Contacts';
    if (user?.role === 'security') return 'Edit Security Officer Profile';
    if (user?.role === 'maintenance') return 'Edit Facilities Technician Profile';
    if (user?.role === 'admin') return 'Edit Administrator Profile';
    return 'Edit Profile Information';
  };

  const getModalSubtitle = () => {
    if (user?.role === 'warden') return 'Update official mobile number, secretariat location, and emergency contacts';
    if (user?.role === 'security') return 'Update official phone number, assigned checkpoint, and duty shift';
    if (user?.role === 'maintenance') return 'Update official phone number, workshop location, and rapid response contacts';
    if (user?.role === 'admin') return 'Update institutional contact details and executive secretariat records';
    return 'Update your emergency numbers, contact info, and medical details';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getModalTitle()}
      subtitle={getModalSubtitle()}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name (Read Only)"
            value={user?.name || profile.name}
            disabled
            leftIcon={<UserIcon className="w-4 h-4" />}
          />

          <Input
            label={isStaff ? 'Staff ID / Employee Code (Read Only)' : 'Student ID (Read Only)'}
            value={user?.staffId || (isStaff ? (user?.role === 'maintenance' ? 'MNT-CIV-042' : 'WRD-2026-004') : profile.studentId)}
            disabled
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={isStaff ? 'Official Contact Number' : 'Student Mobile Number'}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            leftIcon={<Phone className="w-4 h-4" />}
            required
          />

          <Input
            type="email"
            label={isStaff ? 'Official Email Address' : 'Official Student Email'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />
        </div>

        {isStaff ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={user?.role === 'security' ? 'Assigned Checkpoint' : user?.role === 'maintenance' ? 'Workshop Base Location' : 'Office / Secretariat Location'}
              value={officeLocation}
              onChange={(e) => setOfficeLocation(e.target.value)}
              leftIcon={<Building2 className="w-4 h-4" />}
              placeholder={user?.role === 'security' ? 'e.g. Main Gate 1 Post' : user?.role === 'maintenance' ? 'e.g. Workshop Block C, Ground Floor' : 'e.g. Room W-101'}
            />

            <Input
              label={user?.role === 'security' ? 'Duty Shift Hours' : 'Official Duty Hours'}
              value={dutyHours}
              onChange={(e) => setDutyHours(e.target.value)}
              leftIcon={<Clock className="w-4 h-4" />}
              placeholder={user?.role === 'maintenance' ? 'e.g. 08:30 AM – 06:00 PM' : 'e.g. 09:00 AM – 06:00 PM'}
            />
          </div>
        ) : (
          <Input
            label="Blood Group"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            leftIcon={<Heart className="w-4 h-4" />}
            placeholder="e.g. O+ Positive, B+ Positive"
            required
          />
        )}

        <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-indigo-500" />
            {isStaff ? 'Emergency Contact / Liaison' : 'Guardian & Emergency Contacts'}
          </h4>

          {!isStaff && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
              <Input
                label="Guardian Name"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                placeholder="e.g. Venkatesh Kumar"
                required
              />

              <Input
                label="Guardian Phone"
                value={guardianPhone}
                onChange={(e) => setGuardianPhone(e.target.value)}
                leftIcon={<Phone className="w-4 h-4" />}
                required
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={isStaff ? 'Emergency Liaison Person / Dept' : 'Local Emergency Contact Person'}
              value={emergencyName}
              onChange={(e) => setEmergencyName(e.target.value)}
              placeholder={isStaff ? 'e.g. Central Estate Desk / Deputy Warden' : 'e.g. S. Rajesh (Uncle)'}
              required
            />

            <Input
              label="Emergency Phone Number"
              value={emergencyPhone}
              onChange={(e) => setEmergencyPhone(e.target.value)}
              leftIcon={<Phone className="w-4 h-4" />}
              required
            />
          </div>
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
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
