export type UniversityProgram = {
  name: string;
  degree: string;
  duration: string;
  tuition: string;
  grant: boolean;
};

export type Requirement = {
  title: string;
  detail: string;
};

export type PreparationCourse = {
  name: string;
  provider: string;
  duration: string;
  free: boolean;
};

export type UniversityFull = {
  id: string;
  name: string;
  country: string;
  city: string;
  ranking: string;
  match: number;
  type: "grant" | "paid" | "partial";
  founded: string;
  students: string;
  description: string;
  language: string;
  deadline: string;
  applicationFee: string;
  programs: UniversityProgram[];
  requirements: Requirement[];
  preparationCourses: PreparationCourse[];
};

export const universityData: UniversityFull[] = [
  {
    id: "nazarbayev",
    name: "Назарбаев Университет",
    country: "Казахстан",
    city: "Астана",
    ranking: "Топ-1 в Казахстане",
    match: 92,
    type: "grant",
    founded: "2010",
    students: "5,000+",
    description:
      "Назарбаев Университет — ведущий исследовательский университет Казахстана с международными стандартами обучения. Университет предлагает программы бакалавриата, магистратуры и докторантуры на английском языке. Партнёрство с университетами Кембриджа, Пенсильвании и Duke.",
    language: "Английский",
    deadline: "15 марта 2026",
    applicationFee: "Бесплатно",
    programs: [
      { name: "Computer Science", degree: "Бакалавр", duration: "4 года", tuition: "Грант покрывает", grant: true },
      { name: "Data Science", degree: "Бакалавр", duration: "4 года", tuition: "Грант покрывает", grant: true },
      { name: "Electrical Engineering", degree: "Бакалавр", duration: "4 года", tuition: "Грант покрывает", grant: true },
      { name: "Economics", degree: "Бакалавр", duration: "4 года", tuition: "Грант покрывает", grant: true },
    ],
    requirements: [
      { title: "IELTS 6.5+ или TOEFL 79+", detail: "Международный сертификат по английскому языку" },
      { title: "SAT 1200+ или ACT 27+", detail: "Стандартизированный тест для поступления" },
      { title: "Аттестат с отличием", detail: "Средний балл не ниже 4.0 из 5.0" },
      { title: "Мотивационное письмо", detail: "На английском языке, 500-700 слов" },
      { title: "Рекомендательные письма (2)", detail: "От преподавателей" },
    ],
    preparationCourses: [
      { name: "IELTS Preparation", provider: "British Council", duration: "3 месяца", free: false },
      { name: "SAT Math", provider: "Khan Academy", duration: "2 месяца", free: true },
      { name: "Academic Writing", provider: "Coursera", duration: "6 недель", free: true },
      { name: "CS50: Introduction to CS", provider: "Harvard (edX)", duration: "12 недель", free: true },
    ],
  },
  {
    id: "kaist",
    name: "KAIST",
    country: "Южная Корея",
    city: "Тэджон",
    ranking: "Топ-40 мира (QS)",
    match: 87,
    type: "grant",
    founded: "1971",
    students: "10,000+",
    description:
      "Korea Advanced Institute of Science and Technology (KAIST) — один из ведущих технических университетов мира. Полностью финансируемые гранты для иностранных студентов. Сильные программы в инженерии, ИТ и науке. Обучение на английском языке.",
    language: "Английский / Корейский",
    deadline: "30 апреля 2026",
    applicationFee: "$80",
    programs: [
      { name: "Electrical Engineering", degree: "Бакалавр", duration: "4 года", tuition: "Полный грант", grant: true },
      { name: "Computer Science", degree: "Бакалавр", duration: "4 года", tuition: "Полный грант", grant: true },
      { name: "Mechanical Engineering", degree: "Бакалавр", duration: "4 года", tuition: "Полный грант", grant: true },
    ],
    requirements: [
      { title: "IELTS 6.5+ или TOEFL 80+", detail: "Английский язык обязателен" },
      { title: "Высокий GPA", detail: "В школьном аттестате или диплом" },
      { title: "Мотивационное письмо", detail: "Statement of Purpose на английском" },
      { title: "Рекомендательные письма (2)", detail: "От преподавателей" },
    ],
    preparationCourses: [
      { name: "IELTS Preparation", provider: "British Council", duration: "3 месяца", free: false },
      { name: "Calculus 1", provider: "MIT OpenCourseWare", duration: "15 недель", free: true },
      { name: "Physics I", provider: "Khan Academy", duration: "10 недель", free: true },
      { name: "Korean Language Basics", provider: "Talk To Me In Korean", duration: "8 недель", free: true },
    ],
  },
  {
    id: "tu-munich",
    name: "TU Munich",
    country: "Германия",
    city: "Мюнхен",
    ranking: "Топ-50 мира (QS)",
    match: 83,
    type: "partial",
    founded: "1868",
    students: "50,000+",
    description:
      "Технический университет Мюнхена — один из лучших технических вузов Европы. Минимальные или нулевые сборы за обучение. Сильные связи с индустрией — BMW, Siemens, SAP. Программы на немецком и английском.",
    language: "Немецкий / Английский",
    deadline: "15 января 2026",
    applicationFee: "€75",
    programs: [
      { name: "Informatics", degree: "Бакалавр", duration: "3 года", tuition: "€150/семестр", grant: false },
      { name: "Mathematics", degree: "Бакалавр", duration: "3 года", tuition: "€150/семестр", grant: false },
      { name: "Data Engineering", degree: "Магистр", duration: "2 года", tuition: "€150/семестр", grant: false },
    ],
    requirements: [
      { title: "TestDaF B2 или DSH-2", detail: "Для программ на немецком языке" },
      { title: "IELTS 6.5+", detail: "Для программ на английском языке" },
      { title: "Аттестат / Диплом", detail: "С апостилем и нотариальным переводом" },
      { title: "Мотивационное письмо", detail: "На немецком или английском" },
    ],
    preparationCourses: [
      { name: "Немецкий язык A1-B2", provider: "Goethe-Institut", duration: "6 месяцев", free: false },
      { name: "IELTS Preparation", provider: "Coursera", duration: "2 месяца", free: true },
      { name: "Linear Algebra", provider: "MIT OpenCourseWare", duration: "14 недель", free: true },
      { name: "Introduction to Programming", provider: "freeCodeCamp", duration: "8 недель", free: true },
    ],
  },
  {
    id: "warsaw",
    name: "University of Warsaw",
    country: "Польша",
    city: "Варшава",
    ranking: "Топ-300 мира (QS)",
    match: 80,
    type: "paid",
    founded: "1816",
    students: "40,000+",
    description:
      "Варшавский университет — крупнейший и старейший вуз Польши. Доступная стоимость обучения для иностранных студентов. Широкий выбор программ на английском. Расположен в центре Европы.",
    language: "Польский / Английский",
    deadline: "31 мая 2026",
    applicationFee: "€85",
    programs: [
      { name: "Computer Science", degree: "Бакалавр", duration: "3 года", tuition: "€3,000/год", grant: false },
      { name: "Economics", degree: "Бакалавр", duration: "3 года", tuition: "€2,500/год", grant: false },
      { name: "Data Science", degree: "Магистр", duration: "2 года", tuition: "€3,500/год", grant: false },
    ],
    requirements: [
      { title: "IELTS 5.5+ или TOEFL 72+", detail: "Для программ на английском" },
      { title: "Аттестат / Диплом", detail: "С нотариальным переводом" },
      { title: "Мотивационное письмо", detail: "На английском языке" },
    ],
    preparationCourses: [
      { name: "IELTS Preparation", provider: "edX", duration: "6 недель", free: true },
      { name: "Economics 101", provider: "Coursera", duration: "8 недель", free: true },
      { name: "Python for Beginners", provider: "Codecademy", duration: "4 недели", free: true },
    ],
  },
  {
    id: "bocconi",
    name: "Bocconi University",
    country: "Италия",
    city: "Милан",
    ranking: "Топ-10 Европы (Business)",
    match: 82,
    type: "paid",
    founded: "1902",
    students: "15,000+",
    description:
      "Bocconi — один из лучших университетов Европы по экономике, финансам и менеджменту. Сильный карьерный центр и международные стажировки. Много программ на английском языке.",
    language: "Английский / Итальянский",
    deadline: "20 февраля 2026",
    applicationFee: "€100",
    programs: [
      { name: "Economics and Management", degree: "Бакалавр", duration: "3 года", tuition: "€14,000/год", grant: false },
      { name: "International Economics and Finance", degree: "Бакалавр", duration: "3 года", tuition: "€14,000/год", grant: false },
      { name: "Management", degree: "Магистр", duration: "2 года", tuition: "€16,000/год", grant: false },
    ],
    requirements: [
      { title: "IELTS 6.5+", detail: "Подтверждение английского языка" },
      { title: "Высокий GPA", detail: "Конкурентный отбор" },
      { title: "Мотивационное письмо", detail: "На английском" },
    ],
    preparationCourses: [
      { name: "IELTS Preparation", provider: "British Council", duration: "2 месяца", free: false },
      { name: "Microeconomics", provider: "Khan Academy", duration: "6 недель", free: true },
      { name: "Business Foundations", provider: "Coursera", duration: "8 недель", free: true },
    ],
  },
  {
    id: "u-toronto",
    name: "University of Toronto",
    country: "Канада",
    city: "Торонто",
    ranking: "Топ-25 мира (QS)",
    match: 84,
    type: "paid",
    founded: "1827",
    students: "90,000+",
    description:
      "University of Toronto — ведущий исследовательский университет, сильные направления в Computer Science, Life Sciences, Economics. Большой выбор программ и исследовательских возможностей.",
    language: "Английский",
    deadline: "15 января 2026",
    applicationFee: "$180",
    programs: [
      { name: "Computer Science", degree: "Бакалавр", duration: "4 года", tuition: "$45,000/год", grant: false },
      { name: "Economics", degree: "Бакалавр", duration: "4 года", tuition: "$40,000/год", grant: false },
      { name: "Life Sciences", degree: "Бакалавр", duration: "4 года", tuition: "$42,000/год", grant: false },
    ],
    requirements: [
      { title: "IELTS 6.5+", detail: "Требования по английскому" },
      { title: "Высокий GPA", detail: "Сильный аттестат/транскрипт" },
      { title: "Эссе", detail: "Supplemental application" },
    ],
    preparationCourses: [
      { name: "IELTS Preparation", provider: "Coursera", duration: "6 недель", free: true },
      { name: "SAT Math", provider: "Khan Academy", duration: "8 недель", free: true },
      { name: "Biology Basics", provider: "edX", duration: "10 недель", free: true },
    ],
  },
  {
    id: "seoul-national",
    name: "Seoul National University",
    country: "Южная Корея",
    city: "Сеул",
    ranking: "Топ-35 мира (QS)",
    match: 81,
    type: "partial",
    founded: "1946",
    students: "28,000+",
    description:
      "Seoul National University — ведущий университет Кореи. Сильные программы в инженерии, экономике и медицине. Доступны стипендии для иностранных студентов.",
    language: "Корейский / Английский",
    deadline: "10 марта 2026",
    applicationFee: "$100",
    programs: [
      { name: "Business Administration", degree: "Бакалавр", duration: "4 года", tuition: "$6,000/год", grant: false },
      { name: "Biomedical Engineering", degree: "Бакалавр", duration: "4 года", tuition: "$6,500/год", grant: false },
      { name: "Computer Engineering", degree: "Бакалавр", duration: "4 года", tuition: "$6,500/год", grant: false },
    ],
    requirements: [
      { title: "IELTS 6.5+ или TOPIK", detail: "В зависимости от программы" },
      { title: "Высокий GPA", detail: "Конкурсный отбор" },
      { title: "Мотивационное письмо", detail: "Statement of Purpose" },
    ],
    preparationCourses: [
      { name: "IELTS Preparation", provider: "edX", duration: "6 недель", free: true },
      { name: "TOPIK Basics", provider: "Talk To Me In Korean", duration: "8 недель", free: true },
      { name: "Calculus 1", provider: "MIT OpenCourseWare", duration: "12 недель", free: true },
    ],
  },
  {
    id: "polimi",
    name: "Politecnico di Milano",
    country: "Италия",
    city: "Милан",
    ranking: "Топ-15 мира (Design)",
    match: 79,
    type: "partial",
    founded: "1863",
    students: "45,000+",
    description:
      "Politecnico di Milano — один из лучших европейских вузов по инженерии и дизайну. Есть программы на английском, доступные fees и стипендии.",
    language: "Английский / Итальянский",
    deadline: "1 апреля 2026",
    applicationFee: "€50",
    programs: [
      { name: "Design", degree: "Бакалавр", duration: "3 года", tuition: "€3,900/год", grant: false },
      { name: "Architecture", degree: "Бакалавр", duration: "3 года", tuition: "€3,900/год", grant: false },
      { name: "Mechanical Engineering", degree: "Бакалавр", duration: "3 года", tuition: "€3,900/год", grant: false },
    ],
    requirements: [
      { title: "IELTS 6.0+", detail: "Для программ на английском" },
      { title: "Портфолио (Design/Arch)", detail: "Для творческих программ" },
      { title: "Аттестат / Диплом", detail: "С переводом" },
    ],
    preparationCourses: [
      { name: "Portfolio Basics", provider: "Skillshare", duration: "4 недели", free: false },
      { name: "IELTS Preparation", provider: "Coursera", duration: "6 недель", free: true },
      { name: "Design Thinking", provider: "Coursera", duration: "5 недель", free: true },
    ],
  },
  {
    id: "eth",
    name: "ETH Zurich",
    country: "Швейцария",
    city: "Цюрих",
    ranking: "Топ-10 мира (QS)",
    match: 86,
    type: "partial",
    founded: "1855",
    students: "25,000+",
    description:
      "ETH Zurich — один из сильнейших технических университетов мира. Сильные направления: инженерия, computer science, математика, естественные науки. Высокая конкуренция, доступны стипендии.",
    language: "Английский / Немецкий",
    deadline: "15 декабря 2025",
    applicationFee: "CHF 150",
    programs: [
      { name: "Computer Science", degree: "Бакалавр", duration: "3 года", tuition: "CHF 1,500/год", grant: false },
      { name: "Mechanical Engineering", degree: "Бакалавр", duration: "3 года", tuition: "CHF 1,500/год", grant: false },
      { name: "Data Science", degree: "Магистр", duration: "2 года", tuition: "CHF 1,500/год", grant: false },
    ],
    requirements: [
      { title: "Сильная математика", detail: "Конкурсный отбор" },
      { title: "IELTS 7.0+", detail: "Для программ на английском" },
      { title: "Транскрипт/аттестат", detail: "С переводом" },
    ],
    preparationCourses: [
      { name: "Calculus 1", provider: "MIT OpenCourseWare", duration: "12 недель", free: true },
      { name: "IELTS Preparation", provider: "edX", duration: "6 недель", free: true },
      { name: "Linear Algebra", provider: "Khan Academy", duration: "8 недель", free: true },
    ],
  },
  {
    id: "ucl",
    name: "University College London (UCL)",
    country: "Великобритания",
    city: "Лондон",
    ranking: "Топ-20 мира (QS)",
    match: 84,
    type: "paid",
    founded: "1826",
    students: "45,000+",
    description:
      "UCL — один из ведущих университетов Великобритании, сильные программы в экономике, инженерии, медицине и дизайне. Много международных студентов.",
    language: "Английский",
    deadline: "31 января 2026",
    applicationFee: "£27.50",
    programs: [
      { name: "Economics", degree: "Бакалавр", duration: "3 года", tuition: "£31,100/год", grant: false },
      { name: "Computer Science", degree: "Бакалавр", duration: "3 года", tuition: "£39,800/год", grant: false },
      { name: "Biomedical Sciences", degree: "Бакалавр", duration: "3 года", tuition: "£32,100/год", grant: false },
    ],
    requirements: [
      { title: "IELTS 6.5+", detail: "Требования по английскому" },
      { title: "Personal Statement", detail: "Через UCAS" },
      { title: "Высокий академический балл", detail: "Конкурс" },
    ],
    preparationCourses: [
      { name: "IELTS Preparation", provider: "British Council", duration: "2 месяца", free: false },
      { name: "Academic Writing", provider: "Coursera", duration: "6 недель", free: true },
      { name: "Statistics", provider: "Khan Academy", duration: "6 недель", free: true },
    ],
  },
  {
    id: "melbourne",
    name: "The University of Melbourne",
    country: "Австралия",
    city: "Мельбурн",
    ranking: "Топ-20 мира (QS)",
    match: 83,
    type: "paid",
    founded: "1853",
    students: "50,000+",
    description:
      "Один из лучших университетов Австралии: strong research, широкий выбор программ и хорошая поддержка international students.",
    language: "Английский",
    deadline: "1 декабря 2025",
    applicationFee: "$120",
    programs: [
      { name: "Commerce", degree: "Бакалавр", duration: "3 года", tuition: "$45,000/год", grant: false },
      { name: "Biomedicine", degree: "Бакалавр", duration: "3 года", tuition: "$48,000/год", grant: false },
      { name: "Design", degree: "Бакалавр", duration: "3 года", tuition: "$40,000/год", grant: false },
    ],
    requirements: [
      { title: "IELTS 6.5+", detail: "Английский обязателен" },
      { title: "Высокий GPA", detail: "Конкурсный отбор" },
      { title: "Документы", detail: "Переводы + transcript" },
    ],
    preparationCourses: [
      { name: "IELTS Preparation", provider: "Coursera", duration: "6 недель", free: true },
      { name: "Biology Basics", provider: "edX", duration: "8 недель", free: true },
      { name: "Design Foundations", provider: "Coursera", duration: "6 недель", free: true },
    ],
  },
  {
    id: "nus",
    name: "National University of Singapore (NUS)",
    country: "Сингапур",
    city: "Сингапур",
    ranking: "Топ-10 мира (QS)",
    match: 85,
    type: "paid",
    founded: "1905",
    students: "40,000+",
    description:
      "NUS — топ‑университет Азии, сильные направления в CS/engineering, business и life sciences. Очень конкурентный отбор.",
    language: "Английский",
    deadline: "15 февраля 2026",
    applicationFee: "$20",
    programs: [
      { name: "Computer Science", degree: "Бакалавр", duration: "4 года", tuition: "$39,000/год", grant: false },
      { name: "Business Administration", degree: "Бакалавр", duration: "4 года", tuition: "$39,000/год", grant: false },
      { name: "Life Sciences", degree: "Бакалавр", duration: "4 года", tuition: "$39,000/год", grant: false },
    ],
    requirements: [
      { title: "IELTS 6.5+", detail: "English proficiency" },
      { title: "Высокий GPA", detail: "Конкурс" },
      { title: "Эссе/достижения", detail: "Holistic admissions" },
    ],
    preparationCourses: [
      { name: "IELTS Preparation", provider: "edX", duration: "6 недель", free: true },
      { name: "Discrete Math", provider: "Coursera", duration: "6 недель", free: true },
      { name: "Intro to Biology", provider: "Khan Academy", duration: "6 недель", free: true },
    ],
  },
  {
    id: "tsinghua",
    name: "Tsinghua University",
    country: "Китай",
    city: "Пекин",
    ranking: "Топ-20 мира (QS)",
    match: 82,
    type: "partial",
    founded: "1911",
    students: "50,000+",
    description:
      "Tsinghua — ведущий университет Китая, сильные программы в инженерии, CS и науках. Есть программы на английском и стипендии.",
    language: "Английский / Китайский",
    deadline: "1 марта 2026",
    applicationFee: "$100",
    programs: [
      { name: "Computer Science", degree: "Бакалавр", duration: "4 года", tuition: "$6,000/год", grant: false },
      { name: "Electrical Engineering", degree: "Бакалавр", duration: "4 года", tuition: "$6,000/год", grant: false },
      { name: "Economics", degree: "Бакалавр", duration: "4 года", tuition: "$6,000/год", grant: false },
    ],
    requirements: [
      { title: "IELTS 6.5+", detail: "Для англ. программ" },
      { title: "Высокий GPA", detail: "Конкурс" },
      { title: "Мотивационное письмо", detail: "Statement" },
    ],
    preparationCourses: [
      { name: "IELTS Preparation", provider: "Coursera", duration: "6 недель", free: true },
      { name: "Math for Engineers", provider: "Khan Academy", duration: "8 недель", free: true },
      { name: "Chinese Basics", provider: "Duolingo", duration: "6 недель", free: true },
    ],
  },
  {
    id: "tokyo",
    name: "The University of Tokyo",
    country: "Япония",
    city: "Токио",
    ranking: "Топ-30 мира (QS)",
    match: 81,
    type: "partial",
    founded: "1877",
    students: "28,000+",
    description:
      "University of Tokyo — ведущий университет Японии. Есть англоязычные программы и стипендии, сильные направления в науках и инженерии.",
    language: "Японский / Английский",
    deadline: "15 ноября 2025",
    applicationFee: "$100",
    programs: [
      { name: "Engineering", degree: "Бакалавр", duration: "4 года", tuition: "$5,000/год", grant: false },
      { name: "Economics", degree: "Бакалавр", duration: "4 года", tuition: "$5,000/год", grant: false },
      { name: "Life Sciences", degree: "Бакалавр", duration: "4 года", tuition: "$5,000/год", grant: false },
    ],
    requirements: [
      { title: "IELTS 6.5+", detail: "Для англ. программ" },
      { title: "Высокий GPA", detail: "Конкурс" },
      { title: "Эссе", detail: "Statement" },
    ],
    preparationCourses: [
      { name: "IELTS Preparation", provider: "edX", duration: "6 недель", free: true },
      { name: "Calculus 1", provider: "MIT OpenCourseWare", duration: "12 недель", free: true },
      { name: "Japanese Basics", provider: "Duolingo", duration: "6 недель", free: true },
    ],
  },
  {
    id: "tudelft",
    name: "TU Delft",
    country: "Нидерланды",
    city: "Делфт",
    ranking: "Топ-50 мира (Engineering)",
    match: 80,
    type: "paid",
    founded: "1842",
    students: "26,000+",
    description:
      "TU Delft — один из лучших инженерных университетов Европы. Сильные программы в инженерии, архитектуре и дизайне.",
    language: "Английский / Голландский",
    deadline: "15 января 2026",
    applicationFee: "€100",
    programs: [
      { name: "Aerospace Engineering", degree: "Бакалавр", duration: "3 года", tuition: "€15,200/год", grant: false },
      { name: "Computer Science and Engineering", degree: "Бакалавр", duration: "3 года", tuition: "€15,200/год", grant: false },
      { name: "Architecture", degree: "Бакалавр", duration: "3 года", tuition: "€15,200/год", grant: false },
    ],
    requirements: [
      { title: "IELTS 6.5+", detail: "Для англ. программ" },
      { title: "Высокий GPA", detail: "Отбор" },
      { title: "Мотивация", detail: "Motivation" },
    ],
    preparationCourses: [
      { name: "IELTS Preparation", provider: "Coursera", duration: "6 недель", free: true },
      { name: "Physics", provider: "Khan Academy", duration: "8 недель", free: true },
      { name: "Portfolio Basics", provider: "Skillshare", duration: "4 недели", free: false },
    ],
  },
  {
    id: "kth",
    name: "KTH Royal Institute of Technology",
    country: "Швеция",
    city: "Стокгольм",
    ranking: "Топ-100 мира (QS)",
    match: 78,
    type: "paid",
    founded: "1827",
    students: "14,000+",
    description:
      "KTH — ведущий технический университет Швеции. Программы на английском, сильные направления в инженерии и IT.",
    language: "Английский / Шведский",
    deadline: "15 января 2026",
    applicationFee: "SEK 900",
    programs: [
      { name: "Computer Science", degree: "Бакалавр", duration: "3 года", tuition: "€15,000/год", grant: false },
      { name: "Industrial Engineering", degree: "Бакалавр", duration: "3 года", tuition: "€15,000/год", grant: false },
      { name: "Biomedical Engineering", degree: "Магистр", duration: "2 года", tuition: "€17,000/год", grant: false },
    ],
    requirements: [
      { title: "IELTS 6.5+", detail: "English" },
      { title: "Транскрипт", detail: "Документы с переводом" },
      { title: "Мотивация", detail: "Statement" },
    ],
    preparationCourses: [
      { name: "IELTS Preparation", provider: "edX", duration: "6 недель", free: true },
      { name: "Linear Algebra", provider: "MIT OpenCourseWare", duration: "10 недель", free: true },
      { name: "Python", provider: "freeCodeCamp", duration: "6 недель", free: true },
    ],
  },
  {
    id: "aalto",
    name: "Aalto University",
    country: "Финляндия",
    city: "Эспоо",
    ranking: "Топ-60 Европы (Design)",
    match: 77,
    type: "paid",
    founded: "2010",
    students: "12,000+",
    description:
      "Aalto — сильный университет по дизайну, бизнесу и технологиям. Есть англоязычные программы, развитая стартап‑экосистема.",
    language: "Английский / Финский",
    deadline: "4 января 2026",
    applicationFee: "€100",
    programs: [
      { name: "Design", degree: "Бакалавр", duration: "3 года", tuition: "€12,000/год", grant: false },
      { name: "Business", degree: "Бакалавр", duration: "3 года", tuition: "€12,000/год", grant: false },
      { name: "Computer Science", degree: "Магистр", duration: "2 года", tuition: "€15,000/год", grant: false },
    ],
    requirements: [
      { title: "IELTS 6.5+", detail: "English" },
      { title: "Портфолио (Design)", detail: "Для творческих" },
      { title: "Высокий GPA", detail: "Отбор" },
    ],
    preparationCourses: [
      { name: "Design Thinking", provider: "Coursera", duration: "5 недель", free: true },
      { name: "IELTS Preparation", provider: "Coursera", duration: "6 недель", free: true },
      { name: "Business Foundations", provider: "Coursera", duration: "8 недель", free: true },
    ],
  },
  {
    id: "ku-leuven",
    name: "KU Leuven",
    country: "Бельгия",
    city: "Лёвен",
    ranking: "Топ-80 мира (QS)",
    match: 79,
    type: "paid",
    founded: "1425",
    students: "60,000+",
    description:
      "KU Leuven — один из старейших университетов Европы, сильные программы по инженерии, экономике и биомедицине.",
    language: "Английский / Голландский",
    deadline: "1 марта 2026",
    applicationFee: "€90",
    programs: [
      { name: "Business Engineering", degree: "Бакалавр", duration: "3 года", tuition: "€6,000/год", grant: false },
      { name: "Biomedical Sciences", degree: "Бакалавр", duration: "3 года", tuition: "€6,000/год", grant: false },
      { name: "Engineering Technology", degree: "Бакалавр", duration: "3 года", tuition: "€6,000/год", grant: false },
    ],
    requirements: [
      { title: "IELTS 6.5+", detail: "English" },
      { title: "Транскрипт", detail: "С переводом" },
      { title: "Мотивация", detail: "Statement" },
    ],
    preparationCourses: [
      { name: "IELTS Preparation", provider: "edX", duration: "6 недель", free: true },
      { name: "Statistics", provider: "Khan Academy", duration: "6 недель", free: true },
      { name: "Biology Basics", provider: "edX", duration: "8 недель", free: true },
    ],
  },
  {
    id: "trinity",
    name: "Trinity College Dublin",
    country: "Ирландия",
    city: "Дублин",
    ranking: "Топ-100 мира (QS)",
    match: 78,
    type: "paid",
    founded: "1592",
    students: "18,000+",
    description:
      "Trinity — ведущий университет Ирландии. Сильные направления в CS, business, медицине и гуманитарных науках.",
    language: "Английский",
    deadline: "1 февраля 2026",
    applicationFee: "€55",
    programs: [
      { name: "Computer Science", degree: "Бакалавр", duration: "4 года", tuition: "€22,000/год", grant: false },
      { name: "Business", degree: "Бакалавр", duration: "4 года", tuition: "€20,000/год", grant: false },
      { name: "Biomedical Science", degree: "Бакалавр", duration: "4 года", tuition: "€24,000/год", grant: false },
    ],
    requirements: [
      { title: "IELTS 6.5+", detail: "English" },
      { title: "Personal Statement", detail: "Motivation" },
      { title: "Высокий балл", detail: "Конкурс" },
    ],
    preparationCourses: [
      { name: "IELTS Preparation", provider: "British Council", duration: "2 месяца", free: false },
      { name: "Intro to Programming", provider: "freeCodeCamp", duration: "8 недель", free: true },
      { name: "Biology Basics", provider: "Khan Academy", duration: "6 недель", free: true },
    ],
  },
  {
    id: "dtu",
    name: "Technical University of Denmark (DTU)",
    country: "Дания",
    city: "Люнгбю",
    ranking: "Топ-100 мира (Engineering)",
    match: 77,
    type: "paid",
    founded: "1829",
    students: "11,000+",
    description:
      "DTU — ведущий инженерный университет Дании, сильные программы по инженерии, устойчивому развитию и data/AI.",
    language: "Английский / Датский",
    deadline: "15 января 2026",
    applicationFee: "€100",
    programs: [
      { name: "Engineering", degree: "Бакалавр", duration: "3 года", tuition: "€15,000/год", grant: false },
      { name: "Data Science", degree: "Магистр", duration: "2 года", tuition: "€17,000/год", grant: false },
      { name: "Biomedical Engineering", degree: "Магистр", duration: "2 года", tuition: "€17,000/год", grant: false },
    ],
    requirements: [
      { title: "IELTS 6.5+", detail: "English" },
      { title: "Транскрипт", detail: "Документы" },
      { title: "Мотивация", detail: "Statement" },
    ],
    preparationCourses: [
      { name: "IELTS Preparation", provider: "edX", duration: "6 недель", free: true },
      { name: "Calculus", provider: "Khan Academy", duration: "8 недель", free: true },
      { name: "Python", provider: "Codecademy", duration: "6 недель", free: false },
    ],
  },
  {
    id: "uae-nyuad",
    name: "NYU Abu Dhabi",
    country: "ОАЭ",
    city: "Абу-Даби",
    ranking: "Топ (Liberal Arts)",
    match: 76,
    type: "grant",
    founded: "2010",
    students: "2,000+",
    description:
      "NYU Abu Dhabi — кампус NYU с щедрой финансовой поддержкой для талантливых студентов. International environment, обучение на английском.",
    language: "Английский",
    deadline: "1 января 2026",
    applicationFee: "$0",
    programs: [
      { name: "Computer Science", degree: "Бакалавр", duration: "4 года", tuition: "Финансовая помощь", grant: true },
      { name: "Economics", degree: "Бакалавр", duration: "4 года", tuition: "Финансовая помощь", grant: true },
      { name: "Biology", degree: "Бакалавр", duration: "4 года", tuition: "Финансовая помощь", grant: true },
    ],
    requirements: [
      { title: "IELTS/TOEFL", detail: "English proficiency" },
      { title: "Эссе", detail: "Personal essays" },
      { title: "Высокие оценки", detail: "Конкурс" },
    ],
    preparationCourses: [
      { name: "IELTS Preparation", provider: "Coursera", duration: "6 недель", free: true },
      { name: "SAT Math", provider: "Khan Academy", duration: "8 недель", free: true },
      { name: "Academic Writing", provider: "Coursera", duration: "6 недель", free: true },
    ],
  },
  {
    id: "auckland",
    name: "The University of Auckland",
    country: "Новая Зеландия",
    city: "Окленд",
    ranking: "Топ-100 мира (QS)",
    match: 75,
    type: "paid",
    founded: "1883",
    students: "40,000+",
    description:
      "University of Auckland — топ‑университет Новой Зеландии. Программы на английском, сильные направления в engineering, business и health.",
    language: "Английский",
    deadline: "8 декабря 2025",
    applicationFee: "$0",
    programs: [
      { name: "Engineering", degree: "Бакалавр", duration: "4 года", tuition: "$45,000/год", grant: false },
      { name: "Business", degree: "Бакалавр", duration: "3 года", tuition: "$38,000/год", grant: false },
      { name: "Health Sciences", degree: "Бакалавр", duration: "3 года", tuition: "$40,000/год", grant: false },
    ],
    requirements: [
      { title: "IELTS 6.5+", detail: "English" },
      { title: "Высокий GPA", detail: "Отбор" },
      { title: "Документы", detail: "Transcript" },
    ],
    preparationCourses: [
      { name: "IELTS Preparation", provider: "edX", duration: "6 недель", free: true },
      { name: "Calculus", provider: "Khan Academy", duration: "8 недель", free: true },
      { name: "Biology Basics", provider: "Khan Academy", duration: "6 недель", free: true },
    ],
  },
];
