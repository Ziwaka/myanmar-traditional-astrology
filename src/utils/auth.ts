export interface SuperAdminAccount {
  username: string;
  name: string;
  title: string;
  phone: string;
  sanctuaryName: string;
  role: 'super_admin';
  avatarEmoji: string;
  lastLogin: string;
}

export const SUPER_ADMIN_CREDENTIALS = {
  username: 'Amt',
  password: 'Amt999',
};

export const SUPER_ADMIN_ACCOUNT: SuperAdminAccount = {
  username: 'Amt',
  name: 'ဆရာကြီး Amt (Super Admin)',
  title: 'မြန်မာ့ရိုးရာ မဟာဗေဒင်နှင့် နက္ခတ်ပညာရှင်ချုပ်',
  phone: '09-450012345',
  sanctuaryName: 'မင်္ဂလာရတနာ ဗေဒင်နန်းတော်',
  role: 'super_admin',
  avatarEmoji: '👑',
  lastLogin: new Date().toISOString(),
};

const AUTH_TOKEN_KEY = 'myanmar_astrology_super_admin_session_v3';

export function isUserLoggedIn(): boolean {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY) === 'logged_in_amt_super_admin';
  } catch {
    return false;
  }
}

export function performLogin(usernameInput: string, passwordInput: string): boolean {
  if (
    usernameInput.trim() === SUPER_ADMIN_CREDENTIALS.username &&
    passwordInput === SUPER_ADMIN_CREDENTIALS.password
  ) {
    localStorage.setItem(AUTH_TOKEN_KEY, 'logged_in_amt_super_admin');
    return true;
  }
  return false;
}

export function performLogout(): void {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (e) {
    console.error('Error logging out', e);
  }
}

export function getCurrentAccount(): SuperAdminAccount {
  return SUPER_ADMIN_ACCOUNT;
}
