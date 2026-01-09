export const translations = {
  en: {
    title: "T3LM.APP",
    subtitle: "Student Platform",
    dashboard: "Dashboard",
    courses: "Courses",
    staff: "Staff",
    community: "Community",
    leaderboard: "Leaderboard",
    resources: "Resources",
    focusRoom: "Focus Room",
    timetable: "My Timetable",
    signIn: "Sign In",
    signOut: "Log Out",
    welcome: "Welcome",
    searchPlaceholder: "Search...",
  },
  ar: {
    title: "تعلم",
    subtitle: "منصة الطالب",
    dashboard: "الرئيسية",
    courses: "المقررات",
    staff: "هيئة التدريس",
    community: "المجتمع",
    leaderboard: "لوحة المتصدرين",
    resources: "المصادر",
    focusRoom: "غرفة التركيز",
    timetable: "جدولي الدراسي",
    signIn: "تسجيل دخول",
    signOut: "تسجيل خروج",
    welcome: "مرحباً",
    searchPlaceholder: "بحث...",
  }
};

export type Language = 'en' | 'ar';
export type TranslationKey = keyof typeof translations.en;
