import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Key, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Lock, 
  Unlock, 
  Crown, 
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  UserAccount, 
  UserRole, 
  RolePermissions, 
  ROLE_LABELS, 
  DEFAULT_ROLE_PERMISSIONS,
  loadUserAccounts,
  saveUserAccounts,
  loadRolePermissions,
  saveRolePermissions,
  getCurrentUser
} from '../utils/auth';
import { saveUserToCloud, deleteUserFromCloud, subscribeToUsers } from '../utils/firebase';

interface UserManagementViewProps {
  currentUser: UserAccount;
  onUserChanged?: () => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  currentUser,
  onUserChanged,
}) => {
  const [users, setUsers] = useState<UserAccount[]>(loadUserAccounts());
  const [rolePermissions, setRolePermissions] = useState<Record<UserRole, RolePermissions>>(loadRolePermissions());

  // Real-time synchronization with Cloud Firestore
  useEffect(() => {
    const unsub = subscribeToUsers((cloudUsers) => {
      if (cloudUsers && cloudUsers.length > 0) {
        setUsers(cloudUsers);
        saveUserAccounts(cloudUsers);
      }
    });
    return () => unsub();
  }, []);
  
  // Modal states
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  // Form states
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formName, setFormName] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('staff');
  const [notification, setNotification] = useState<string | null>(null);

  const isSuperAdmin = currentUser.role === 'super_admin';

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleOpenAddUser = () => {
    setFormUsername('');
    setFormPassword('');
    setFormName('');
    setFormTitle('ကောင်တာ စာရေး');
    setFormPhone('');
    setFormRole('staff');
    setIsAddUserModalOpen(true);
  };

  const handleOpenEditUser = (user: UserAccount) => {
    setEditingUser(user);
    setFormUsername(user.username);
    setFormPassword(user.password || '');
    setFormName(user.name);
    setFormTitle(user.title);
    setFormPhone(user.phone || '');
    setFormRole(user.role);
    setIsAddUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUsername.trim() || !formName.trim() || !formPassword.trim()) {
      alert('ကျေးဇူးပြု၍ Username၊ အမည်နှင့် Password ထည့်သွင်းပေးပါ။');
      return;
    }

    const currentList = loadUserAccounts();

    if (editingUser) {
      // Update existing user
      let updatedUserObj: UserAccount | null = null;
      const updatedList = currentList.map(u => {
        if (u.id === editingUser.id) {
          const mod = {
            ...u,
            username: formUsername.trim(),
            password: formPassword.trim(),
            name: formName.trim(),
            title: formTitle.trim(),
            phone: formPhone.trim(),
            role: formRole,
          };
          updatedUserObj = mod;
          return mod;
        }
        return u;
      });

      saveUserAccounts(updatedList);
      setUsers(updatedList);
      if (updatedUserObj) {
        saveUserToCloud(updatedUserObj).catch(err => console.warn('Cloud save user error:', err));
      }
      showNotification(`အကောင့် "${formUsername}" ကို အောင်မြင်စွာ ပြင်ဆင်ပြီးပါပြီ။`);
    } else {
      // Create new user
      const exists = currentList.some(u => u.username.toLowerCase() === formUsername.trim().toLowerCase());
      if (exists) {
        alert('ဤ Username အား အခြားသူ သုံးထားပြီးဖြစ်ပါသည်။ အခြား Username ရွေးချယ်ပေးပါ။');
        return;
      }

      const roleEmojiMap: Record<UserRole, string> = {
        super_admin: '👑',
        admin: '⚡',
        senior_staff: '✨',
        staff: '📝'
      };

      const newUser: UserAccount = {
        id: `user-${Date.now()}`,
        username: formUsername.trim(),
        password: formPassword.trim(),
        name: formName.trim(),
        title: formTitle.trim() || 'စာရေး',
        phone: formPhone.trim() || '09-',
        sanctuaryName: 'မင်္ဂလာရတနာ ဗေဒင်နန်းတော်',
        role: formRole,
        avatarEmoji: roleEmojiMap[formRole] || '👤',
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      const updatedList = [...currentList, newUser];
      saveUserAccounts(updatedList);
      setUsers(updatedList);
      saveUserToCloud(newUser).catch(err => console.warn('Cloud save user error:', err));
      showNotification(`အကောင့်သစ် "${newUser.username}" (${newUser.name}) ကို အောင်မြင်စွာ ဖန်တီးပြီး Cloud သို့ သိမ်းဆည်းလိုက်ပါပြီ။`);
    }

    setIsAddUserModalOpen(false);
    setEditingUser(null);
    onUserChanged?.();
  };

  const handleToggleUserActive = (user: UserAccount) => {
    if (user.role === 'super_admin' && user.username === 'Amt') {
      alert('Super Admin (Amt) အကောင့်အား ပိတ်၍ မရပါ။');
      return;
    }

    const currentList = loadUserAccounts();
    let toggledObj: UserAccount | null = null;
    const updatedList = currentList.map(u => {
      if (u.id === user.id) {
        const mod = { ...u, isActive: !u.isActive };
        toggledObj = mod;
        return mod;
      }
      return u;
    });

    saveUserAccounts(updatedList);
    setUsers(updatedList);
    if (toggledObj) {
      saveUserToCloud(toggledObj).catch(err => console.warn('Cloud save user error:', err));
    }
    showNotification(`အကောင့် "${user.username}" ကို ${!user.isActive ? 'ပြန်လည်ဖွင့်လှစ်ပြီး' : 'ပိတ်သိမ်းပြီး'} ပါပြီ။`);
    onUserChanged?.();
  };

  const handleDeleteUser = (user: UserAccount) => {
    if (user.role === 'super_admin' && user.username === 'Amt') {
      alert('Super Admin (Amt) အကောင့်အား ဖျက်၍ မရပါ။');
      return;
    }

    if (window.confirm(`အကောင့် "${user.username}" (${user.name}) အား အပြီးဖျက်ပစ်ရန် သေချာပါသလား?`)) {
      const currentList = loadUserAccounts();
      const updatedList = currentList.filter(u => u.id !== user.id);
      saveUserAccounts(updatedList);
      setUsers(updatedList);
      deleteUserFromCloud(user.id).catch(err => console.warn('Cloud delete user error:', err));
      showNotification(`အကောင့် "${user.username}" ကို ဖျက်ပစ်ပြီးပါပြီ။`);
      onUserChanged?.();
    }
  };

  const handlePermissionToggle = (role: UserRole, permissionKey: keyof RolePermissions) => {
    if (role === 'super_admin') {
      alert('Super Admin သည် အထူးလုပ်ပိုင်ခွင့် အပြည့်အဝ ရှိသောကြောင့် ခွင့်ပြုချက်များ အားလုံး အမြဲ ပွင့်နေမည် ဖြစ်ပါသည်။');
      return;
    }

    const updated = {
      ...rolePermissions,
      [role]: {
        ...rolePermissions[role],
        [permissionKey]: !rolePermissions[role][permissionKey]
      }
    };

    setRolePermissions(updated);
    saveRolePermissions(updated);
    showNotification(`${ROLE_LABELS[role].label} ၏ လုပ်ပိုင်ခွင့်ကို ပြင်ဆင်သိမ်းဆည်းပြီးပါပြီ။`);
    onUserChanged?.();
  };

  const handleResetPermissions = () => {
    if (window.confirm('လုပ်ပိုင်ခွင့် Permission အားလုံးကို မူလသတ်မှတ်ချက် (Default) အတိုင်း ပြန်လည်ထားရှိမည် သေချာပါသလား?')) {
      setRolePermissions(DEFAULT_ROLE_PERMISSIONS);
      saveRolePermissions(DEFAULT_ROLE_PERMISSIONS);
      showNotification('လုပ်ပိုင်ခွင့် Permission အားလုံးကို မူလသတ်မှတ်ချက်အတိုင်း ပြန်လည်ထားရှိပြီးပါပြီ။');
      onUserChanged?.();
    }
  };

  const permissionList: { key: keyof RolePermissions; label: string; desc: string }[] = [
    { key: 'canAddConsultation', label: 'ဗေဒင်မေးသူ အသစ်စာရင်းသွင်းခွင့်', desc: 'ဗေဒင်မေးသူ အချက်အလက်သစ်များ ထည့်သွင်းခြင်း' },
    { key: 'canEditConsultation', label: 'ဗေဒင်မှတ်တမ်း ပြင်ဆင်ခွင့်', desc: 'ရှိပြီးသား ဗေဒင်မှတ်တမ်း၊ ဟောချက်များအား ပြင်ဆင်ခြင်း' },
    { key: 'canDeleteConsultation', label: 'ဗေဒင်မှတ်တမ်း ဖျက်ပစ်ခွင့်', desc: 'မှားယွင်းသော မှတ်တမ်းများကို ဇယားမှ ဖျက်ပစ်ခြင်း' },
    { key: 'canViewMonthlyReports', label: 'လစဉ် ဝင်ငွေ/စာရင်းဇယား ကြည့်ရှုခွင့်', desc: 'လစဉ် အစီရင်ခံစာနှင့် စုစုပေါင်း ဝင်ငွေများ ကြည့်ရှုခြင်း' },
    { key: 'canManageExpenses', label: 'အသုံးစရိတ် စာရင်းသွင်း/စီမံခွင့်', desc: 'အသုံးစရိတ် ထည့်သွင်းခြင်း၊ ပြင်ဆင်ခြင်းနှင့် ဖျက်ခြင်း' },
    { key: 'canManageAmulets', label: 'အဆောင်ပစ္စည်း POS စီမံခွင့်', desc: 'အဆောင်ပစ္စည်း ကတ်တလောက် ထည့်သွင်းခြင်းနှင့် ဈေးနှုန်းပြင်ခြင်း' },
    { key: 'canManageUsers', label: 'User အကောင့်များနှင့် Role စီမံခွင့်', desc: 'အသုံးပြုသူ အကောင့်အသစ် ဖွင့်ခြင်းနှင့် လုပ်ပိုင်ခွင့် သတ်မှတ်ခြင်း' },
    { key: 'canExportImportData', label: 'Data Backup (Export / Import) ခွင့်', desc: 'JSON/Excel စာရင်းများ ကူးယူ သိမ်းဆည်းခြင်း' },
    { key: 'canClearDatabase', label: 'Database အကုန် အစမှ ပြန်ဖျက်ခွင့်', desc: 'စနစ်တစ်ခုလုံးရှိ စာရင်းအကုန် ဖျက်သိမ်းခွင့် (Super Admin Only)' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-2xl shadow-2xl border border-emerald-400 text-xs font-semibold animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-stone-850 p-5 sm:p-6 rounded-3xl border border-stone-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-amber-200 flex items-center gap-2">
              <span>အသုံးပြုသူ အကောင့်များနှင့် လုပ်ပိုင်ခွင့်များ စီမံခန့်ခွဲမှု</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                RBAC System
              </span>
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Super Admin, Admin, Senior Staff, Staff ရာထူးအလိုက် သီးခြား လုပ်ပိုင်ခွင့်များ သတ်မှတ်ပေးခြင်း
            </p>
          </div>
        </div>

        {isSuperAdmin && (
          <button
            onClick={handleOpenAddUser}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow-lg transition active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ အကောင့်အသစ် ဖန်တီးမည်</span>
          </button>
        )}
      </div>

      {/* User Accounts List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-200 flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <span>လက်ရှိ အသုံးပြုသူ အကောင့်များ ({users.length} ခု)</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {users.map((user) => {
            const roleMeta = ROLE_LABELS[user.role];
            const isMe = user.username.toLowerCase() === currentUser.username.toLowerCase();

            return (
              <div
                key={user.id}
                className={`bg-stone-850 rounded-3xl border p-5 shadow-lg flex flex-col justify-between space-y-4 transition ${
                  isMe ? 'border-amber-500/60 ring-1 ring-amber-500/30' : 'border-stone-800 hover:border-stone-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{user.avatarEmoji}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-stone-100 text-sm">{user.name}</h4>
                          {isMe && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/30 text-amber-300 font-bold">
                              (လက်ရှိ)
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-400">{user.title}</p>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${roleMeta.badgeColor}`}>
                      {user.role === 'super_admin' ? 'Super Admin' : user.role.toUpperCase()}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-800 space-y-1.5 text-xs text-stone-300">
                    <div className="flex justify-between">
                      <span className="text-stone-400">User Name:</span>
                      <strong className="font-mono text-amber-300">{user.username}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Password:</span>
                      <span className="font-mono text-stone-300">••••••••</span>
                    </div>
                    {user.phone && (
                      <div className="flex justify-between">
                        <span className="text-stone-400">ဖုန်း:</span>
                        <span>{user.phone}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-stone-400">အခြေအနေ:</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        user.isActive ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}>
                        {user.isActive ? 'Active (ဖွင့်ထားသည်)' : 'Disabled (ပိတ်ထားသည်)'}
                      </span>
                    </div>
                  </div>
                </div>

                {isSuperAdmin && (
                  <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-stone-800">
                    <button
                      type="button"
                      onClick={() => handleToggleUserActive(user)}
                      title={user.isActive ? 'အကောင့်ခေတ္တပိတ်မည်' : 'အကောင့်ပြန်ဖွင့်မည်'}
                      className={`p-2 rounded-xl border text-xs transition cursor-pointer ${
                        user.isActive 
                          ? 'bg-stone-900 border-stone-700 text-stone-400 hover:text-amber-300' 
                          : 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
                      }`}
                    >
                      {user.isActive ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditUser(user)}
                      title="အကောင့် အချက်အလက်နှင့် Password ပြင်ရန်"
                      className="p-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-300 hover:text-amber-300 hover:border-amber-500/50 transition cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    {user.username !== 'Amt' && (
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(user)}
                        title="အကောင့် ဖျက်ပစ်မည်"
                        className="p-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-400 hover:text-rose-400 hover:border-rose-500/50 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Role-Based Permissions Matrix (Super Admin Configurable) */}
      <div className="bg-stone-850 p-5 sm:p-6 rounded-3xl border border-stone-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-amber-200 flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>ရာထူးအလိုက် လုပ်ပိုင်ခွင့်များ သတ်မှတ်ချက် (Permissions Matrix)</span>
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Super Admin သည် ရာထူးတစ်ခုစီအတွက် လုပ်ပိုင်ခွင့်များကို စိတ်ကြိုက် အမှန်ခြစ်၍ ပြင်ဆင်သတ်မှတ်နိုင်ပါသည်
            </p>
          </div>

          {isSuperAdmin && (
            <button
              onClick={handleResetPermissions}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 text-xs font-semibold transition cursor-pointer self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
              <span>မူလသတ်မှတ်ချက်သို့ ပြန်ထားမည်</span>
            </button>
          )}
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400">
                <th className="py-3 px-3">လုပ်ပိုင်ခွင့် အမျိုးအစား (Permission)</th>
                <th className="py-3 px-3 text-center">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                    👑 Super Admin
                  </span>
                </th>
                <th className="py-3 px-3 text-center">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                    ⚡ Admin
                  </span>
                </th>
                <th className="py-3 px-3 text-center">
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40">
                    ✨ Senior Staff
                  </span>
                </th>
                <th className="py-3 px-3 text-center">
                  <span className="px-2.5 py-1 rounded-lg bg-stone-800 text-stone-300 font-bold border border-stone-700">
                    📝 Staff
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {permissionList.map((perm) => (
                <tr key={perm.key} className="hover:bg-stone-900/40 transition">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-stone-200">{perm.label}</div>
                    <div className="text-[11px] text-stone-400">{perm.desc}</div>
                  </td>

                  {/* Super Admin (Always True) */}
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold">
                      ✓
                    </span>
                  </td>

                  {/* Admin */}
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      disabled={!isSuperAdmin}
                      onClick={() => handlePermissionToggle('admin', perm.key)}
                      className={`w-6 h-6 rounded-lg inline-flex items-center justify-center font-bold text-xs transition cursor-pointer ${
                        rolePermissions.admin[perm.key]
                          ? 'bg-emerald-500 text-stone-950 shadow'
                          : 'bg-stone-900 border border-stone-700 text-stone-500'
                      }`}
                    >
                      {rolePermissions.admin[perm.key] ? '✓' : '✕'}
                    </button>
                  </td>

                  {/* Senior Staff */}
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      disabled={!isSuperAdmin}
                      onClick={() => handlePermissionToggle('senior_staff', perm.key)}
                      className={`w-6 h-6 rounded-lg inline-flex items-center justify-center font-bold text-xs transition cursor-pointer ${
                        rolePermissions.senior_staff[perm.key]
                          ? 'bg-cyan-500 text-stone-950 shadow'
                          : 'bg-stone-900 border border-stone-700 text-stone-500'
                      }`}
                    >
                      {rolePermissions.senior_staff[perm.key] ? '✓' : '✕'}
                    </button>
                  </td>

                  {/* Staff */}
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      disabled={!isSuperAdmin}
                      onClick={() => handlePermissionToggle('staff', perm.key)}
                      className={`w-6 h-6 rounded-lg inline-flex items-center justify-center font-bold text-xs transition cursor-pointer ${
                        rolePermissions.staff[perm.key]
                          ? 'bg-amber-400 text-stone-950 shadow'
                          : 'bg-stone-900 border border-stone-700 text-stone-500'
                      }`}
                    >
                      {rolePermissions.staff[perm.key] ? '✓' : '✕'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-stone-900 border border-amber-500/40 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-bold text-amber-200 text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>{editingUser ? 'အကောင့် အချက်အလက် ပြင်ဆင်ရန်' : 'အသုံးပြုသူ အကောင့်သစ် ဖွင့်ရန်'}</span>
              </h3>
              <button
                onClick={() => {
                  setIsAddUserModalOpen(false);
                  setEditingUser(null);
                }}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block text-stone-300 font-medium mb-1">User Name (လော့ဂ်အင် ဝင်မည့် နာမည်) *</label>
                <input
                  type="text"
                  placeholder="ဥပမာ - admin2, staff_mg_mg"
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-amber-300 font-mono focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Password (စကားဝှက်) *</label>
                <input
                  type="text"
                  placeholder="စကားဝှက် ရိုက်ထည့်ပါ"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-mono focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">ဝန်ထမ်း အမည် အပြည့်အစုံ *</label>
                <input
                  type="text"
                  placeholder="ဥပမာ - ဒေါ်လှလှမြင့်"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">ရာထူး / Role သတ်မှတ်ချက် *</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-amber-300 font-medium focus:border-amber-500 cursor-pointer"
                >
                  <option value="staff">📝 Staff (ကောင်တာ / စာရေး)</option>
                  <option value="senior_staff">✨ Senior Staff (အကြီးတန်း စာရေး)</option>
                  <option value="admin">⚡ Admin (စီမံခန့်ခွဲသူ)</option>
                  <option value="super_admin">👑 Super Admin (အထူးလုပ်ပိုင်ခွင့်ချုပ်)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">ရာထူးအမည် (Title / Position)</label>
                <input
                  type="text"
                  placeholder="ဥပမာ - ကောင်တာ ၁ တာဝန်ခံ"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">ဖုန်းနံပါတ်</label>
                <input
                  type="text"
                  placeholder="09-xxxxxxxxx"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddUserModalOpen(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 hover:bg-stone-700 text-xs font-semibold"
                >
                  မလုပ်တော့ပါ
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs shadow hover:from-amber-400 hover:to-amber-500"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingUser ? 'ပြင်ဆင်မှု သိမ်းဆည်းမည်' : 'အကောင့် ဖန်တီးမည်'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
