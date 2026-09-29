export type UserRole = 'super_admin' | 'admin' | 'senior_staff' | 'staff';

export interface RolePermissions {
  canAddConsultation: boolean;
  canEditConsultation: boolean;
  canDeleteConsultation: boolean;
  canViewMonthlyReports: boolean;
  canManageExpenses: boolean;
  canManageAmulets: boolean;
  canManageUsers: boolean;
  canExportImportData: boolean;
  canClearDatabase: boolean;
}

export interface UserAccount {
  id: string;
  username: string;
  password?: string;
  name: string;
  title: string;
  phone?: string;
  sanctuaryName: string;
  role: UserRole;
  avatarEmoji: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export const ROLE_LABELS: Record<UserRole, { label: string; badgeColor: string; description: string }> = {
  super_admin: {
    label: 'Super Admin (အထူးလုပ်ပိုင်ခွင့်ချုပ်)',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    description: 'စနစ်တစ်ခုလုံးနှင့် အသုံးပြုသူများကို အပြည့်အဝ စီမံခန့်ခွဲခွင့်ရှိသည်'
  },
  admin: {
    label: 'Admin (စီမံခန့်ခွဲသူ)',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    description: 'ဗေဒင်မှတ်တမ်း၊ စာရင်းဇယားနှင့် အသုံးစရိတ်များကို စီမံခွင့်ရှိသည်'
  },
  senior_staff: {
    label: 'Senior Staff (အကြီးတန်း စာရေး)',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    description: 'ဗေဒင်မေးသူများ စာရင်းသွင်းခြင်း၊ ပြင်ဆင်ခြင်းနှင့် POS ရောင်းချခွင့်ရှိသည်'
  },
  staff: {
    label: 'Staff (ကောင်တာ / စာရေး)',
    badgeColor: 'bg-stone-700 text-stone-300 border-stone-600',
    description: 'ဗေဒင်မေးသူ စာရင်းသွင်းခြင်းနှင့် ဘောက်ချာထုတ်ပေးခွင့်သာရှိသည်'
  }
};

export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  super_admin: {
    canAddConsultation: true,
    canEditConsultation: true,
    canDeleteConsultation: true,
    canViewMonthlyReports: true,
    canManageExpenses: true,
    canManageAmulets: true,
    canManageUsers: true,
    canExportImportData: true,
    canClearDatabase: true,
  },
  admin: {
    canAddConsultation: true,
    canEditConsultation: true,
    canDeleteConsultation: true,
    canViewMonthlyReports: true,
    canManageExpenses: true,
    canManageAmulets: true,
    canManageUsers: false,
    canExportImportData: true,
    canClearDatabase: false,
  },
  senior_staff: {
    canAddConsultation: true,
    canEditConsultation: true,
    canDeleteConsultation: false,
    canViewMonthlyReports: true,
    canManageExpenses: true,
    canManageAmulets: true,
    canManageUsers: false,
    canExportImportData: false,
    canClearDatabase: false,
  },
  staff: {
    canAddConsultation: true,
    canEditConsultation: false,
    canDeleteConsultation: false,
    canViewMonthlyReports: false,
    canManageExpenses: false,
    canManageAmulets: false,
    canManageUsers: false,
    canExportImportData: false,
    canClearDatabase: false,
  },
};

const USERS_STORAGE_KEY = 'myanmar_astrology_user_accounts_v4';
const PERMISSIONS_STORAGE_KEY = 'myanmar_astrology_role_permissions_v4';
const CURRENT_SESSION_KEY = 'myanmar_astrology_active_session_v4';

export const INITIAL_USER_ACCOUNTS: UserAccount[] = [
  {
    id: 'user-super-admin',
    username: 'Amt',
    password: 'Amt999',
    name: 'ဆရာကြီး Amt (Super Admin)',
    title: 'မြန်မာ့ရိုးရာ မဟာဗေဒင်နှင့် နက္ခတ်ပညာရှင်ချုပ်',
    phone: '09-450012345',
    sanctuaryName: 'မင်္ဂလာရတနာ ဗေဒင်နန်းတော်',
    role: 'super_admin',
    avatarEmoji: '👑',
    isActive: true,
    createdAt: '2026-09-28T00:00:00.000Z',
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'user-admin-1',
    username: 'admin',
    password: 'Admin123',
    name: 'ကိုသူရ (မန်နေဂျာ / Admin)',
    title: 'ဌာနတာဝန်ခံ မန်နေဂျာ',
    phone: '09-450099999',
    sanctuaryName: 'မင်္ဂလာရတနာ ဗေဒင်နန်းတော်',
    role: 'admin',
    avatarEmoji: '⚡',
    isActive: true,
    createdAt: '2026-09-29T00:00:00.000Z',
  },
  {
    id: 'user-senior-1',
    username: 'senior1',
    password: 'Senior123',
    name: 'မသီတာ (Senior Staff)',
    title: 'အကြီးတန်း စာရေး & POS တာဝန်ခံ',
    phone: '09-450088888',
    sanctuaryName: 'မင်္ဂလာရတနာ ဗေဒင်နန်းတော်',
    role: 'senior_staff',
    avatarEmoji: '✨',
    isActive: true,
    createdAt: '2026-09-29T00:00:00.000Z',
  },
  {
    id: 'user-staff-1',
    username: 'staff1',
    password: 'Staff123',
    name: 'ကိုအောင် (Staff / Counter)',
    title: 'ကောင်တာ စာရင်းသွင်း စာရေး',
    phone: '09-450077777',
    sanctuaryName: 'မင်္ဂလာရတနာ ဗေဒင်နန်းတော်',
    role: 'staff',
    avatarEmoji: '📝',
    isActive: true,
    createdAt: '2026-09-29T00:00:00.000Z',
  }
];

export function loadUserAccounts(): UserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      saveUserAccounts(INITIAL_USER_ACCOUNTS);
      return INITIAL_USER_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_USER_ACCOUNTS;
  } catch (e) {
    console.error('Error loading users', e);
    return INITIAL_USER_ACCOUNTS;
  }
}

export function saveUserAccounts(users: UserAccount[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Error saving users', e);
  }
}

export function loadRolePermissions(): Record<UserRole, RolePermissions> {
  try {
    const raw = localStorage.getItem(PERMISSIONS_STORAGE_KEY);
    if (!raw) {
      saveRolePermissions(DEFAULT_ROLE_PERMISSIONS);
      return DEFAULT_ROLE_PERMISSIONS;
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_ROLE_PERMISSIONS, ...parsed };
  } catch {
    return DEFAULT_ROLE_PERMISSIONS;
  }
}

export function saveRolePermissions(perms: Record<UserRole, RolePermissions>): void {
  try {
    localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(perms));
  } catch (e) {
    console.error('Error saving role permissions', e);
  }
}

export function getEffectivePermissions(role: UserRole): RolePermissions {
  if (role === 'super_admin') {
    return DEFAULT_ROLE_PERMISSIONS.super_admin;
  }
  const allPerms = loadRolePermissions();
  return allPerms[role] || DEFAULT_ROLE_PERMISSIONS[role] || DEFAULT_ROLE_PERMISSIONS.staff;
}

export function isUserLoggedIn(): boolean {
  try {
    const session = localStorage.getItem(CURRENT_SESSION_KEY);
    return !!session;
  } catch {
    return false;
  }
}

export function getCurrentUser(): UserAccount {
  try {
    const session = localStorage.getItem(CURRENT_SESSION_KEY);
    if (session) {
      const parsed: UserAccount = JSON.parse(session);
      const allUsers = loadUserAccounts();
      const matched = allUsers.find(u => u.id === parsed.id || u.username.toLowerCase() === parsed.username.toLowerCase());
      if (matched && matched.isActive) {
        return matched;
      }
    }
  } catch (e) {
    console.error('Error getting current user', e);
  }
  return INITIAL_USER_ACCOUNTS[0]; // Default fallback to Super Admin
}

export function performLogin(usernameInput: string, passwordInput: string): { success: boolean; user?: UserAccount; error?: string } {
  const users = loadUserAccounts();
  const trimmedUser = usernameInput.trim().toLowerCase();
  
  const found = users.find(u => u.username.toLowerCase() === trimmedUser && u.password === passwordInput);
  
  if (!found) {
    return { success: false, error: 'User Name သို့မဟုတ် Password မှားယွင်းနေပါသည်။' };
  }

  if (!found.isActive) {
    return { success: false, error: 'ဤအကောင့်အား ပိတ်ထားပါသည် (Disabled)။ Super Admin ထံ ဆက်သွယ်ပါ။' };
  }

  found.lastLogin = new Date().toISOString();
  saveUserAccounts(users);

  // Set session
  localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(found));
  return { success: true, user: found };
}

export function performLogout(): void {
  try {
    localStorage.removeItem(CURRENT_SESSION_KEY);
  } catch (e) {
    console.error('Error logging out', e);
  }
}
