# 🔒 מדיניות אבטחה - Security Policy

## 🛡️ תמיכה בגרסאות

אנחנו מספקים עדכוני אבטחה לגרסאות הבאות:

| גרסה | נתמכת          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

---

## 🚨 דיווח על פגיעות אבטחה

אם אתה מוצא פגיעות אבטחה, **אנא אל תפתח Issue ציבורי**. במקום זאת:

### 📧 דיווח פרטי

1. **פתח Security Advisory ב-GitHub:** [github.com/AnLoMinus/HacKing-DJ/security/advisories](https://github.com/AnLoMinus/HacKing-DJ/security/advisories)
   או **שלח email ל:** [לכשיפתח]
2. **כותרת:** `[SECURITY] תיאור קצר של הפגיעות`
3. **כלול:**
   - תיאור מפורט של הפגיעות
   - צעדים לשחזור
   - השפעה פוטנציאלית
   - הצעות לתיקון (אם יש)

### ⏱️ זמן תגובה

- **תגובה ראשונית:** תוך 48 שעות
- **תיקון:** תוך 7-14 ימים (תלוי בחומרה)
- **פרסום:** לאחר תיקון ובדיקה

---

## 🔐 תחומי אבטחה

### חשובים במיוחד:

1. **XSS (Cross-Site Scripting)**
   - הזרקת קוד JavaScript
   - Manipulation של DOM

2. **CSRF (Cross-Site Request Forgery)**
   - פעולות לא מורשות
   - שינוי נתונים

3. **File Upload Vulnerabilities**
   - טעינת קבצים זדוניים
   - Buffer Overflow

4. **Audio Processing Vulnerabilities**
   - Web Audio API exploits
   - Memory leaks

5. **Local Storage Security**
   - חשיפת נתונים רגישים
   - XSS ב-localStorage

---

## ✅ אמצעי אבטחה נוכחיים

### מה שכבר מיושם:

- ✅ **Sanitization** של קלטי משתמש
- ✅ **CORS** headers (אם רלוונטי)
- ✅ **Content Security Policy** (CSP)
- ✅ **HTTPS only** (לכשיפתח)
- ✅ **Input validation** על קבצי אודיו

### מה שצריך להוסיף:

- [ ] **Rate Limiting** (אם נוסיף backend)
- [ ] **Audit Logging**
- [ ] **Encryption** של נתונים רגישים
- [ ] **Security Headers** מלאים
- [ ] **Dependency Scanning**

---

## 🔍 בדיקות אבטחה

### בדיקות מומלצות:

1. **Manual Testing**
   - בדיקת קלטים שונים
   - ניסיון לשבור את המערכת

2. **Automated Scanning**
   - ESLint security plugins
   - npm audit
   - OWASP ZAP

3. **Code Review**
   - ביקורת קוד לפני merge
   - בדיקת dependencies

---

## 📋 Best Practices למפתחים

### כללי:

1. **לעולם אל תאמין לקלט משתמש**
   - Validate כל קלט
   - Sanitize לפני שימוש

2. **השתמש ב-Content Security Policy**
   ```html
   <meta http-equiv="Content-Security-Policy" content="default-src 'self'">
   ```

3. **הימנע מ-eval() ו-Function()**
   - לא בטוח
   - יכול לאפשר XSS

4. **השתמש ב-HTTPS**
   - תמיד
   - גם בפיתוח

5. **עדכן dependencies**
   - npm audit
   - עדכונים קבועים

### ספציפי ל-Web Audio:

1. **בדוק קבצי אודיו לפני טעינה**
   - גודל מקסימלי
   - פורמט תקין
   - לא קבצים זדוניים

2. **הגבל משאבים**
   - Memory limits
   - CPU limits
   - מספר קבצים בו-זמנית

3. **נקה אחרי שימוש**
   - Disconnect nodes
   - Release buffers
   - Close AudioContext

---

## 🐛 דיווח על באגים

באגים שאינם קשורים לאבטחה ניתן לדווח ב:
- **GitHub Repository:** [github.com/AnLoMinus/HacKing-DJ](https://github.com/AnLoMinus/HacKing-DJ)
- **GitHub Issues:** לשאלות ודיווחים

---

## 📚 משאבים נוספים

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Audio API Security](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

---

## 🙏 תודה

תודה על עזרתך לשמור על **HacKing-DJ** בטוח! 🔒

---

## ✨ פסוק מחזק

**"ה׳ שֹׁמְרֶךָ, ה׳ צִלְּךָ עַל יַד יְמִינֶךָ"** (תהילים קכ״א)

השם שומר עלינו - ואנחנו שומרים על הקוד! 🛡️

---

**עדכון אחרון:** 2025-12-05

