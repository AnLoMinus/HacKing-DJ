# 📌 Backlog ממוקד - HacKing-DJ

המסמך מרכז משימות ברמת Epic/Story בהתאם למצב הנוכחי והחזון העתידי.

## 🧭 עקרונות עדיפות
- **ערך למשתמשי DJ מתחילים ומתקדמים** קודם.
- **איכות סאונד וביצועים בזמן אמת** מעל פיצ'רים ניסיוניים.
- **נגישות ודפדפנים נתמכים**: Chrome, Firefox, Edge, Safari עדכניות; מובייל Android/iOS אחרון.

## 🎯 מדדי הצלחה (KPIs)
- **Latency אינטראקטיבי**: פחות מ־30ms לתגובת כפתורים (Play/Cue) במדידות Lighthouse/Profiler.
- **CPU שימוש**: עמידה מתחת ל־60% במכשירי ביניים (Chrome DevTools Performance) בזמן שני דקים פעילים + ויזואליזר.
- **יציבות אודיו**: אפס דרופאוטים/קליפים ב־10 דק' ריצה (בדיקות מעבדה).
- **תאימות דפדפן**: CI Smoke ב-Chrome/Firefox/Edge/Safari; ≥95% בדיקות ירוקות.
- **Mobile Touch UX**: פינג'רים (Tap/Drag) עוברים בדיקות QA ידניות ב-Android/iOS.

## 🚀 Epic 1: חוויית מיקס בסיסית חזקה (v0.2.0)
- Story: **Visualizer בזמן אמת** עם FFT ו-VU meters אינטראקטיביים.
- Story: **EQ מלא** (Low/Mid/High) עם מדדים ויזואליים לכל דק.
- Story: **Waveform אינטראקטיבי** המאפשר קפיצה מדויקת בנגן.
- Story: **שיפורי יציבות אודיו** – מנגנון anti-clipping והתראה על עומס.
- Story: **Hardening תאימות** – בדיקות smoke רב-דפדפנים ופרופיל ביצועים בסיסי.

## 🎛️ Epic 2: קיואים ולופים חכמים (v0.3.0)
- Story: **Cue Points מרובים** (עד 8) עם Hot Cues צבעוניים.
- Story: **Loops 4/8/16** עם Auto-loop ו-Loop Roll.
- Story: **Beat Grid** בסיסי לאנליזת קצב ידנית.
- Story: **Preview/Cue hold** להאזנה מהדק השני ללא שליחה למאסטר.

## ⏱️ Epic 3: BPM & Tempo Mastery (v0.4.0)
- Story: **BPM Detection** אוטומטי עם fallback ידני.
- Story: **Auto Sync** בין דקים כולל Tempo Lock.
- Story: **Beat Matching Visual** – עזר ויזואלי עם סטטוס drift.
- Story: **Key Detection** למיקסים הרמוניים.

## 🎵 Epic 4: ספריית מוזיקה מתקדמת (v0.5.0)
- Story: **Drag & Drop פלייליסט→דקים** עם עמידה במובייל/טאץ'.
- Story: **ניהול פלייליסטים** עם LocalStorage, חיפוש/סינון, Metadata Editor.
- Story: **Import/Export** פלייליסטים, כולל ולידציות פורמט.
- Story: **Sets מוכנים** לשימוש בהופעות.

## 🎙️ Epic 5: הקלטה ואופטימיזציה (v0.6.0)
- Story: **Recording** באמצעות MediaRecorder + הורדה (WAV/MP3).
- Story: **שמירת סטים** במערכת ושיתוף מקומי.
- Story: **Performance Optimization** – בדיקות Profiler, הפחתת GC ו-Latency.
- Story: **תמיכה בפורמטים מורחבים** ובדיקות רגרסיה.

## 🎚️ Epic 6: אינטגרציות מקצועיות (v1.0.0)
- Story: **Web MIDI Support** לקונטרולרים נפוצים.
- Story: **Effects Rack** (Reverb/Delay/Distortion) עם מיפוי MIDI.
- Story: **Sampler Pads** עם טעינת Stems/One-shots.
- Story: **Cloud/Share** – סנכרון סטים ושיתוף בסיסי.

## 🧪 Backlog תומך (חוצה גרסאות)
- Story: **נגישות** – תמיכה במקלדת ו-ARIA עבור רכיבי שליטה.
- Story: **Analytics בסיסי** למדידת שימוש בפיצ'רים וביצועים (פרטיות קפדנית).
- Story: **Hardening אבטחה** – בדיקות Content Security Policy ו-OWASP Top 10 לדפדפן.
- Story: **תיעוד וחוויית Onboarding** – מדריכי וידאו/טקסט וחבילת דוגמאות אודיו.
