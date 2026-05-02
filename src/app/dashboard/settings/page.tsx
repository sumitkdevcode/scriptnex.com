'use client';

import { useState, type FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api, ApiError } from '@/lib/api';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<'profile' | 'password'>('profile');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Profile fields
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [github, setGithub] = useState(user?.github_url || '');
  const [linkedin, setLinkedin] = useState(user?.linkedin_url || '');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(null); setMessage(null);
    try {
      await api.put('/auth/profile', { name, username, bio, github_url: github || null, linkedin_url: linkedin || null });
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to update.');
    } finally { setSaving(false); }
  };

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    setSaving(true); setError(null); setMessage(null);
    try {
      await api.post('/auth/change-password', { current_password: currentPassword, password: newPassword, password_confirmation: confirmPassword });
      setMessage('Password changed!');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to change password.');
    } finally { setSaving(false); }
  };

  const tabs = [
    { key: 'profile' as const, label: 'Profile' },
    { key: 'password' as const, label: 'Password' },
  ];

  return (
    <div className="p-8 max-w-2xl mx-auto w-full">
      <h1 className="text-2xl font-semibold mb-1">Settings</h1>
      <p className="text-[#94a3b8] text-sm mb-6">Manage your account and preferences</p>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#0f1115] rounded-xl p-1 border border-[#2a2d35]">
        {tabs.map(t => (
          <button key={t.key} onClick={() => { setTab(t.key); setMessage(null); setError(null); }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${tab === t.key ? 'bg-[#16181d] text-[#00d285]' : 'text-[#64748b] hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      {message && <div className="bg-[#00d285]/10 border border-[#00d285]/20 rounded-xl p-3 text-sm text-[#00d285] mb-4">{message}</div>}
      {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400 mb-4">{error}</div>}

      {tab === 'profile' ? (
        <form onSubmit={handleProfileUpdate} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#64748b] font-semibold mb-2">Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 bg-[#0f1115] border border-[#2a2d35] rounded-xl text-sm text-white focus:outline-none focus:border-[#00d285]/50" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#64748b] font-semibold mb-2">Username</label>
              <input value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-3 bg-[#0f1115] border border-[#2a2d35] rounded-xl text-sm text-white focus:outline-none focus:border-[#00d285]/50" />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#64748b] font-semibold mb-2">Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full px-4 py-3 bg-[#0f1115] border border-[#2a2d35] rounded-xl text-sm text-white focus:outline-none focus:border-[#00d285]/50 resize-none" placeholder="Tell us about yourself..." />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#64748b] font-semibold mb-2">GitHub URL</label>
            <input value={github} onChange={e => setGithub(e.target.value)} className="w-full px-4 py-3 bg-[#0f1115] border border-[#2a2d35] rounded-xl text-sm text-white focus:outline-none focus:border-[#00d285]/50" placeholder="https://github.com/username" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#64748b] font-semibold mb-2">LinkedIn URL</label>
            <input value={linkedin} onChange={e => setLinkedin(e.target.value)} className="w-full px-4 py-3 bg-[#0f1115] border border-[#2a2d35] rounded-xl text-sm text-white focus:outline-none focus:border-[#00d285]/50" placeholder="https://linkedin.com/in/username" />
          </div>
          <button type="submit" disabled={saving} className="px-6 py-3 bg-gradient-to-r from-[#00d285] to-[#00a669] rounded-xl text-sm font-bold text-black hover:opacity-90 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      ) : (
        <form onSubmit={handlePasswordChange} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#64748b] font-semibold mb-2">Current Password</label>
            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="w-full px-4 py-3 bg-[#0f1115] border border-[#2a2d35] rounded-xl text-sm text-white focus:outline-none focus:border-[#00d285]/50" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#64748b] font-semibold mb-2">New Password</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="w-full px-4 py-3 bg-[#0f1115] border border-[#2a2d35] rounded-xl text-sm text-white focus:outline-none focus:border-[#00d285]/50" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#64748b] font-semibold mb-2">Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full px-4 py-3 bg-[#0f1115] border border-[#2a2d35] rounded-xl text-sm text-white focus:outline-none focus:border-[#00d285]/50" />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="px-6 py-3 bg-gradient-to-r from-[#00d285] to-[#00a669] rounded-xl text-sm font-bold text-black hover:opacity-90 disabled:opacity-50">
              {saving ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      )}

      {/* Danger Zone */}
      <div className="mt-12 border-t border-[#2a2d35] pt-6">
        <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3">Danger Zone</h3>
        <button onClick={logout} className="px-5 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/20 transition-colors">
          Sign Out
        </button>
      </div>
    </div>
  );
}
