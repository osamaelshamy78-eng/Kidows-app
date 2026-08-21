export const quizLevels = [
  {
    id: 1,
    titleAr: 'المستوى 1 — سهل',
    titleEn: 'Level 1 — Easy',
    icon: '🌱',
    questions: [
      { qAr: 'كم صلاة نصلي في اليوم؟', qEn: 'How many daily prayers are there?', optionsAr: ['3', '5', '7'], optionsEn: ['3', '5', '7'], answer: 1 },
      { qAr: 'ما اسم شهر الصيام؟', qEn: 'What is the month of fasting called?', optionsAr: ['رمضان', 'شوال', 'محرم'], optionsEn: ['Ramadan', 'Shawwal', 'Muharram'], answer: 0 },
      { qAr: 'من هو خاتم الأنبياء؟', qEn: 'Who is the final prophet?', optionsAr: ['نوح عليه السلام', 'موسى عليه السلام', 'محمد ﷺ'], optionsEn: ['Nuh', 'Musa', 'Muhammad ﷺ'], answer: 2 },
      { qAr: 'ما اسم الكتاب الذي أنزله الله على النبي محمد ﷺ؟', qEn: 'What is the holy book revealed to Prophet Muhammad ﷺ?', optionsAr: ['القرآن', 'التوراة', 'الزبور'], optionsEn: ['The Qur’an', 'The Torah', 'The Psalms'], answer: 0 },
      { qAr: 'ماذا نقول قبل الأكل؟', qEn: 'What do we say before eating?', optionsAr: ['بسم الله', 'تصبح على خير', 'السلام عليكم'], optionsEn: ['Bismillah', 'Good night', 'Peace be upon you'], answer: 0 }
    ]
  },
  {
    id: 2,
    titleAr: 'المستوى 2 — متوسط',
    titleEn: 'Level 2 — Medium',
    icon: '⭐',
    questions: [
      { qAr: 'كم ركعة في صلاة الفجر؟', qEn: 'How many rak‘ahs are in Fajr prayer?', optionsAr: ['2', '3', '4'], optionsEn: ['2', '3', '4'], answer: 0 },
      { qAr: 'ما اتجاه القبلة للمسلمين؟', qEn: 'What direction do Muslims face in prayer?', optionsAr: ['المسجد الأقصى', 'الكعبة', 'المدينة'], optionsEn: ['Al-Aqsa Mosque', 'The Kaaba', 'Madinah'], answer: 1 },
      { qAr: 'من النبي الذي ابتلعه الحوت؟', qEn: 'Which prophet was swallowed by the whale?', optionsAr: ['يونس', 'يوسف', 'أيوب'], optionsEn: ['Yunus', 'Yusuf', 'Ayyub'], answer: 0 },
      { qAr: 'كم عدد أركان الإسلام؟', qEn: 'How many pillars of Islam are there?', optionsAr: ['4', '5', '6'], optionsEn: ['4', '5', '6'], answer: 1 },
      { qAr: 'ما الصلاة التي نصليها بعد غروب الشمس؟', qEn: 'Which prayer is performed after sunset?', optionsAr: ['الفجر', 'العصر', 'المغرب'], optionsEn: ['Fajr', 'Asr', 'Maghrib'], answer: 2 }
    ]
  },
  {
    id: 3,
    titleAr: 'المستوى 3 — أصعب',
    titleEn: 'Level 3 — Hard',
    icon: '💫',
    questions: [
      { qAr: 'من النبي الذي بنى السفينة؟', qEn: 'Which prophet built the ark?', optionsAr: ['نوح', 'إبراهيم', 'موسى'], optionsEn: ['Nuh', 'Ibrahim', 'Musa'], answer: 0 },
      { qAr: 'ما اسم السورة التي تبدأ بـ الحمد لله رب العالمين؟', qEn: 'Which surah begins with “All praise is for Allah, Lord of the worlds”?', optionsAr: ['الفاتحة', 'الإخلاص', 'الناس'], optionsEn: ['Al-Fatihah', 'Al-Ikhlas', 'An-Nas'], answer: 0 },
      { qAr: 'كم عدد أركان الإيمان؟', qEn: 'How many pillars of faith are there?', optionsAr: ['5', '6', '7'], optionsEn: ['5', '6', '7'], answer: 1 },
      { qAr: 'من النبي الذي كان في النار ولم تضره؟', qEn: 'Which prophet was thrown into the fire and Allah protected him?', optionsAr: ['إبراهيم', 'يونس', 'نوح'], optionsEn: ['Ibrahim', 'Yunus', 'Nuh'], answer: 0 },
      { qAr: 'ما اسم أول مسجد بُني في الإسلام؟', qEn: 'What is the name of the first mosque built in Islam?', optionsAr: ['المسجد النبوي', 'المسجد الحرام', 'مسجد قباء'], optionsEn: ['Prophet’s Mosque', 'Al-Masjid al-Haram', 'Quba Mosque'], answer: 2 }
    ]
  },
  {
    id: 4,
    titleAr: 'المستوى 4 — تحدي',
    titleEn: 'Level 4 — Challenge',
    icon: '🏆',
    questions: [
      { qAr: 'ما السورة التي تُسمى أم الكتاب؟', qEn: 'Which surah is called “Umm al-Kitab” (Mother of the Book)?', optionsAr: ['الفاتحة', 'البقرة', 'يس'], optionsEn: ['Al-Fatihah', 'Al-Baqarah', 'Ya-Sin'], answer: 0 },
      { qAr: 'من هو النبي الذي كلمه الله تكليمًا؟', qEn: 'Which prophet is known as the one Allah spoke to directly?', optionsAr: ['موسى عليه السلام', 'إسماعيل عليه السلام', 'يوسف عليه السلام'], optionsEn: ['Musa', 'Ismail', 'Yusuf'], answer: 0 },
      { qAr: 'كم مرة ذُكر اسم محمد ﷺ صراحة في القرآن؟', qEn: 'How many times is the name Muhammad ﷺ explicitly mentioned in the Qur’an?', optionsAr: ['2', '4', '7'], optionsEn: ['2', '4', '7'], answer: 1 },
      { qAr: 'ما أول قبلة للمسلمين؟', qEn: 'What was the first direction of prayer for Muslims?', optionsAr: ['الكعبة', 'المسجد الأقصى', 'المسجد النبوي'], optionsEn: ['The Kaaba', 'Al-Aqsa Mosque', 'The Prophet’s Mosque'], answer: 1 },
      { qAr: 'ما اسم الليلة التي هي خير من ألف شهر؟', qEn: 'What is the night that is better than a thousand months?', optionsAr: ['ليلة النصف من شعبان', 'ليلة القدر', 'ليلة الإسراء'], optionsEn: ['Mid-Sha‘ban Night', 'Laylat al-Qadr', 'Night of Isra'], answer: 1 }
    ]
  }
]
