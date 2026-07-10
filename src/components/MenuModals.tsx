import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Mail, Phone, MapPin, Briefcase, Bell, Shield, Globe, HelpCircle, PhoneCall, BookOpen, AlertCircle } from 'lucide-react';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'profile' | 'settings' | 'help' | null;
}

export const MenuModals: React.FC<MenuModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen || !type) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
          className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh] z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
            <h3 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
              {type === 'profile' && (
                <>
                  <User size={20} className="text-brand-primary" />
                  <span>Mening Profilim</span>
                </>
              )}
              {type === 'settings' && (
                <>
                  <Shield size={20} className="text-brand-primary" />
                  <span>Sozlamalar</span>
                </>
              )}
              {type === 'help' && (
                <>
                  <HelpCircle size={20} className="text-brand-primary" />
                  <span>Yordam va FAQ</span>
                </>
              )}
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {type === 'profile' && <ProfileContent />}
            {type === 'settings' && <SettingsContent />}
            {type === 'help' && <HelpContent />}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// 1. PROFILE MODAL CONTENT
const ProfileContent: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Avatar Card */}
      <div className="flex items-center gap-4 p-4 bg-brand-surface-low rounded-xl border border-brand-outline-variant/50">
        <div className="w-16 h-16 rounded-full bg-brand-primary/10 border-2 border-brand-primary/20 flex items-center justify-center font-display text-2xl font-black text-brand-primary select-none shrink-0">
          OS
        </div>
        <div>
          <h4 className="font-bold text-slate-800 text-base">Ozodbek Salimov</h4>
          <p className="text-xs text-brand-primary font-bold mt-0.5">Professional Ishchi</p>
          <div className="flex items-center gap-1.5 mt-1 text-slate-500 text-[11px] font-medium">
            <MapPin size={12} />
            <span>Toshkent, O'zbekiston</span>
          </div>
        </div>
      </div>

      {/* Info Rows */}
      <div className="space-y-3.5">
        <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Shaxsiy ma'lumotlar</h5>
        
        <div className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
            <Mail size={16} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">Email</p>
            <p className="text-slate-700 font-medium mt-0.5">ozodbeksalimov989@gmail.com</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
            <Phone size={16} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">Telefon raqam</p>
            <p className="text-slate-700 font-medium mt-0.5">+998 (90) 123-45-67</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
            <Briefcase size={16} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">Mutaxassislik</p>
            <p className="text-slate-700 font-medium mt-0.5">Kuryer, Qurilish va Omborda ishlash</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
          <p className="text-2xl font-black text-brand-primary">12</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Bajarilgan ishlar</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
          <p className="text-2xl font-black text-emerald-600">4.9 ★</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Reyting ball</p>
        </div>
      </div>
    </div>
  );
};

// 2. SETTINGS MODAL CONTENT
const SettingsContent: React.FC = () => {
  return (
    <div className="space-y-5">
      {/* Notifications */}
      <div className="space-y-3">
        <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Bell size={12} />
          <span>Bildirishnomalar</span>
        </h5>
        <div className="space-y-2.5">
          <label className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/55 transition-colors rounded-xl border border-slate-100 cursor-pointer">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-slate-700">Yangi ishlar haqida bildirishnoma</span>
              <span className="text-[10px] text-slate-400">Sizga yaqin joyda yangi ish e'lon qilinsa xabar berish</span>
            </div>
            <input type="checkbox" defaultChecked className="accent-brand-primary w-4 h-4 rounded" />
          </label>

          <label className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/55 transition-colors rounded-xl border border-slate-100 cursor-pointer">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-slate-700">Arizalar holati</span>
              <span className="text-[10px] text-slate-400">Ish beruvchi arizani tasdiqlasa yoki rad etsa</span>
            </div>
            <input type="checkbox" defaultChecked className="accent-brand-primary w-4 h-4 rounded" />
          </label>
        </div>
      </div>

      {/* Language */}
      <div className="space-y-3 pt-2">
        <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Globe size={12} />
          <span>Ilova tili</span>
        </h5>
        <div className="flex gap-2">
          <button className="flex-1 py-2.5 px-3 bg-brand-surface-low border border-brand-primary text-brand-primary rounded-xl text-xs font-bold transition-all">
            O'zbekcha (UZ)
          </button>
          <button className="flex-1 py-2.5 px-3 bg-slate-50 border border-slate-100 text-slate-500 rounded-xl text-xs font-semibold hover:bg-slate-100 transition-all">
            Русский (RU)
          </button>
        </div>
      </div>

      {/* Security */}
      <div className="space-y-3 pt-2">
        <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Shield size={12} />
          <span>Xavfsizlik</span>
        </h5>
        <button className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-100 transition-colors text-left flex items-center justify-between">
          <span>Parolni o'zgartirish</span>
          <span className="text-[10px] text-slate-400">O'zgartirilmagan</span>
        </button>
      </div>
    </div>
  );
};

// 3. HELP MODAL CONTENT
const HelpContent: React.FC = () => {
  return (
    <div className="space-y-5">
      {/* Help Lines */}
      <div className="space-y-3">
        <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tez-tez so'raladigan savollar</h5>
        
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <h6 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <BookOpen size={13} className="text-brand-primary" />
            <span>Qanday qilib ishga ariza topshiraman?</span>
          </h6>
          <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed font-medium">
            Xarita yoki ro'yxatdan o'zingizga yoqqan ishni tanlang, batafsil ma'lumotlar bilan tanishib chiqib, "Ariza topshirish" tugmasini bosing.
          </p>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <h6 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <BookOpen size={13} className="text-brand-primary" />
            <span>Kunlik nechtagacha ariza bersa bo'ladi?</span>
          </h6>
          <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed font-medium">
            Siz har bir kun uchun ko'pi bilan 2 tagacha ishga ariza yuborishingiz mumkin. Bu boshqa foydalanuvchilarga ham imkoniyat beradi.
          </p>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <h6 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <AlertCircle size={13} className="text-brand-primary" />
            <span>Buyurtmani bekor qilish tartibi qanday?</span>
          </h6>
          <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed font-medium">
            Agar arizangiz hali tasdiqlanmagan bo'lsa, uni bemalol kalendardan bekor qilishingiz mumkin. Tasdiqlangan ishlarni esa boshlanishidan kamida 2 soat oldin bekor qilish lozim.
          </p>
        </div>
      </div>

      {/* Support Call */}
      <div className="bg-brand-surface-low p-4 rounded-xl border border-brand-outline-variant/60 flex flex-col gap-2.5 mt-2">
        <div className="flex items-center gap-2">
          <PhoneCall size={16} className="text-brand-primary" />
          <span className="text-xs font-bold text-slate-700">Qo'llab-quvvatlash markazi</span>
        </div>
        <p className="text-[10px] text-brand-text-variant font-medium">
          Savollar yoki muammolar yuzaga kelsa, istalgan vaqtda bizning operatorlarimiz bilan bog'lanishingiz mumkin. Biz 24/7 ishlaymiz.
        </p>
        <a href="tel:+998901234567" className="w-full py-2 bg-brand-primary text-white text-center rounded-lg text-xs font-bold hover:bg-brand-primary-hover active:scale-98 transition-all block">
          Bog'lanish: +998 (90) 123-45-67
        </a>
      </div>
    </div>
  );
};
