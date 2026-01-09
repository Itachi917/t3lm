"use client"

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      className="flex items-center gap-2 border-[#EDBB00] text-[#EDBB00] hover:bg-[#EDBB00] hover:text-[#004D98] font-bold uppercase transition-all"
    >
      <Globe className="w-4 h-4" />
      {language === 'en' ? 'العربية' : 'English'}
    </Button>
  );
}
