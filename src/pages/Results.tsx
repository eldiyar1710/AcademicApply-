import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Trophy, BookOpen, ExternalLink, Star, GraduationCap, Lightbulb, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { universityData } from "@/data/universities";
import { getUser, isAuthed } from "@/lib/auth";
import { getLastResultsQuery } from "@/lib/results";
import { getWishlist, toggleWishlist } from "@/lib/wishlist";

type Career = {
  title: string;
  trend: string;
  salary: string;
  match: number;
  description: string;
  futureYears: string;
};

const mockCareers: Career[] = [
  { title: "Data Scientist", trend: "Топ профессия 2025–2035", salary: "$80K–$150K", match: 95, description: "Анализ данных, машинное обучение, статистика", futureYears: "10+ лет высокого спроса" },
  { title: "Software Engineer", trend: "Стабильный рост", salary: "$70K–$130K", match: 90, description: "Разработка приложений, веб-систем и сервисов", futureYears: "Актуально всегда" },
  { title: "AI/ML Engineer", trend: "Высокий спрос", salary: "$90K–$160K", match: 85, description: "Создание и обучение искусственного интеллекта", futureYears: "15+ лет роста" },
  { title: "UX/UI Designer", trend: "Креативная сфера", salary: "$50K–$100K", match: 75, description: "Дизайн интерфейсов и пользовательского опыта", futureYears: "Стабильный спрос" },
  { title: "Business Analyst", trend: "Спрос в корпорациях", salary: "$55K–$120K", match: 82, description: "Анализ бизнеса, финмодели, исследования рынка", futureYears: "10+ лет роста" },
  { title: "Financial Analyst", trend: "Финансы и инвестиции", salary: "$60K–$140K", match: 78, description: "Оценка компаний, инвестиции, риск-менеджмент", futureYears: "Стабильно" },
  { title: "Biomedical Engineer", trend: "На стыке медицины и IT", salary: "$65K–$130K", match: 80, description: "Медицинские устройства, биоинформатика", futureYears: "Быстрый рост" },
  { title: "Public Health Specialist", trend: "Социально значимо", salary: "$50K–$110K", match: 74, description: "Здравоохранение, аналитика, стратегии", futureYears: "Стабильно" },
];

const keywordToDomain: Array<{ keyword: string; domain: "it" | "business" | "medicine" | "design" }> = [
  { keyword: "информ", domain: "it" },
  { keyword: "computer", domain: "it" },
  { keyword: "data", domain: "it" },
  { keyword: "informatics", domain: "it" },
  { keyword: "engineering", domain: "it" },
  { keyword: "эконом", domain: "business" },
  { keyword: "finance", domain: "business" },
  { keyword: "business", domain: "business" },
  { keyword: "management", domain: "business" },
  { keyword: "medicine", domain: "medicine" },
  { keyword: "biomed", domain: "medicine" },
  { keyword: "life", domain: "medicine" },
  { keyword: "public health", domain: "medicine" },
  { keyword: "design", domain: "design" },
  { keyword: "architecture", domain: "design" },
];

const inferDomains = (interests: string[], skills: string[]) => {
  const domains = new Set<string>();
  const joined = [...interests, ...skills].join(" ").toLowerCase();
  if (joined.includes("информатика") || joined.includes("программ") || joined.includes("данн")) domains.add("it");
  if (joined.includes("эконом") || joined.includes("бизнес")) domains.add("business");
  if (joined.includes("медицин")) domains.add("medicine");
  if (joined.includes("дизайн") || joined.includes("искусство")) domains.add("design");
  return Array.from(domains) as Array<"it" | "business" | "medicine" | "design">;
};

const domainCareers: Record<string, string[]> = {
  it: ["Data Scientist", "Software Engineer", "AI/ML Engineer"],
  business: ["Business Analyst", "Financial Analyst"],
  medicine: ["Biomedical Engineer", "Public Health Specialist"],
  design: ["UX/UI Designer"],
};

const typeLabels: Record<string, { text: string; color: string }> = {
  grant: { text: "Грант", color: "bg-accent text-accent-foreground" },
  paid: { text: "Платное", color: "bg-secondary text-secondary-foreground" },
  partial: { text: "Частичный грант", color: "bg-primary text-primary-foreground" },
};

const Results = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userType = searchParams.get("type") || "school";
  const user = getUser();

  const preferredCareer = (searchParams.get("preferred_career") || "").trim();

  const interests = (searchParams.get("interests") || "").split(",").map((s) => s.trim()).filter(Boolean);
  const skills = (searchParams.get("skills") || "").split(",").map((s) => s.trim()).filter(Boolean);
  const domains = inferDomains(interests, skills);
  const baseCareerTitles = domains.length
    ? Array.from(new Set(domains.flatMap((d) => domainCareers[d] || [])))
    : ["Data Scientist", "Software Engineer", "AI/ML Engineer", "UX/UI Designer", "Business Analyst", "Financial Analyst", "Biomedical Engineer", "Public Health Specialist"];

  const selectedCareerTitles = preferredCareer && preferredCareer !== "Пока не знаю"
    ? Array.from(new Set([preferredCareer, ...baseCareerTitles]))
    : baseCareerTitles;

  const careers = mockCareers
    .filter((c) => selectedCareerTitles.includes(c.title))
    .sort((a, b) => {
      if (!preferredCareer || preferredCareer === "Пока не знаю") return b.match - a.match;
      if (a.title === preferredCareer) return -1;
      if (b.title === preferredCareer) return 1;
      return b.match - a.match;
    });

  const hasGpa = Boolean(user?.profile.gpa && user.profile.gpa.trim().length > 0);
  const hasIelts = Boolean(user?.profile.ielts && user.profile.ielts.trim().length > 0);
  const enriched = hasGpa && hasIelts;

  const selectedCountries = (searchParams.get("country") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const budgetPref = (searchParams.get("budget") || "").trim();
  const desiredTypes: Array<(typeof universityData)[number]["type"]> = (() => {
    if (budgetPref === "Только бесплатно (грант / стипендия)") return ["grant"];
    if (budgetPref === "Готов платить частично") return ["grant", "partial"];
    if (budgetPref === "Платное обучение — не проблема") return ["paid", "partial", "grant"];
    if (budgetPref === "Хочу найти грант, но рассмотрю и платное") return ["grant", "partial", "paid"];
    return ["grant", "partial", "paid"];
  })();

  const normalizeCountry = (c: string) => c.toLowerCase().replace(/\s+/g, " ").trim();
  const countryAliases: Record<string, string[]> = {
    "южная корея / япония": ["южная корея", "япония"],
    "не имеет значения": [],
  };

  const expandedSelectedCountries = (() => {
    const norm = selectedCountries.map(normalizeCountry);
    const expanded: string[] = [];
    for (const c of norm) {
      const alias = countryAliases[c];
      if (alias) expanded.push(...alias);
      else expanded.push(c);
    }
    return Array.from(new Set(expanded)).filter(Boolean);
  })();

  const hasCountryPreference = expandedSelectedCountries.length > 0;
  const scoreUniversity = (u: (typeof universityData)[number]) => {
    const base = u.match;
    const typeBoost = desiredTypes.includes(u.type) ? 8 : -6;
    const countryBoost = !hasCountryPreference
      ? 0
      : expandedSelectedCountries.includes(normalizeCountry(u.country))
      ? 10
      : -4;
    return base + typeBoost + countryBoost;
  };

  const rankedUniversities = [...universityData]
    .map((u) => ({ u, score: scoreUniversity(u) }))
    .sort((a, b) => b.score - a.score)
    .map(({ u }) => u);

  const strictFiltered = rankedUniversities.filter((u) => {
    const typeOk = desiredTypes.includes(u.type);
    const countryOk = !hasCountryPreference || expandedSelectedCountries.includes(normalizeCountry(u.country));
    return typeOk && countryOk;
  });

  const usedFallback = strictFiltered.length < 4 && (hasCountryPreference || budgetPref.length > 0);
  const finalRanked = strictFiltered.length >= 4 ? strictFiltered : rankedUniversities;
  const visibleUniversities = enriched ? finalRanked : finalRanked.slice(0, 4);

  const graduateChosen = searchParams.get("graduate_chosen") || "";
  const graduateDeadline = searchParams.get("graduate_deadline") || "";
  const graduateDeadlineWindow = searchParams.get("graduate_deadline_window") || "";
  const graduateDocs = (searchParams.get("graduate_docs") || "").split(",").map((s) => s.trim()).filter(Boolean);
  const graduateTargetCountries = (searchParams.get("graduate_target_country") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const showGraduateChecklist =
    userType === "graduate" &&
    (graduateChosen === "Да, уже выбрал(а)" || graduateChosen === "Частично (есть страны/варианты)");

  const domainFilteredPrograms = (uniPrograms: { name: string }[]) => {
    if (!domains.length) return uniPrograms;
    const res = uniPrograms.filter((p) => {
      const name = p.name.toLowerCase();
      const found = keywordToDomain.find((k) => name.includes(k.keyword));
      return found ? domains.includes(found.domain) : true;
    });
    return res.length ? res : uniPrograms;
  };

  useEffect(() => {
    if (searchParams.toString().length > 0) return;
    const saved = getLastResultsQuery();
    if (!saved) return;
    navigate(`/results?${saved}`, { replace: true });
  }, [navigate, searchParams]);

  useEffect(() => {
    if (isAuthed()) return;
    navigate(`/paywall?${searchParams.toString()}`);
  }, [navigate, searchParams]);

  const userTypeLabel = userType === "school" ? "школьника" : userType === "graduate" ? "выпускника" : "студента";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* User type banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-xl bg-primary/5 border border-primary/10 mb-10 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-foreground">
                Персональные рекомендации для {userTypeLabel}
              </h2>
              <p className="text-sm text-muted-foreground">
                На основе ваших навыков, интересов и целей. Актуальные профессии на ближайшие 10 лет.
              </p>
            </div>
          </motion.div>

          {/* Careers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                <Star className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h2 className="text-2xl font-heading font-bold text-foreground">Рекомендованные профессии</h2>
                <p className="text-muted-foreground text-sm">Актуальные на ближайшие десятилетия</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {careers.map((career, i) => (
                <motion.div
                  key={career.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  className="p-5 rounded-xl bg-card shadow-card border border-border/50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-heading font-semibold text-foreground">{career.title}</h3>
                      <p className="text-xs text-muted-foreground">{career.trend}</p>
                    </div>
                    <Badge className="bg-primary text-primary-foreground">{career.match}%</Badge>
                  </div>
                  {preferredCareer && preferredCareer !== "Пока не знаю" && career.title === preferredCareer && (
                    <div className="mb-2">
                      <Badge variant="secondary">Твой выбор</Badge>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mb-3">{career.description}</p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="text-foreground font-medium">{career.salary}</span>
                    <span className="text-muted-foreground">{career.futureYears}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Skills gap notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 rounded-xl bg-secondary/5 border border-secondary/10 flex items-center gap-4"
            >
              <BookOpen className="w-5 h-5 text-secondary flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-foreground font-medium">Есть пробелы в знаниях?</p>
                <p className="text-xs text-muted-foreground">Мы подобрали курсы для подготовки к поступлению</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/courses")} className="gap-1.5 flex-shrink-0">
                Курсы <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </motion.div>

            {!enriched && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10"
              >
                <p className="text-sm text-foreground font-medium">Хочешь больше вариантов вузов?</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Заполни GPA и IELTS в профиле — мы покажем больше программ и точнее ранжирование.
                </p>
                <div className="mt-3">
                  <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}>
                    Заполнить профиль
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Universities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-heading font-bold text-foreground">Подходящие университеты</h2>
                <p className="text-muted-foreground text-sm">Ранжированы по совпадению с вашим профилем</p>
              </div>
            </div>

            <div className="mb-4 space-y-3">
              <div className="p-4 rounded-xl bg-card border border-border/50 shadow-card">
                <p className="text-sm text-foreground font-medium">Почему эти вузы?</p>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>
                    Страны: {hasCountryPreference ? expandedSelectedCountries.join(", ") : "не ограничивали"}
                  </div>
                  <div>
                    Бюджет: {budgetPref.length > 0 ? budgetPref : "не указан"}
                  </div>
                  <div>
                    GPA: {hasGpa ? "учли" : "не заполнен"}
                  </div>
                  <div>
                    IELTS: {hasIelts ? "учли" : "не заполнен"}
                  </div>
                </div>
              </div>

              {usedFallback && (
                <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/10">
                  <p className="text-sm text-foreground font-medium">Мы расширили выбор</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    По твоим строгим фильтрам (страны/бюджет) нашлось мало вариантов, поэтому мы добавили похожие программы, чтобы было из чего выбирать.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {visibleUniversities.map((uni, i) => (
                <motion.div
                  key={uni.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="p-6 rounded-xl bg-card shadow-card border border-border/50 hover:shadow-card-hover transition-shadow cursor-pointer"
                  onClick={() => navigate(`/university/${uni.id}`)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-heading font-bold text-foreground">{uni.name}</h3>
                        <Badge className={typeLabels[uni.type].color}>
                          {typeLabels[uni.type].text}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {uni.city}, {uni.country}
                        </span>
                        <span className="flex items-center gap-1">
                          <Trophy className="w-3.5 h-3.5" /> {uni.ranking}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {domainFilteredPrograms(uni.programs).slice(0, 4).map((p) => (
                          <span key={p.name} className="px-2.5 py-1 rounded-md bg-primary/5 text-primary text-xs font-medium">
                            {p.name}
                          </span>
                        ))}
                        {domainFilteredPrograms(uni.programs).length > 4 && (
                          <span className="px-2.5 py-1 rounded-md bg-muted text-muted-foreground text-xs">
                            +{domainFilteredPrograms(uni.programs).length - 4}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <BookOpen className="w-3.5 h-3.5" />
                        {uni.requirements.slice(0, 2).map((r) => r.title).join(", ")}
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-center">
                        <div className="text-3xl font-heading font-bold text-primary">{uni.match}%</div>
                        <div className="text-xs text-muted-foreground">совпадение</div>
                      </div>
                      <Button size="sm" className="gap-1.5">
                        Подробнее <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16 text-center p-8 rounded-2xl bg-primary/5 border border-primary/10"
          >
            <h3 className="text-xl font-heading font-bold text-foreground mb-2">
              {userType === "student"
                ? "Хочешь перевестись или учиться по обмену?"
                : "Хочешь поступить в один из этих университетов?"}
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Выбери университет выше и мы подготовим все документы за тебя
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button variant="outline" onClick={() => navigate("/courses")} className="gap-2">
                <BookOpen className="w-4 h-4" /> Подготовительные курсы
              </Button>
              <Button size="lg" className="gap-2" onClick={() => navigate("/tracking")}>
                <GraduationCap className="w-4 h-4" /> Мои заявки
              </Button>
            </div>
          </motion.div>

          {showGraduateChecklist && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              className="mt-6 p-6 rounded-2xl bg-card border border-border/50 shadow-card"
            >
              <h3 className="text-lg font-heading font-bold text-foreground mb-2">Чеклист подачи документов</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {graduateTargetCountries.length > 0
                  ? `Фокус страны: ${graduateTargetCountries.join(", ")}`
                  : "Фокус страны: не выбран"}
              </p>

              <div className="space-y-2 text-sm text-foreground">
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">1.</span>
                  <span>
                    {graduateDeadline
                      ? `Дедлайн: ${graduateDeadline}${graduateDeadlineWindow ? ` (${graduateDeadlineWindow})` : ""}. Проверь на сайте вуза.`
                      : "Проверь дедлайн на сайте вуза/программы и запиши дату (это ключевой шаг)."}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">2.</span>
                  <span>
                    {graduateDocs.includes("IELTS/TOEFL")
                      ? "Английский: тест уже есть — проверь минимальный балл под программу."
                      : "Английский: запланируй IELTS/TOEFL. Для большинства программ цель 6.5+."}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">3.</span>
                  <span>
                    {graduateDocs.includes("Мотивационное письмо")
                      ? "Мотивационное письмо: готово — адаптируй под каждую программу (1–2 версии)."
                      : "Сделай мотивационное письмо: 1 страница, почему ты и почему эта программа."}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">4.</span>
                  <span>
                    {graduateDocs.includes("Рекомендации")
                      ? "Рекомендации: уже есть — проверь формат/язык и дедлайн загрузки."
                      : "Попроси 1–2 рекомендации (учитель/куратор). Лучше начать заранее."}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">5.</span>
                  <span>
                    {graduateDocs.includes("Паспорт")
                      ? "Паспорт: ок. Если страна требует визу — проверь сроки записи/подачи."
                      : "Сделай/обнови паспорт: без него подача/виза могут затянуться."}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" onClick={() => navigate("/tracking")}>
                  Открыть мои заявки
                </Button>
              </div>
            </motion.div>
          )}

          {/* Mini plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-6 p-6 rounded-2xl bg-card border border-border/50 shadow-card"
          >
            <h3 className="text-lg font-heading font-bold text-foreground mb-2">Твой мини‑план на 30 дней</h3>
            {user?.profile.dream && user.profile.dream.trim().length > 0 && (
              <p className="text-sm text-muted-foreground mb-3">
                Твоя цель: <span className="text-foreground font-medium">{user.profile.dream}</span>
              </p>
            )}
            <div className="space-y-2 text-sm text-foreground">
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground">1.</span>
                <span>
                  {hasIelts
                    ? `Английский подтверждён (IELTS: ${user?.profile.ielts}). Собери требования выбранных программ.`
                    : "Сфокусируйся на английском: цель IELTS 6.5+ (для топ‑вузов чаще требуется 6.5)."}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground">2.</span>
                <span>
                  {preferredCareer === "Financial Analyst" || preferredCareer === "Business Analyst"
                    ? "Сделай упор на математику/статистику и базовую экономику: микроэкономика + Excel/данные."
                    : preferredCareer === "Biomedical Engineer" || preferredCareer === "Public Health Specialist"
                    ? "Сделай упор на биологию/химию + основы статистики и академическое письмо."
                    : preferredCareer === "UX/UI Designer"
                    ? "Подготовь портфолио: 3–5 проектов + описание процесса и кейсы."
                    : preferredCareer === "AI/ML Engineer" || preferredCareer === "Data Scientist"
                    ? "Подтяни математику/статистику и Python: основы ML + проекты в портфолио."
                    : preferredCareer === "Software Engineer"
                    ? "Подтяни базовое программирование: алгоритмы, структуры данных и 2–3 проекта."
                    : domains.includes("business")
                    ? "Добавь базу по экономике/математике: микроэкономика + статистика."
                    : domains.includes("medicine")
                    ? "Сделай упор на биологию/химию и академическое письмо."
                    : domains.includes("design")
                    ? "Подготовь портфолио: 3–5 проектов + описание процесса."
                    : "Подтяни математику и базовое программирование (если идёшь в IT/Data)."}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground">3.</span>
                <span>
                  Если целишься в топ‑программы (NU/США/Канада) — проверь, нужен ли SAT/ACT, и начни подготовку по математике.
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Results;

