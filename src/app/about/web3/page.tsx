"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Coins, Shield, TrendingUp, Lock, Layers, Zap, ArrowRight } from "lucide-react";
import { BackButton } from "../components/BackButton";
import { SectionHeader } from "../components/SectionHeader";
import { useState } from "react";

export default function Web3Page() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-green-400" />,
      title: "Безопасность",
      text: "Смарт-контракты на блокчейне гарантируют прозрачность и защиту всех транзакций. Никаких посредников — полный аудит.",
      fullContent: (
        <div className="space-y-6 text-gray-300 leading-relaxed mt-6">
          <p className="text-lg">
            Смарт-контракты на блокчейне гарантируют <span className="text-green-400 font-semibold">прозрачность и защиту</span> всех транзакций.
            Никаких посредников — полный аудит и контроль на уровне протокола.
          </p>

          <p>
            Каждое действие — от выпуска токена до распределения дивидендов — фиксируется в блокчейне и{" "}
            <span className="text-green-400 font-semibold">доступно для проверки всеми участниками</span>.
            Это исключает человеческий фактор, подмену данных и мошеннические операции.
          </p>

          <p>
            FODI использует <span className="text-green-400 font-semibold">audit-ready инфраструктуру</span> и поддерживает интеграцию с внешними аудиторами через API.
            Система регулярно проводит автоматическое сканирование уязвимостей и обновление ключей безопасности.
          </p>

          <div className="mt-6 bg-black/40 border border-green-500/20 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Технологии безопасности
            </h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-green-400 text-lg">•</span>
                <span><strong className="text-white">EVM-совместимые контракты</strong> с многоуровневой верификацией</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 text-lg">•</span>
                <span><strong className="text-white">End-to-end шифрование</strong> пользовательских данных</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 text-lg">•</span>
                <span><strong className="text-white">Zero Trust архитектура</strong> доступа</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 text-lg">•</span>
                <span><strong className="text-white">Автоматический аудит операций</strong> AI-модулем</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pl-6 border-l-4 border-green-500/50 bg-green-950/20 rounded-r-xl p-4">
            <p className="text-gray-300 italic">
              💬 Безопасность — это не опция, а <span className="text-green-400 font-semibold">базовый слой доверия</span> в цифровой экономике FODI.
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-blue-400" />,
      title: "Инвестиции",
      text: "Поддерживайте реальные бизнесы, покупая их токены и получая долю в их успехе.",
      fullContent: (
        <div className="space-y-6 text-gray-300 leading-relaxed mt-6">
          <p className="text-lg">
            FODI Market открывает новую форму инвестиционной активности — <span className="text-blue-400 font-semibold">токенизированное участие в реальной экономике</span>.
            Каждое кафе, школа, магазин или сервис может выпустить свой токен, а пользователи — приобрести его, тем самым становясь соинвесторами бренда.
          </p>

          <p>
            Система AI-анализирует показатели бизнеса (выручку, рост, активность клиентов) и автоматически корректирует рейтинг и токеномическую оценку.
            Это делает инвестиции <span className="text-blue-400 font-semibold">прозрачными, справедливыми и управляемыми данными</span>, а не эмоциями рынка.
          </p>

          <div className="mt-6 bg-black/40 border border-blue-500/20 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Преимущества для инвесторов
            </h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 text-lg">•</span>
                <span><strong className="text-white">Прямая поддержка</strong> малого и среднего бизнеса</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 text-lg">•</span>
                <span><strong className="text-white">Доход</strong> в виде токенов и дивидендов</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 text-lg">•</span>
                <span><strong className="text-white">Прозрачная аналитика</strong> эффективности</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 text-lg">•</span>
                <span><strong className="text-white">Возможность перепродажи</strong> токенов на FODI Exchange</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 bg-gradient-to-r from-blue-900/20 to-cyan-900/10 border border-blue-500/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-blue-400 mb-3">
              📊 Модель "Инвестируй и участвуй"
            </h4>
            <p className="text-gray-300">
              Инвесторы не просто вкладывают средства — они становятся частью экосистемы, влияя на развитие брендов через{" "}
              <span className="text-blue-400 font-semibold">DAO-механизмы и голосование</span> по ключевым решениям.
            </p>
          </div>

          <div className="mt-4 pl-6 border-l-4 border-blue-500/50 bg-blue-950/20 rounded-r-xl p-4">
            <p className="text-gray-300 italic">
              💬 Инвестиции в FODI — это вклад не только в бизнес, но и в <span className="text-blue-400 font-semibold">будущее цифровой экономики</span>.
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: "Ликвидность",
      text: "Обменивайте токены мгновенно через встроенные DEX-протоколы без посредников и высоких комиссий.",
      fullContent: (
        <div className="space-y-6 text-gray-300 leading-relaxed mt-6">
          <p className="text-lg">
            В экосистеме FODI Market ликвидность — это не просто обмен токенов, а целая{" "}
            <span className="text-yellow-400 font-semibold">сеть взаимосвязанных пулов и смарт-контрактов</span>, 
            обеспечивающих стабильное движение капитала между бизнесами и пользователями.
          </p>

          <p>
            Каждый токен, выпущенный бизнесом, автоматически подключается к{" "}
            <span className="text-yellow-400 font-semibold">FODI Liquidity Hub</span> — распределённому DEX-уровню, 
            интегрированному с ведущими Web3-протоколами.
            Это позволяет мгновенно обменивать токены между собой или на основные криптоактивы (USDT, ETH, SOL) без участия централизованных посредников.
          </p>

          <div className="mt-6 bg-black/40 border border-yellow-500/20 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Особенности системы ликвидности FODI
            </h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 text-lg">•</span>
                <span>Поддержка пулов на базе <strong className="text-white">AMM</strong> (Automated Market Maker)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 text-lg">•</span>
                <span><strong className="text-white">Минимальные комиссии</strong> и высокая пропускная способность</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 text-lg">•</span>
                <span>Интеграция с <strong className="text-white">мультичейн-инфраструктурой</strong> (Ethereum, Solana, Polygon)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 text-lg">•</span>
                <span><strong className="text-white">AI-мониторинг ликвидности</strong> для предотвращения перекосов и манипуляций</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 bg-gradient-to-r from-yellow-900/20 to-orange-900/10 border border-yellow-500/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-yellow-400 mb-3">
              📈 Преимущества для бизнеса и пользователей
            </h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-yellow-400">→</span>
                <span><strong className="text-white">Мгновенная конвертация</strong> активов</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400">→</span>
                <span>Возможность <strong className="text-white">выхода в фиат</strong> через партнёрские шлюзы</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400">→</span>
                <span>Стимулы за предоставление ликвидности (<strong className="text-white">Liquidity Mining</strong>)</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pl-6 border-l-4 border-yellow-500/50 bg-yellow-950/20 rounded-r-xl p-4">
            <p className="text-gray-300 italic">
              💬 Ликвидность — это <span className="text-yellow-400 font-semibold">кровь экосистемы FODI</span>.
              Она обеспечивает живое движение ценности между брендами, инвесторами и клиентами, формируя устойчивую цифровую экономику.
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: <Layers className="w-8 h-8 text-purple-400" />,
      title: "NFT сертификаты",
      text: "Каждый бизнес получает уникальный NFT, подтверждающий цифровую идентичность и право собственности.",
      fullContent: (
        <div className="space-y-6 text-gray-300 leading-relaxed mt-6">
          <p className="text-lg">
            В экосистеме FODI Market NFT — это не просто коллекционный актив, а{" "}
            <span className="text-purple-400 font-semibold">цифровой паспорт бизнеса</span>, зафиксированный в блокчейне.
            Он подтверждает право владения, историю транзакций и уровень доверия внутри системы.
          </p>

          <p>
            Каждый NFT создаётся при регистрации компании и связывается с её метриками:
            доходом, активностью клиентов и рейтингом AI-аналитики.
            Этот токен становится <span className="text-purple-400 font-semibold">единым идентификатором бренда</span> в метавселенной FODI,
            открывая доступ к Web3-инструментам, партнёрствам и инвестиционным программам.
          </p>

          <div className="mt-6 bg-black/40 border border-purple-500/20 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Что включает NFT сертификат
            </h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-purple-400 text-lg">•</span>
                <span>Данные о владельце и <strong className="text-white">подтверждение регистрации</strong> бизнеса</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 text-lg">•</span>
                <span><strong className="text-white">Историю активности</strong> и транзакций</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 text-lg">•</span>
                <span><strong className="text-white">AI-профиль</strong> (оценка репутации, спроса и устойчивости)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 text-lg">•</span>
                <span>Подпись системы <strong className="text-white">Rust Gateway</strong> для гарантии подлинности</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 bg-gradient-to-r from-purple-900/20 to-pink-900/10 border border-purple-500/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-purple-400 mb-3">
              🔗 Преимущества NFT-сертификатов
            </h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-purple-400">→</span>
                <span><strong className="text-white">Защита бренда</strong> от подделок и фейков</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">→</span>
                <span>Возможность <strong className="text-white">продажи, передачи или наследования</strong> прав</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">→</span>
                <span>Доступ к <strong className="text-white">Web3-инструментам</strong> и бонусным программам</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">→</span>
                <span>Прозрачная <strong className="text-white">история доверия</strong> для инвесторов и клиентов</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pl-6 border-l-4 border-purple-500/50 bg-purple-950/20 rounded-r-xl p-4">
            <p className="text-gray-300 italic">
              💬 NFT в FODI — это не просто токен.
              Это <span className="text-purple-400 font-semibold">юридически значимый цифровой актив</span>, 
              соединяющий реальный бизнес с блокчейном.
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: <Coins className="w-8 h-8 text-orange-400" />,
      title: "Дивиденды",
      text: "Держатели токенов получают часть прибыли бизнеса или токен-вознаграждения за активное участие.",
      fullContent: (
        <div className="space-y-6 text-gray-300 leading-relaxed mt-6">
          <p className="text-lg">
            Система FODI Market делает распределение прибыли <span className="text-orange-400 font-semibold">прозрачным и автоматизированным</span>.
            Каждый токен, выпущенный бизнесом, связан со смарт-контрактом, который отслеживает его финансовые метрики и распределяет доход среди держателей в реальном времени.
          </p>

          <p>
            AI-модуль анализирует выручку, транзакции и активность клиентов, формируя справедливую модель{" "}
            <span className="text-orange-400 font-semibold">"Участвуй — получай"</span>.
            Чем больше пользователь взаимодействует с брендом — заказывает, оставляет отзывы, продвигает контент — тем выше его доля в распределении токенов.
          </p>

          <div className="mt-6 bg-black/40 border border-orange-500/20 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-orange-400 mb-4 flex items-center gap-2">
              <Coins className="w-5 h-5" />
              Формы вознаграждений
            </h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-orange-400 text-lg">💵</span>
                <span><strong className="text-white">Токен-дивиденды</strong> — автоматические выплаты держателям</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-400 text-lg">🎁</span>
                <span><strong className="text-white">Бонусы</strong> — вознаграждения за активность и лояльность</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-400 text-lg">🔄</span>
                <span><strong className="text-white">Реинвестирование</strong> — возможность направить дивиденды обратно в бизнес</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 bg-gradient-to-r from-orange-900/20 to-yellow-900/10 border border-orange-500/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-orange-400 mb-3">
              💡 Преимущества
            </h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-orange-400">→</span>
                <span><strong className="text-white">Прозрачная система выплат</strong> через смарт-контракты</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400">→</span>
                <span><strong className="text-white">Мотивация</strong> для постоянных клиентов и партнёров</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400">→</span>
                <span>Формирование устойчивого <strong className="text-white">цифрового сообщества</strong> бренда</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pl-6 border-l-4 border-orange-500/50 bg-orange-950/20 rounded-r-xl p-4">
            <p className="text-gray-300 italic">
              💬 Дивиденды в FODI — это <span className="text-orange-400 font-semibold">новый стандарт взаимодействия</span> бизнеса и пользователей,
              где каждый вклад в развитие бренда превращается в реальную ценность.
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: <Lock className="w-8 h-8 text-red-400" />,
      title: "Стейкинг и социальное участие",
      text: "Зарабатывайте пассивный доход, поддерживая сеть FODI — как через блокировку токенов, так и через активность в Web3-сообществе.",
      fullContent: (
        <div className="space-y-6 text-gray-300 leading-relaxed mt-6">
          <p className="text-lg">
            Теперь каждый пользователь может не только стейкать токены,
            но и получать вознаграждения за <span className="text-red-400 font-semibold">продвижение брендов и бизнеса</span> в метавселенной:
            делиться контентом, публиковать отзывы, участвовать в челленджах и продвигать FODI в соцсетях.
          </p>

          <p>
            📱 AI отслеживает активность через Web3-механику <span className="text-red-400 font-semibold">Proof-of-Engagement</span>,
            анализируя посты, лайки и взаимодействия, чтобы начислить справедливое вознаграждение.
          </p>

          <div className="mt-6 bg-black/40 border border-red-500/20 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Формы заработка
            </h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-red-400 text-lg">📢</span>
                <span><strong className="text-white">Social Staking</strong> — получай токены за посты, отзывы и репосты FODI</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 text-lg">🤝</span>
                <span><strong className="text-white">Referral Boost</strong> — бонусы за привлечение новых пользователей и бизнесов</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 text-lg">🧠</span>
                <span><strong className="text-white">AI Missions</strong> — индивидуальные задания от системы с наградами</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 text-lg">💰</span>
                <span><strong className="text-white">Liquidity Staking</strong> — классический пассивный доход за блокировку токенов</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 bg-gradient-to-r from-red-900/20 to-pink-900/10 border border-red-500/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-red-400 mb-3">
              ⚙️ Как это работает
            </h4>
            <ol className="space-y-2 text-gray-300 list-none">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">1.</span>
                <span>Привяжи свой профиль FODI к соцсетям</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">2.</span>
                <span>Участвуй в активностях, выполняй AI-задания</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">3.</span>
                <span>Получай токены FODI за каждый подтверждённый вклад</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">4.</span>
                <span>Повышай рейтинг и открывай новые уровни наград</span>
              </li>
            </ol>
          </div>

          <div className="mt-6 bg-black/30 border border-red-500/20 rounded-xl p-5">
            <h4 className="text-lg font-semibold text-red-400 mb-3">
              🌍 Преимущества Social Staking
            </h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-red-400">→</span>
                <span><strong className="text-white">Заработок без инвестиций</strong> — только за активность</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">→</span>
                <span><strong className="text-white">Прозрачная система наград</strong> через смарт-контракты</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">→</span>
                <span><strong className="text-white">Рост сообщества</strong> через органическое продвижение</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">→</span>
                <span>Интеграция с <strong className="text-white">Telegram, X (Twitter), TikTok и Instagram</strong></span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pl-6 border-l-4 border-red-500/50 bg-red-950/20 rounded-r-xl p-4">
            <p className="text-gray-300 italic">
              💬 FODI превращает <span className="text-red-400 font-semibold">социальную активность в цифровую ценность</span>.
              Каждый пост, отзыв или рекомендация — это вклад в развитие всей экосистемы.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a] text-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <BackButton />

        {/* HEADER */}
        <SectionHeader
          title="Web3 и токенизация FODI"
          subtitle="Каждый бизнес получает цифровой токен — отражение его активности, выручки и репутации."
        />

        {/* TOKENOMICS */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-10 bg-gradient-to-br from-[#151515] to-[#0a0a0a] border border-gray-800/50 rounded-2xl p-8 shadow-xl"
        >
          <h2 className="text-2xl font-bold text-white mb-4">🪙 Токеномика FODI</h2>
          <p className="text-gray-400 mb-4 leading-relaxed">
            <strong className="text-orange-400">FODI Token</strong> — основной цифровой актив экосистемы.
            Его стоимость формируется на основе метрик активности бизнеса: выручки, количества заказов и репутации.
          </p>

          <Link 
            href="/about/web3/token"
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold rounded-xl hover:from-orange-400 hover:to-yellow-300 transition-all hover:scale-105"
          >
            Подробнее о токене
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.section>

        {/* EXCHANGE */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-12 bg-gradient-to-br from-[#141414] to-[#0d0d0d] border border-gray-800/50 rounded-2xl p-8 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-white mb-4">⚡ Биржа FODI Exchange</h2>
          <p className="text-gray-400 leading-relaxed">
            В будущем пользователи смогут покупать, обменивать и стейкать бизнес-токены через встроенный Web3-маркетплейс
            с прозрачной торговлей и интеграцией с DEX-протоколами.
          </p>
        </motion.section>

        {/* FEATURES GRID */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 30px rgba(251, 146, 60, 0.3)",
              }}
              onClick={() => setExpandedCard(expandedCard === i ? null : i)}
              className={`p-8 border rounded-xl bg-[#111]/70 
                transition-all duration-300 backdrop-blur-sm shadow-lg 
                cursor-pointer
                ${expandedCard === i 
                  ? 'border-orange-400/70 shadow-orange-500/30 col-span-full' 
                  : 'border-gray-800 hover:border-orange-400/50 hover:shadow-orange-500/20'
                }`}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-black/50 rounded-xl border border-gray-700/50">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.text}</p>
                
                {feature.fullContent && (
                  <span className="text-orange-400 text-sm font-semibold">
                    {expandedCard === i ? '▲ Свернуть' : '▼ Подробнее'}
                  </span>
                )}
              </div>

              <AnimatePresence>
                {expandedCard === i && feature.fullContent && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5 }}
                    className="overflow-hidden"
                  >
                    {feature.fullContent}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </section>

        {/* HOW IT WORKS */}
        <section className="mt-20 bg-gradient-to-br from-orange-900/20 via-orange-800/10 to-yellow-700/10 border border-orange-500/30 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-white">Как это работает?</h2>
          <ol className="space-y-6 text-gray-300 leading-relaxed">
            <li>
              <span className="text-orange-400 font-semibold">1. Регистрация бизнеса</span> — владелец создаёт витрину и подключает аналитику.
            </li>
            <li>
              <span className="text-orange-400 font-semibold">2. Токенизация</span> — AI-система генерирует уникальный токен на основе метрик.
            </li>
            <li>
              <span className="text-orange-400 font-semibold">3. Торговля</span> — инвесторы покупают токены через FODI Exchange.
            </li>
            <li>
              <span className="text-orange-400 font-semibold">4. Доход</span> — держатели получают дивиденды от прибыли бизнеса.
            </li>
          </ol>
        </section>

        {/* CTA NAVIGATION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <Link
            href="/about/analytics"
            className="inline-flex items-center gap-3 px-8 py-4
              bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold
              rounded-xl shadow-lg hover:scale-105 transition-all duration-300"
          >
            Перейти к разделу <span className="font-bold">Аналитика и данные</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <p className="text-sm text-gray-500 mt-3">
            Следующий раздел:{" "}
            <span className="text-orange-400 font-semibold">Аналитика и данные</span> — AI-метрики и рост
          </p>
        </motion.div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-gray-800/50 mt-24 py-10 bg-[#0a0a0a]/80 backdrop-blur-sm text-center">
        <p className="text-gray-500 text-sm">
          © 2025{" "}
          <span className="text-orange-400 font-semibold">FODI MARKET</span> •  
          Метавселенная цифровых бизнесов
        </p>
      </footer>
    </div>
  );
}
