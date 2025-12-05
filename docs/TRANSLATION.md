# 🌍 מדריך תרגום - Translation Guide

מדריך לתרגום **HacKing-DJ** לשפות נוספות.

---

## 📋 שפות נתמכות

כרגע הפרויקט תומך ב-4 שפות:

- 🇮🇱 **עברית (he)** - שפת ברירת מחדל
- 🇬🇧 **אנגלית (en)**
- 🇷🇺 **רוסית (ru)**
- 🇮🇳 **הודית (hi)** - Hindi

---

## 📁 מבנה קבצי התרגום

כל קבצי התרגום נמצאים ב-`assets/i18n/`:

```
assets/i18n/
├── he.json  (עברית)
├── en.json  (אנגלית)
├── ru.json  (רוסית)
└── hi.json  (הודית)
```

---

## 🔧 איך להוסיף שפה חדשה?

### שלב 1: יצירת קובץ תרגום

צור קובץ חדש `assets/i18n/[קוד-שפה].json` (לדוגמה: `fr.json` לצרפתית).

### שלב 2: העתקת המבנה

העתק את המבנה מ-`he.json` או `en.json`:

```json
{
  "app": {
    "title": "HacKing-DJ",
    "tagline": "Electro-Kabbalah Cosmic Trap"
  },
  "deck": {
    "deckA": "...",
    "deckB": "...",
    "loadTrack": "...",
    "play": "...",
    "pause": "...",
    "cue": "...",
    "volume": "...",
    "pitch": "..."
  },
  "mixer": {
    "title": "...",
    "crossfader": "...",
    "low": "...",
    "mid": "...",
    "high": "...",
    "masterVolume": "..."
  },
  "playlist": {
    "title": "...",
    "addTrack": "...",
    "empty": "...",
    "loadToA": "...",
    "loadToB": "...",
    "noTrackLoaded": "..."
  },
  "common": {
    "language": "...",
    "hebrew": "עברית",
    "english": "English",
    "russian": "Русский",
    "hindi": "हिन्दी"
  }
}
```

### שלב 3: תרגום הטקסטים

תרגם את כל הערכים לשפה החדשה. שמור על המפתחות (keys) זהים.

### שלב 4: הוספה למערכת

עדכן את `assets/js/i18n.js`:

1. הוסף את קוד השפה ל-`supportedLanguages`:
```javascript
this.supportedLanguages = ['he', 'en', 'ru', 'hi', 'fr']; // הוסף 'fr'
```

2. הוסף שם השפה ל-`languageNames`:
```javascript
this.languageNames = {
    'he': 'עברית',
    'en': 'English',
    'ru': 'Русский',
    'hi': 'हिन्दी',
    'fr': 'Français' // הוסף
};
```

### שלב 5: הוספת כפתור שפה

עדכן את `index.html` והוסף כפתור שפה חדש:

```html
<button class="lang-btn" data-lang="fr" title="Français">FR</button>
```

---

## 📝 מפתחות תרגום (Translation Keys)

### app
- `app.title` - כותרת האפליקציה
- `app.tagline` - סלוגן

### deck
- `deck.deckA` - כותרת דק A
- `deck.deckB` - כותרת דק B
- `deck.loadTrack` - כפתור טעינת טראק
- `deck.play` - כפתור נגינה
- `deck.pause` - כפתור עצירה
- `deck.cue` - כפתור Cue
- `deck.volume` - תווית ווליום
- `deck.pitch` - תווית Pitch

### mixer
- `mixer.title` - כותרת מיקסר
- `mixer.crossfader` - תווית Crossfader
- `mixer.low` - תווית Low EQ
- `mixer.mid` - תווית Mid EQ
- `mixer.high` - תווית High EQ
- `mixer.masterVolume` - תווית Master Volume

### playlist
- `playlist.title` - כותרת פלייליסט
- `playlist.addTrack` - כפתור הוספת טראק
- `playlist.empty` - הודעה כשאין טראקים
- `playlist.loadToA` - כפתור טעינה לדק A
- `playlist.loadToB` - כפתור טעינה לדק B
- `playlist.noTrackLoaded` - הודעה כשאין טראק טעון

### common
- `common.language` - תווית שפה
- `common.hebrew` - שם עברית
- `common.english` - שם אנגלית
- `common.russian` - שם רוסית
- `common.hindi` - שם הודית

---

## 🎯 כללי תרגום

### 1. שמירה על עקביות
- השתמש באותם מונחים לאורך כל התרגום
- שמור על טון מקצועי ועקבי

### 2. אורך טקסט
- נסה לשמור על אורך דומה לטקסט המקורי
- טקסטים ארוכים מדי עלולים לשבור את העיצוב

### 3. מונחים טכניים
- שמור על מונחים טכניים באנגלית אם אין תרגום מקובל
- דוגמאות: "Cue", "Pitch", "Crossfader"

### 4. כיוון טקסט (RTL/LTR)
- עברית וערבית: RTL (מימין לשמאל)
- רוב השפות: LTR (משמאל לימין)
- המערכת מתאימה אוטומטית לפי קוד השפה

---

## 🐛 דיווח על שגיאות תרגום

אם מצאת שגיאה בתרגום:

1. פתח Issue ב-GitHub
2. ציין את השפה והמפתח
3. הצע תיקון

---

## 🤝 תרומה לתרגומים

אנחנו תמיד שמחים לקבל תרומות לתרגומים!

1. Fork את הפרויקט
2. צור קובץ תרגום חדש או תקן קיים
3. שלח Pull Request

---

## 📚 משאבים

- [ISO 639-1 Language Codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
- [i18n Best Practices](https://www.i18next.com/principles/best-practices)

---

## ✨ פסוק מחזק

**"וְהָיָה בְּאַחֲרִית הַיָּמִים נָכוֹן יִהְיֶה הַר בֵּית יְהוָה"** (ישעיהו ב׳)

יחד נביא את HacKing-DJ לכל העולם! 🌍🎚️

---

**עדכון אחרון:** 2025-12-05

