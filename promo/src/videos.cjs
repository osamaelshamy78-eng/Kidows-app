// The three Little Noor promo videos. Scene `audio` plays the app's own recording.
const S = '../shots/'
// The app's own recordings (only used by scenes with `audio`).
const A = require('path').join(__dirname, '../../public/audio/')
// `vo` lines are spoken by the app's narrator voice; scenes with `audio` keep the app's own recording instead.
const ctaVo = 'جَرِّبْهُ مَجَّانًا الآن. امْسَحِ الرَّمْز، أو ادْخُلْ على الرابط.'
const common = {
  url: 'mandm.mambz.com', ctaVo,
  cta: 'جرّبه مجانًا دلوقتي',
  perks: 'بدون إعلانات • على أي موبايل',
  hookDur: 2.8, ctaDur: 5, outroDur: 4.2
}
module.exports = [
  {
    ...common, name: 'LittleNoor_1_Overview',
    hook: 'تطبيق إسلامي ممتع<br>لأطفالك من سنة لخمس سنين',
    hookVo: 'نور الصغار. تطبيقٌ إسلاميٌّ ممتعٌ لأطفالك.',
    scenes: [
      { img: S + 'home.png', dur: 2.6, title: 'كل حاجة طفلك محتاجها', sub: 'في تطبيق واحد آمن', vo: 'كلُّ ما يحتاجه طفلك، في تطبيقٍ واحدٍ آمن.' },
      { img: S + 'adhkar1.png', dur: 3.4, title: 'أذكار الصباح والمساء', sub: 'بصوت عربي هادي وواضح', vo: 'أذكارُ الصباحِ والمساء، بصوتٍ عربيٍّ هادئٍ وواضح.' },
      { img: S + 'stories.png', dur: 2.6, title: 'قصص الأنبياء والصحابة', sub: 'مسموعة صفحة بصفحة', vo: 'قصصُ الأنبياءِ والصحابة، مسموعةٌ صفحةً بصفحة.' },
      { img: S + 'games.png', dur: 2.6, title: '١١ لعبة تعليمية', sub: 'يتعلم وهو بيلعب', vo: 'وإحدى عشرةَ لعبةً تعليمية، يتعلّمُ وهو يلعب.' },
      { img: S + 'coloring.png', dur: 2.4, title: 'وتلوين وحروف وأرقام', sub: 'ونجوم مكافأة ⭐', vo: 'تلوين، وحروف، وأرقام، ونجومُ مكافأة.' }
    ]
  },
  {
    ...common, name: 'LittleNoor_2_Adhkar-and-Stories',
    hook: 'علّم طفلك الأذكار والقصص<br>بصوت عربي جميل',
    hookVo: 'علِّمْ طفلَك الأذكارَ والقصص، بصوتٍ عربيٍّ جميل.',
    scenes: [
      { img: S + 'adhkar1.png', dur: 3.5, title: 'أذكار الصباح', sub: 'يسمعها ويرددها', vo: 'أذكارُ الصباح، يسمعُها طفلُك ويردّدُها.' },
      { img: S + 'evening.png', dur: 3.3, title: 'وأذكار المساء', sub: 'قبل النوم كل يوم', vo: 'وأذكارُ المساء، قبلَ النومِ كلَّ يوم.' },
      { img: S + 'stories.png', dur: 2.4, title: '١٨ قصة', sub: 'من قصص الأنبياء والصحابة', vo: 'ثماني عشرةَ قصةً من قصص الأنبياء والصحابة.' },
      { img: S + 'story-abubakr.png', dur: 3.0, title: 'قصص مسموعة', sub: 'بلغة سهلة تناسب الأطفال', vo: 'كلُّ قصةٍ مسموعة، بلغةٍ سهلةٍ تناسبُ الأطفال.' }
    ]
  },
  {
    ...common, name: 'LittleNoor_3_Games',
    hook: 'طفلك يتعلم<br>وهو بيلعب 🎮',
    hookVo: 'نور الصغار. طفلُك يتعلّمُ وهو يلعب!',
    scenes: [
      { img: S + 'games.png', dur: 2.5, title: '١١ لعبة تعليمية', sub: 'كلها بالعربي وبالصوت', vo: 'إحدى عشرةَ لعبةً تعليمية، كلُّها بالعربيِّ وبالصوت.' },
      { img: S + 'memory.png', dur: 2.4, title: 'لعبة الذاكرة', sub: 'تقوّي التركيز', vo: 'لعبةُ الذاكرة تقوّي التركيز.' },
      { img: S + 'coloring.png', dur: 2.4, title: 'كتاب التلوين', sub: 'مسجد وسمكة وبيت', vo: 'وكتابُ تلوينٍ لمسجدٍ وسمكةٍ وبيت.' },
      { img: S + 'letters.png', dur: 2.4, title: 'الحروف والكلمات', sub: 'أول خطوة في القراءة', vo: 'الحروفُ والكلمات، أولُ خطوةٍ في القراءة.' },
      { img: S + 'wudu-order.png', dur: 2.6, title: 'رتّب خطوات الوضوء', sub: 'يتعلم دينه بالتجربة', vo: 'ويرتّبُ خطواتِ الوضوءِ بنفسه.' },
      { img: S + 'quiz.png', dur: 2.6, title: 'أسئلة ونجوم مكافأة', sub: 'كل إجابة صح بنجمة ⭐', vo: 'وأسئلةٌ دينية، وكلُّ إجابةٍ صحيحةٍ بنجمة.' }
    ]
  },
  {
    ...common, name: 'LittleNoor_4_Baby-Mode',
    hook: 'وضع خاص للرضّع<br>من عمر سنة 👶',
    hookVo: 'وضعٌ خاصٌّ للرُّضَّع، من عمرِ سنة.',
    scenes: [
      { img: S + 'home-baby-link.png', dur: 2.4, title: 'وضع الرضّع', sub: 'بلمسة من الصفحة الرئيسية', vo: 'بلمسةٍ واحدة، يتحوّلُ التطبيقُ لوضعِ الرُّضَّع.' },
      { img: S + 'baby-sun.png', dur: 2.4, title: 'لمسة في أي مكان', sub: 'تظهر صورة جديدة باسمها', vo: 'يلمسُ طفلُك الشاشةَ في أيِّ مكان، فتظهرُ صورةٌ جديدةٌ باسمِها.' },
      { img: S + 'baby-cat.png', dur: 2.2, title: 'الله خلق القطة 🐱', sub: 'يتعلّم إن ربنا خلق كل حاجة', vo: 'ويسمعُ أنَّ اللهَ خلقَ كلَّ شيء.' },
      { img: S + 'baby-moon.png', dur: 1.3, title: 'صور كبيرة وألوان مبهجة', sub: 'من غير قراءة', vo: 'صورٌ كبيرة، وألوانٌ مبهجة، من غيرِ قراءة.' },
      { img: S + 'baby-flower.png', dur: 1.2, title: 'صور كبيرة وألوان مبهجة', sub: 'من غير قراءة', keepCaption: true },
      { img: S + 'baby-bird.png', dur: 1.2, title: 'صور كبيرة وألوان مبهجة', sub: 'من غير قراءة', keepCaption: true },
      { img: S + 'baby-gate.png', dur: 2.6, title: 'والخروج للأهل بس 🔒', sub: 'سؤال بسيط يقفل الوضع', vo: 'وزرُّ الخروجِ محميٌّ بسؤالٍ للأهل، فلا يخرجُ الطفلُ وحدَه.' }
    ]
  }
]
