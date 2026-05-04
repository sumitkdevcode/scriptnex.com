'use client';

import { useState, type FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api, ApiError } from '@/lib/api';

export default function SettingsPage() {
  const { user, logout, updateUser } = useAuth();
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
      const payload = { name, username, bio, github_url: github || null, linkedin_url: linkedin || null };
      await api.put('/auth/profile', payload);
      updateUser(payload);
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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    setSaving(true); setError(null); setMessage(null);
    try {
      const response = await api.post<{ avatar_url: string }>('/auth/avatar', formData);
      setMessage('Avatar updated!');
      updateUser({ avatar: response.data.avatar_url });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Upload failed.');
    } finally { setSaving(false); }
  };

  const tabs = [
    { key: 'profile' as const, label: 'Profile' },
    { key: 'password' as const, label: 'Password' },
  ];

  return (
    <div className="p-8 max-w-2xl mx-auto w-full">
      <h1 className="text-2xl font-semibold mb-1">Settings</h1>
      <p className="text-[#ababab] text-sm mb-6">Manage your account and preferences</p>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#0f1115] rounded-xl p-1 border border-[#2a2d35]">
        {tabs.map(t => (
          <button key={t.key} onClick={() => { setTab(t.key); setMessage(null); setError(null); }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${tab === t.key ? 'bg-[#16181d] text-[#00d285]' : 'text-[#ababab] hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      {message && <div className="bg-[#00d285]/10 border border-[#00d285]/20 rounded-xl p-3 text-sm text-[#00d285] mb-4">{message}</div>}
      {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400 mb-4">{error}</div>}

      {tab === 'profile' ? (
        <div className="space-y-8">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4 bg-[#16181d] p-6 rounded-2xl border border-[#2a2d35]">
            <div className="relative group cursor-pointer" onClick={() => document.getElementById('avatar-input')?.click()}>
              {user?.avatar ? (
                <div className="w-24 h-24 rounded-full bg-cover bg-center border-2 border-[#2a2d35] group-hover:border-[#00d285] transition-all" style={{ backgroundImage: `url(${user.avatar})` }} />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00d285] to-[#00a669] flex items-center justify-center text-3xl font-bold text-black border-2 border-[#2a2d35] group-hover:border-white transition-all">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </div>
              <input id="avatar-input" type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-bold text-white mb-1">Profile Picture</h3>
              <p className="text-[10px] text-[#ababab] uppercase tracking-widest font-bold">PNG, JPG or WebP. Max 2MB.</p>
            </div>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#ababab] font-semibold mb-2">Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 bg-[#0f1115] border border-[#2a2d35] rounded-xl text-sm text-white focus:outline-none focus:border-[#00d285]/50" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#ababab] font-semibold mb-2">Username</label>
                <input value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-3 bg-[#0f1115] border border-[#2a2d35] rounded-xl text-sm text-white focus:outline-none focus:border-[#00d285]/50" />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#ababab] font-semibold mb-2">Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full px-4 py-3 bg-[#0f1115] border border-[#2a2d35] rounded-xl text-sm text-white focus:outline-none focus:border-[#00d285]/50 resize-none" placeholder="Tell us about yourself..." />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#ababab] font-semibold mb-2">GitHub URL</label>
              <input value={github} onChange={e => setGithub(e.target.value)} className="w-full px-4 py-3 bg-[#0f1115] border border-[#2a2d35] rounded-xl text-sm text-white focus:outline-none focus:border-[#00d285]/50" placeholder="https://github.com/username" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#ababab] font-semibold mb-2">LinkedIn URL</label>
              <input value={linkedin} onChange={e => setLinkedin(e.target.value)} className="w-full px-4 py-3 bg-[#0f1115] border border-[#2a2d35] rounded-xl text-sm text-white focus:outline-none focus:border-[#00d285]/50" placeholder="https://linkedin.com/in/username" />
            </div>
            <button type="submit" disabled={saving} className="px-6 py-3 bg-gradient-to-r from-[#00d285] to-[#00a669] rounded-xl text-sm font-bold text-black hover:opacity-90 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      ) : (
        <form onSubmit={handlePasswordChange} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#ababab] font-semibold mb-2">Current Password</label>
            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="w-full px-4 py-3 bg-[#0f1115] border border-[#2a2d35] rounded-xl text-sm text-white focus:outline-none focus:border-[#00d285]/50" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#ababab] font-semibold mb-2">New Password</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="w-full px-4 py-3 bg-[#0f1115] border border-[#2a2d35] rounded-xl text-sm text-white focus:outline-none focus:border-[#00d285]/50" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#ababab] font-semibold mb-2">Confirm New Password</label>
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
