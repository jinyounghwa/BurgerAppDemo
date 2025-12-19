'use client';

import { Customer } from '@/types/index';
import { formatGrade } from '@/lib/utils/format';
import { Award, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface PointsCardProps {
  customer: Customer;
}

export const PointsCard: React.FC<PointsCardProps> = ({ customer }) => {
  const nextGradePoints: Record<string, number> = {
    BRONZE: 5000,
    SILVER: 10000,
    GOLD: 20000,
    VIP: 50000,
  };

  const currentGradePoints = nextGradePoints[customer.grade] || 50000;
  const progressPercent = Math.min((customer.points / currentGradePoints) * 100, 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-primary overflow-hidden relative text-white rounded-3xl p-8 mb-8 shadow-xl shadow-primary/20"
    >
      {/* Background Decoration */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-10">
          <div>
            <p className="text-white/70 text-sm font-semibold mb-2 flex items-center gap-2">
              <Sparkles size={14} /> Total Points
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tighter">
                {customer.points.toLocaleString()}
              </span>
              <span className="text-xl font-bold text-accent">P</span>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
            <Award size={28} className="text-accent" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-bold flex items-center gap-2">
              <Award size={16} className="text-accent" />
              {formatGrade(customer.grade)} Member
            </span>
            {customer.grade !== 'VIP' && (
              <span className="text-white/70 font-medium">
                {(currentGradePoints - customer.points).toLocaleString()}P till next grade
              </span>
            )}
          </div>

          {customer.grade !== 'VIP' && (
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div className="w-full bg-white/20 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-accent h-2 rounded-full shadow-lg shadow-accent/40"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
