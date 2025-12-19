'use client';

import { Suspense, useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Menu } from '@/types/index';
import { localStorageManager } from '@/lib/localStorage';
import { useKioskStore } from '@/lib/stores/kioskStore';
import { validateMenuOptions } from '@/lib/utils/validation';
import { formatPrice } from '@/lib/utils/format';
import { getMenuImageUrl } from '@/lib/utils/unsplashImages';
import { OptimizedImage } from '@/components/shared/OptimizedImage';
import { EmptyState } from '@/components/shared/EmptyState';
import { AlertCircle, Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react';

function MenuDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const menuId = searchParams.get('id');

  const [menu, setMenu] = useState<Menu | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const addToCart = useKioskStore((state) => state.addToCart);

  useEffect(() => {
    if (!menuId) {
      setLoading(false);
      return;
    }

    const menu = localStorageManager.getMenu(menuId);
    setMenu(menu);
    setLoading(false);

    // 필수 옵션 자동 선택 (첫 번째 선택지)
    if (menu) {
      const defaultOptions: string[] = [];
      menu.options.forEach((opt) => {
        if (opt.type === 'REQUIRED' && opt.choices.length > 0) {
          defaultOptions.push(opt.choices[0].id);
        }
      });
      setSelectedOptions(defaultOptions);
    }
  }, [menuId]);

  // 가격 계산
  const totalPrice = useMemo(() => {
    if (!menu) return 0;

    let price = menu.price;

    selectedOptions.forEach((optionId) => {
      const choice = menu.options
        .flatMap((opt) => opt.choices)
        .find((c) => c.id === optionId);
      if (choice) {
        price += choice.price;
      }
    });

    return price * quantity;
  }, [menu, selectedOptions, quantity]);

  const handleOptionChange = (optionId: string, isSelected: boolean) => {
    const option = menu!.options.find((opt) =>
      opt.choices.some((c) => c.id === optionId)
    );

    if (!option) return;

    if (option.type === 'REQUIRED') {
      // 필수 옵션은 단일 선택
      setSelectedOptions(
        selectedOptions.filter((id) => !option.choices.some((c) => c.id === id))
      );
      if (isSelected) {
        setSelectedOptions([...selectedOptions, optionId]);
      }
    } else {
      // 선택 옵션은 다중 선택
      if (isSelected) {
        setSelectedOptions([...selectedOptions, optionId]);
      } else {
        setSelectedOptions(selectedOptions.filter((id) => id !== optionId));
      }
    }
  };

  const handleAddToCart = () => {
    if (!menu) return;

    const validation = validateMenuOptions(menu, selectedOptions);
    if (!validation.valid) {
      setError(validation.error || '옵션을 다시 확인해주세요');
      return;
    }

    const optionDetails = selectedOptions.map((optionId) => {
      const choice = menu.options
        .flatMap((opt) => opt.choices)
        .find((c) => c.id === optionId);
      return choice?.name || '';
    });

    addToCart({
      menuId: menu.id,
      menuName: menu.name,
      quantity,
      selectedOptions: optionDetails,
      price: totalPrice,
    });

    router.push('/kiosk');
  };

  if (loading) {
    return <div className="text-center py-12">로딩 중...</div>;
  }

  if (!menuId || !menu) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="메뉴를 찾을 수 없습니다"
        action={{ label: '메뉴 보기', onClick: () => router.push('/kiosk') }}
      />
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => router.push('/kiosk')}
        className="flex items-center gap-2 text-gray-600 mb-6 hover:text-primary transition-colors"
      >
        <ArrowLeft size={20} />
        <span>돌아가기</span>
      </button>

      {/* 메뉴 이미지 */}
      <div className="w-full h-60 bg-gradient-to-br from-secondary to-yellow-50 rounded-lg mb-6 overflow-hidden relative">
        <OptimizedImage
          src={getMenuImageUrl(menu.id)}
          alt={menu.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* 메뉴 정보 */}
      <h1 className="text-3xl font-bold text-dark mb-2">{menu.name}</h1>
      <p className="text-2xl font-bold text-primary mb-6">
        {formatPrice(menu.price)}
      </p>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {/* 옵션 */}
      <div className="space-y-6 mb-8">
        {menu.options.map((option) => (
          <div key={option.id}>
            <h3 className="font-semibold text-gray-800 mb-3">
              {option.name}
              {option.type === 'REQUIRED' && <span className="text-red-600"> *</span>}
            </h3>

            <div className="space-y-2">
              {option.choices.map((choice) => {
                const isSelected = selectedOptions.includes(choice.id);
                const inputType = option.type === 'REQUIRED' ? 'radio' : 'checkbox';
                const inputName = `option-${option.id}`;

                return (
                  <label
                    key={choice.id}
                    className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary hover:bg-gray-50 transition-all font-medium"
                  >
                    <input
                      type={inputType}
                      name={inputName}
                      checked={isSelected}
                      onChange={(e) => handleOptionChange(choice.id, e.target.checked)}
                      className="w-5 h-5 cursor-pointer accent-primary"
                    />
                    <span className="flex-1 ml-3 text-gray-800">
                      {choice.name}
                    </span>
                    {choice.price > 0 && (
                      <span className="text-primary font-bold">
                        +{formatPrice(choice.price)}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 수량 선택 */}
      <div className="flex items-center justify-between bg-white rounded-xl p-4 mb-8 border border-gray-200 shadow-sm">
        <span className="font-bold text-gray-800">수량 선택</span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <Minus size={20} className="text-gray-600" />
          </button>
          <span className="text-2xl font-black w-8 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(99, quantity + 1))}
            className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <Plus size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* 가격 요약 */}
      <div className="bg-secondary p-6 rounded-2xl mb-8 border border-secondary-dark shadow-sm">
        <div className="flex justify-between items-center mb-1">
          <span className="text-dark/60 font-medium">선택 상품가</span>
          <span className="font-semibold text-dark">{formatPrice(menu.price * quantity)}</span>
        </div>
        <div className="flex justify-between items-center text-xl font-black pt-4 border-t border-dark/10">
          <span className="text-dark">총 주문금액</span>
          <span className="text-primary">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      {/* 버튼 */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => router.push('/kiosk')}
          className="h-14 bg-white text-gray-600 border border-gray-200 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors"
        >
          돌아가기
        </button>
        <button
          onClick={handleAddToCart}
          className="h-14 bg-primary text-white rounded-xl font-bold text-lg hover:bg-red-700 transition-shadow shadow-lg shadow-primary/20 active:scale-95 flex items-center justify-center gap-2"
        >
          <ShoppingCart size={22} />
          장바구니 담기
        </button>
      </div>
    </div>
  );
}

export default function MenuDetailPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">로딩 중...</div>}>
      <MenuDetailContent />
    </Suspense>
  );
}
