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
];
