export type EventQuestionType = "single" | "multi";

export type EventQuestion = {
  id: string;
  question: string;
  type: EventQuestionType;
  options: string[];
};

export type EventTemplate = {
  slug: string;
  title: string;
  subtitle: string;
  expertName: string;
  expertRef: string;
  questions: EventQuestion[];
};

export const eventTemplates: EventTemplate[] = [
  {
    slug: "demo-forum",
    title: "Форум Academic Apply",
    subtitle: "Короткая анкета участника мероприятия",
    expertName: "Эксперт со сцены",
    expertRef: "exp_demo_01",
    questions: [
      {
        id: "grade",
        question: "В каком ты классе сейчас?",
        type: "single",
        options: ["8", "9", "10", "11", "1 курс колледжа"],
      },
      {
        id: "olympiads",
        question: "Участвовал(а) ли ты в олимпиадах/конкурсах?",
        type: "single",
        options: ["Да, есть призовые места", "Да, но без призов", "Нет"],
      },
      {
        id: "profile_subjects",
        question: "Какие профильные предметы у тебя сильнее всего?",
        type: "multi",
        options: ["Математика", "Физика", "Информатика", "Биология/Химия", "Экономика"],
      },
    ],
  },
  {
    slug: "nis-almaty",
    title: "NIS Алматы — Career Day",
    subtitle: "Анкета для школьников NIS (олимпиады, профиль, планы)",
    expertName: "Айша — Admission эксперт",
    expertRef: "exp_nis_01",
    questions: [
      {
        id: "grade",
        question: "В каком ты классе сейчас?",
        type: "single",
        options: ["9", "10", "11", "12"],
      },
      {
        id: "track",
        question: "Какой у тебя профиль/трек?",
        type: "single",
        options: ["STEM", "Economics", "Humanities", "Не уверен(а)"],
      },
      {
        id: "achievements",
        question: "Какие достижения у тебя есть?",
        type: "multi",
        options: ["Олимпиады", "Проекты", "Волонтёрство", "Спорт", "Публикации", "Нет пока"],
      },
      {
        id: "countries",
        question: "Куда ты больше рассматриваешь поступление?",
        type: "multi",
        options: ["Казахстан", "США", "Великобритания", "Германия", "Корея", "Не решил(а)"],
      },
    ],
  },
  {
    slug: "it-lyceum-astana",
    title: "IT-лицей Астана — профориентация",
    subtitle: "Быстрая анкета (интересы + уровень подготовки)",
    expertName: "Данияр — IT mentor",
    expertRef: "exp_it_02",
    questions: [
      {
        id: "level",
        question: "Какой у тебя уровень программирования?",
        type: "single",
        options: ["Начинающий", "Средний", "Продвинутый", "Не программирую"],
      },
      {
        id: "stack",
        question: "Что тебе интереснее всего?",
        type: "multi",
        options: ["Web", "Mobile", "Data/AI", "Cybersecurity", "GameDev", "Robotics"],
      },
      {
        id: "english",
        question: "Какой у тебя английский сейчас?",
        type: "single",
        options: ["A2", "B1", "B2", "C1", "Не знаю"],
      },
    ],
  },
  {
    slug: "olymp-camp-2026",
    title: "Olymp Camp 2026",
    subtitle: "Анкета для участников олимпиадного лагеря",
    expertName: "Азамат — олимпиадный трек",
    expertRef: "exp_olymp_03",
    questions: [
      {
        id: "subject",
        question: "Какая олимпиада/предмет у тебя основной?",
        type: "single",
        options: ["Математика", "Физика", "Информатика", "Химия", "Биология"],
      },
      {
        id: "level",
        question: "Какой уровень достижений?",
        type: "single",
        options: ["Школьный", "Городской", "Республиканский", "Международный"],
      },
      {
        id: "goal",
        question: "Цель на этот год?",
        type: "single",
        options: ["Поступить на грант", "Уехать за рубеж", "Улучшить портфолио", "Пока изучаю"],
      },
      {
        id: "constraints",
        question: "Что больше ограничивает сейчас?",
        type: "multi",
        options: ["Английский", "Экзамены (SAT/IELTS)", "Документы", "Нет стратегии", "Бюджет"],
      },
    ],
  },
];

export const getEventTemplate = (slug: string) => eventTemplates.find((e) => e.slug === slug) || null;
