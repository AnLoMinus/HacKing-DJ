# 🤝 מדריך תרומה - Contributing Guide

תודה על העניין שלך לתרום ל-**HacKing-DJ**! 🎚️⚡

---

## 📋 תוכן עניינים

1. [קוד התנהגות](#קוד-התנהגות)
2. [איך אני יכול לתרום?](#איך-אני-יכול-לתרום)
3. [תהליך פיתוח](#תהליך-פיתוח)
4. [סטנדרטי קוד](#סטנדרטי-קוד)
5. [Commit Messages](#commit-messages)
6. [Pull Requests](#pull-requests)
7. [שאלות נפוצות](#שאלות-נפוצות)

---

## 📜 קוד התנהגות

פרויקט זה מחויב לקוד התנהגות. על ידי השתתפות, אתה מסכים לכבד את הקוד.

**עקרונות:**
- ✅ כבוד הדדי
- ✅ פתיחות לרעיונות
- ✅ ביקורת בונה
- ✅ סבלנות
- ❌ אין הטרדה
- ❌ אין התנהגות פוגענית

---

## 💡 איך אני יכול לתרום?

### 1. דיווח על באגים 🐛

אם מצאת באג:

1. בדוק אם הוא כבר דווח ב-Issues
2. אם לא, פתח Issue חדש עם:
   - תיאור מפורט
   - צעדים לשחזור
   - התנהגות צפויה vs מציאות
   - סביבה (דפדפן, OS)
   - צילומי מסך (אם רלוונטי)

### 2. הצעת תכונות 💡

יש לך רעיון לתכונה חדשה?

1. בדוק את [ROADMAP.md](ROADMAP.md)
2. פתח Issue עם:
   - תיאור התכונה
   - למה זה יעזור
   - איך זה יעבוד
   - דוגמאות שימוש

### 3. שיפור קוד 💻

רוצה לכתוב קוד?

1. **Fork** את הפרויקט
2. **צור Branch** חדש:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **עשה שינויים**
4. **Commit** עם הודעות ברורות:
   ```bash
   git commit -m "Add amazing feature"
   ```
5. **Push** ל-GitHub:
   ```bash
   git push origin feature/amazing-feature
   ```
6. **פתח Pull Request**

### 4. שיפור תיעוד 📚

תיעוד טוב חשוב מאוד!

- תיקון שגיאות כתיב
- הוספת דוגמאות
- שיפור הסברים
- תרגום למשתמשים

### 5. עיצוב ו-UX 🎨

שיפורי עיצוב תמיד מבורכים!

- שיפורי UI
- אנימציות
- Responsive Design
- נגישות (Accessibility)

---

## 🔧 תהליך פיתוח

### הגדרת סביבת פיתוח

1. **Fork** את הפרויקט
2. **Clone** את ה-Fork שלך:
   ```bash
   git clone https://github.com/YOUR_USERNAME/HacKing-DJ.git
   cd HacKing-DJ
   ```
3. **צור Branch** חדש:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### עבודה על תכונה

1. **תכנן** את השינויים
2. **כתוב קוד** נקי ומתועד
3. **בדוק** שהכל עובד
4. **עדכן תיעוד** אם צריך
5. **Commit** עם הודעות ברורות

### לפני Pull Request

- [ ] הקוד עובד
- [ ] אין שגיאות Console
- [ ] תיעוד עודכן
- [ ] Commit messages ברורים
- [ ] בדקת על דפדפנים שונים

---

## 📝 סטנדרטי קוד

### JavaScript

```javascript
// ✅ טוב
function loadTrack(deckId, file) {
    if (!file) {
        console.error('No file provided');
        return;
    }
    // ...
}

// ❌ רע
function loadTrack(d,i){if(!i)return;...}
```

**כללים:**
- שימוש ב-`const` ו-`let` (לא `var`)
- פונקציות עם שמות ברורים
- הערות בעברית או אנגלית
- Indentation של 2 או 4 רווחים
- Semicolons (אופציונלי, אבל עקבי)

### CSS

```css
/* ✅ טוב */
.deck-controls {
    display: flex;
    gap: 10px;
    padding: 20px;
}

/* ❌ רע */
.deck-controls{display:flex;gap:10px;padding:20px;}
```

**כללים:**
- Indentation עקבי
- שמות ברורים
- הערות לקטעים מורכבים
- סדר לוגי של properties

### HTML

```html
<!-- ✅ טוב -->
<section class="deck deck-a" id="deck-a">
    <div class="deck-header">
        <h2>Deck A</h2>
    </div>
</section>

<!-- ❌ רע -->
<section class="deck deck-a" id="deck-a"><div class="deck-header"><h2>Deck A</h2></div></section>
```

**כללים:**
- Indentation עקבי
- תגיות סגורות
- Attributes מסודרים
- Semantic HTML

---

## 💬 Commit Messages

### פורמט

```
<type>: <subject>

<body>

<footer>
```

### Types

- `feat`: תכונה חדשה
- `fix`: תיקון באג
- `docs`: שינוי תיעוד
- `style`: שינוי עיצוב (לא משפיע על קוד)
- `refactor`: refactoring
- `test`: הוספת/שינוי בדיקות
- `chore`: משימות תחזוקה

### דוגמאות

```
feat: add loop functionality to decks

Added basic loop controls with 4/8/16 beat options.
Users can now set loop points and toggle loops on/off.

Closes #123
```

```
fix: waveform not rendering on mobile

Fixed canvas sizing issue on mobile devices.
Waveform now scales correctly on all screen sizes.

Fixes #456
```

---

## 🔀 Pull Requests

### לפני פתיחת PR

1. **עדכן** את ה-Branch שלך:
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-branch
   git rebase main
   ```

2. **בדוק** שהכל עובד:
   - פתח את `index.html` בדפדפן
   - בדוק שהתכונה עובדת
   - בדוק שאין שגיאות Console

3. **כתוב תיאור טוב:**
   - מה השינוי?
   - למה זה נחוץ?
   - איך זה עובד?
   - צילומי מסך (אם רלוונטי)

### תהליך Review

1. Maintainer יבדוק את ה-PR
2. יתכן שיהיו הערות לשינויים
3. תעשה את השינויים הנדרשים
4. ה-PR יאושר וי-merge

---

## ❓ שאלות נפוצות

### איפה אני יכול לשאול שאלות?

- **GitHub Repository:** [github.com/AnLoMinus/HacKing-DJ](https://github.com/AnLoMinus/HacKing-DJ)
- **GitHub Issues:** לשאלות טכניות ודיווח על באגים
- **YouTube:** [@HacKing-DJ](https://www.youtube.com/@HacKing-DJ)

### איך אני בוחר על מה לעבוד?

- בדוק את [ROADMAP.md](ROADMAP.md)
- חפש Issues עם תווית `good first issue`
- שאל ב-Discussions

### מה אם אני לא יודע איך לעשות משהו?

זה בסדר! שאל שאלות, אנחנו כאן לעזור.

---

## 🎯 תחומי תרומה מבוקשים

1. **תמיכה בפורמטים נוספים** - FLAC, OGG, וכו'
2. **שיפורי ביצועים** - אופטימיזציה
3. **תמיכה במובייל** - Responsive Design
4. **תרגום** - שפות נוספות
5. **בדיקות** - Unit tests, E2E tests
6. **תיעוד** - מדריכים, API docs

---

## 🙏 תודה!

כל תרומה, קטנה או גדולה, חשובה מאוד! 🎧⚡

---

## ✨ פסוק מחזק

**"טוֹב לְהֹדוֹת לַיהוה"** (תהילים צ״ב)

תודה על כל תרומה - יחד אנחנו בונים משהו מדהים! 🙏🔥

---

**עדכון אחרון:** 2025-12-05

