'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Menu as MenuType } from '@/types/index';
import { localStorageManager } from '@/lib/localStorage';
import { formatPrice } from '@/lib/utils/format';
import { getMenuImageUrl } from '@/lib/utils/unsplashImages';
import { OptimizedImage } from '@/components/shared/OptimizedImage';
import { Beef, Utensils, CupSoda, Package, ArrowRight, ShoppingBasket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Category = 'BURGER' | 'SIDE' | 'DRINK' | 'SET';

const categories = [
  { id: 'BURGER' as Category, name: '버거', icon: Beef, color: 'text-orange-500' },
  { id: 'SIDE' as Category, name: '사이드', icon: Utensils, color: 'text-yellow-500' },
  { id: 'DRINK' as Category, name: '음료', icon: CupSoda, color: 'text-blue-500' },
  { id: 'SET' as Category, name: '세트', icon: Package, color: 'text-purple-500' },
];

export default function KioskHomePage() {
  const [menus, setMenus] = useState<MenuType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>('BURGER');

  useEffect(() => {
    const menus = localStorageManager.getMenus();
    setMenus(menus);
  }, []);

  const filteredMenus = useMemo(
    () => menus.filter((m) => m.category === selectedCategory && m.isAvailable),
    [menus, selectedCategory]
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10">
      {/* Category Navigation */}
      <div className="flex flex-wrap gap-4 mb-12">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-1 min-w-[140px] group relative p-6 rounded-3xl transition-all duration-300 ${
                isActive
                  ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105 z-10'
                  : 'bg-white text-dark shadow-premium hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className={`p-3 rounded-2xl transition-colors ${
                  isActive ? 'bg-white/20' : 'bg-gray-50 ' + cat.color
                }`}>
                  <Icon size={28} />
                </div>
                <span className="font-black tracking-tight text-sm uppercase">{cat.name}</span>
              </div>
              {isActive && (
                <motion.div 
                  layoutId="active-cat"
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Menu Grid */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="text-2xl font-black text-dark flex items-center gap-3">
            <ShoppingBasket className="text-primary" size={28} />
            {categories.find(c => c.id === selectedCategory)?.name} 메뉴
          </h2>
          <span className="text-sm font-bold text-dark/40">{filteredMenus.length} items available</span>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredMenus.length > 0 ? (
              filteredMenus.map((menu, idx) => (
                <motion.div
                  key={menu.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    href={`/kiosk/menu/${menu.id}`}
                    className="card-premium group block h-full p-0 overflow-hidden"
                  >
                    {/* Image Area */}
                    <div className="aspect-[4/3] relative overflow-hidden bg-secondary-light">
                      <OptimizedImage
                        src={getMenuImageUrl(menu.id)}
                        alt={menu.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-black text-dark mb-2 text-lg group-hover:text-primary transition-colors">
                        {menu.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-black text-primary">
                          {formatPrice(menu.price)}
                        </p>
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-dark/20 group-hover:bg-primary group-hover:text-white transition-all">
                          <ArrowRight size={18} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-24 text-center glass rounded-3xl"
              >
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-200">
                  <ShoppingBasket size={40} />
                </div>
                <p className="text-dark/40 font-bold">해당 카테고리에 메뉴가 없습니다</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
