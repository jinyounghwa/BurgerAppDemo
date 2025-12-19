'use client';

import Link from 'next/link';
import { Navigation } from '@/components/shared/Navigation';
import { 
  Smartphone, 
  Monitor, 
  ChefHat, 
  Tv, 
  Settings, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function SystemIntroduction() {
  return (
    <div className="bg-secondary-light min-h-screen">
      <Navigation />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="section-container text-center mb-12">
          <motion.div {...fadeInUp}>
            <span className="badge badge-warning mb-4 inline-block">Demo Ecosystem</span>
            <h1 className="heading-xl mb-6">
              The Real-Time <br />
              <span className="text-primary italic">Burger Order</span> Ecosystem
            </h1>
            <p className="text-lg text-dark/70 max-w-2xl mx-auto mb-10 leading-relaxed">
              고객 모바일웹부터 키오스크, 주방, 알림판, 관리자까지
              전체 주문 생태계를 경험할 수 있는 통합 시뮬레이션 시스템입니다.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/customer" className="btn btn-primary px-8 py-4 text-lg w-full sm:w-auto">
                고객앱 시작하기 <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link href="/flow" className="btn btn-secondary px-8 py-4 text-lg w-full sm:w-auto">
                시스템 플로우 보기
              </Link>
            </div>
          </motion.div>
        </section>

        {/* System Overview Cards */}
        <section className="section-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          <motion.div 
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Smartphone,
                title: "고객 모바일앱",
                desc: "실제 앱과 유사한 주문 플로우, 포인트, 쿠폰 시스템",
                color: "bg-blue-500",
                href: "/customer"
              },
              {
                icon: Monitor,
                title: "매장 키오스크",
                desc: "직관적인 UI/UX 기반의 메뉴 주문 및 결제 프로세스",
                color: "bg-green-500",
                href: "/kiosk"
              },
              {
                icon: ChefHat,
                title: "주방 시스템",
                desc: "조리 대기열 관리 및 실시간 주문 상태 업데이트",
                color: "bg-orange-500",
                href: "/kitchen"
              },
              {
                icon: Tv,
                title: "고객 알림판",
                desc: "조리 완료 통보 및 실시간 주문 현황 Display",
                color: "bg-red-500",
                href: "/display"
              },
              {
                icon: Settings,
                title: "통합 관리자",
                desc: "전체 시스템 설정, 메뉴 구성 및 통계 분석",
                color: "bg-purple-500",
                href: "/admin"
              },
              {
                icon: Activity,
                title: "실시간 모니터링",
                desc: "데이터 흐름을 한눈에 보는 시스템 플로우 뷰",
                color: "bg-indigo-500",
                href: "/flow"
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                className="card-premium group"
              >
                <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <item.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-dark mb-3">{item.title}</h3>
                <p className="text-dark/60 text-sm mb-6 leading-relaxed">
                  {item.desc}
                </p>
                <Link href={item.href} className="text-primary font-bold text-sm flex items-center gap-1 group/link">
                  체험하기 <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Scenario Section */}
        <section className="bg-white py-24 border-y border-gray-100">
          <div className="section-container">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <Activity size={24} />
                </div>
                <h2 className="text-3xl font-black text-dark">추천 데모 시나리오</h2>
              </div>
              <p className="text-dark/60 font-medium">시스템 간의 연동을 가장 잘 확인할 수 있는 방법입니다.</p>
            </div>
            
            <div className="space-y-6 max-w-4xl mx-auto">
              {[
                {
                  title: "시나리오 1: 쿠폰 사용 주문",
                  desc: "고객앱에서 쿠폰 확인 → 키오스크 메뉴 선택 → 쿠폰 적용 → 주방 조리 → 알림판 호출"
                },
                {
                  title: "시나리오 2: 관리자 모니터링",
                  desc: "관리자에서 대시보드 확인 → 새 쿠폰 생성 → 메뉴 관리 → 주문 현황 실시간 감시"
                }
              ].map((s, i) => (
                <div key={i} className="flex gap-4 p-6 rounded-2xl bg-secondary-light border border-gray-100 hover:border-primary/20 transition-colors">
                  <div className="mt-1">
                    <CheckCircle2 className="text-primary" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-dark mb-1">{s.title}</h4>
                    <p className="text-dark/70 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Warning Section */}
        <section className="section-container py-24">
          <div className="bg-secondary p-8 md:p-12 rounded-3xl border border-secondary-dark relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
              <AlertCircle size={120} className="text-dark" />
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-black text-dark mb-6 flex items-center gap-2">
                <AlertCircle size={28} className="text-primary" />
                알려드립니다
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "데모/프로토타입 목적으로 제작되었습니다.",
                  "실제 결제나 개인정보 처리는 포함되지 않습니다.",
                  "데이터는 브라우저 LocalStorage에만 저장됩니다.",
                  "캐시 삭제 시 모든 데이터가 초기화될 수 있습니다.",
                  "여러 창을 띄워 실시간 동기화를 확인할 수 있습니다."
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-3 text-dark/70 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="section-container text-center pt-12">
          <h2 className="text-2xl font-bold text-dark mb-8">🚀 지금 버거 에코시스템을 경험해보세요</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/customer" className="btn btn-primary px-10 py-4 shadow-xl shadow-primary/20 scale-110">
              시작하기
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
