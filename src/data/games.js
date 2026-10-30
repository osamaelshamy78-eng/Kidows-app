// Shared vocabulary for the mini games. `arLetter` / `enLetter` are the first
// letter of each word, used by the Letters game.
export const things = [
  { id: 'sun', emoji: '☀️', ar: 'الشمس', en: 'sun', word: 'شمس', arLetter: 'ش', enLetter: 'S' },
  { id: 'moon', emoji: '🌙', ar: 'القمر', en: 'moon', word: 'قمر', arLetter: 'ق', enLetter: 'M' },
  { id: 'star', emoji: '⭐', ar: 'النجمة', en: 'star', word: 'نجمة', arLetter: 'ن', enLetter: 'S' },
  { id: 'tree', emoji: '🌳', ar: 'الشجرة', en: 'tree', word: 'شجرة', arLetter: 'ش', enLetter: 'T' },
  { id: 'mosque', emoji: '🕌', ar: 'المسجد', en: 'mosque', word: 'مسجد', arLetter: 'م', enLetter: 'M' },
  { id: 'bird', emoji: '🐦', ar: 'العصفور', en: 'bird', word: 'عصفور', arLetter: 'ع', enLetter: 'B' },
  { id: 'cat', emoji: '🐱', ar: 'القطة', en: 'cat', word: 'قطة', arLetter: 'ق', enLetter: 'C' },
  { id: 'fish', emoji: '🐟', ar: 'السمكة', en: 'fish', word: 'سمكة', arLetter: 'س', enLetter: 'F' },
  { id: 'apple', emoji: '🍎', ar: 'التفاحة', en: 'apple', word: 'تفاحة', arLetter: 'ت', enLetter: 'A' },
  { id: 'flower', emoji: '🌸', ar: 'الزهرة', en: 'flower', word: 'زهرة', arLetter: 'ز', enLetter: 'F' },
  { id: 'camel', emoji: '🐪', ar: 'الجمل', en: 'camel', word: 'جمل', arLetter: 'ج', enLetter: 'C' },
  { id: 'book', emoji: '📖', ar: 'الكتاب', en: 'book', word: 'كتاب', arLetter: 'ك', enLetter: 'B' },
  { id: 'duck', emoji: '🦆', ar: 'البطة', en: 'duck', word: 'بطة', arLetter: 'ب', enLetter: 'D' },
  { id: 'bee', emoji: '🐝', ar: 'النحلة', en: 'bee', word: 'نحلة', arLetter: 'ن', enLetter: 'B' },
  { id: 'elephant', emoji: '🐘', ar: 'الفيل', en: 'elephant', word: 'فيل', arLetter: 'ف', enLetter: 'E' },
  { id: 'rabbit', emoji: '🐰', ar: 'الأرنب', en: 'rabbit', word: 'أرنب', arLetter: 'أ', enLetter: 'R' },
  { id: 'banana', emoji: '🍌', ar: 'الموزة', en: 'banana', word: 'موزة', arLetter: 'م', enLetter: 'B' },
  { id: 'egg', emoji: '🥚', ar: 'البيضة', en: 'egg', word: 'بيضة', arLetter: 'ب', enLetter: 'E' }
]

// How each letter is pronounced when read aloud ("حرف الباء").
export const arabicLetterNames = {
  'أ': 'الألف', 'ب': 'الباء', 'ت': 'التاء', 'ج': 'الجيم', 'ز': 'الزاي', 'س': 'السين', 'ش': 'الشين',
  'ع': 'العين', 'ف': 'الفاء', 'ق': 'القاف', 'ك': 'الكاف', 'م': 'الميم', 'ن': 'النون'
}

export const arabicNumbers = ['صفر', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة']
export const englishNumbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']

// [same, different] pairs for Find the Difference.
export const differencePairs = [
  ['🐱', '🐶'], ['🍎', '🍐'], ['🌙', '⭐'], ['🐟', '🐬'], ['🌳', '🌴'],
  ['🚗', '🚌'], ['🐑', '🐐'], ['🌸', '🌻'], ['🕌', '🏠'], ['🐝', '🐞']
]

// Scenes for the swap puzzle: 9 tiles read row by row.
export const puzzleScenes = [
  ['☁️', '☀️', '☁️', '🌴', '🕌', '🌴', '🌷', '🐪', '🌷'],
  ['🌙', '⭐', '✨', '🏠', '🌳', '🏠', '🐱', '🌼', '🐶'],
  ['☀️', '☁️', '🐦', '⛵', '🌊', '🐟', '🐚', '🦀', '🐠']
]

export const colorPalette = ['#ef4444', '#f59e0b', '#facc15', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#8b5a2b']
