import { addConsultant } from "./consultant";

export const seedConsultants = async () => {
  const consultants = [
    {
      name: "Анна Петрова",
      email: "anna@mit.edu",
      specialization: ["MIT", "Engineering", "GRE"],
      experience: 5,
      rating: 4.9,
      price: 150,
      available: true,
      languages: ["Русский", "English"],
      universities: ["MIT", "Stanford"],
      bio: "Выпускница MIT, помогу с инженерными программами и подготовкой к GRE. Опыт работы в admission office MIT."
    },
    {
      name: "Михаил Иванов",
      email: "mikhail@stanford.edu",
      specialization: ["Stanford", "Business", "Эссе"],
      experience: 7,
      rating: 4.8,
      price: 120,
      available: true,
      languages: ["Русский", "English"],
      universities: ["Stanford", "Harvard"],
      bio: "MBA Stanford, специализируюсь на бизнес-школах и написании мотивационных писаний."
    },
    {
      name: "Елена Смирнова",
      email: "elena@harvard.edu",
      specialization: ["Harvard", "IELTS", "Документы"],
      experience: 6,
      rating: 4.9,
      price: 100,
      available: false,
      languages: ["Русский", "English", "Deutsch"],
      universities: ["Harvard", "Yale"],
      bio: "Выпускница Harvard Law School, эксперт по подготовке документов и IELTS."
    },
    {
      name: "Дмитрий Козлов",
      email: "dmitry@oxford.edu",
      specialization: ["Oxford", "IELTS", "Interview"],
      experience: 4,
      rating: 4.7,
      price: 80,
      available: true,
      languages: ["Русский", "English"],
      universities: ["Oxford", "Cambridge"],
      bio: "Oxford graduate, помогаю с подготовкой к собеседованиям и IELTS академический."
    }
  ];

  for (const consultant of consultants) {
    await addConsultant(consultant);
  }

  console.log("Consultants seeded successfully!");
};
