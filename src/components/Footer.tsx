const Footer = () => {
  return (
    <footer className="py-14 px-4 bg-foreground text-background rounded-t-[2.5rem]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-xl font-heading font-bold mb-1">AcademicApply</h3>
          <p className="text-background/60 text-sm">AI-платформа для вашего будущего</p>
        </div>
        <div className="flex gap-8 text-sm text-background/60">
          <a href="#features" className="hover:text-background transition-colors">Возможности</a>
          <a href="#" className="hover:text-background transition-colors">О нас</a>
          <a href="#" className="hover:text-background transition-colors">Контакты</a>
        </div>
        <p className="text-background/40 text-xs">© 2026 AcademicApply. Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer;
