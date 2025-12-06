/**
 * Main Entry Point
 * HacKing-DJ
 */

// אתחול כשהדף נטען
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎚️ HacKing-DJ Initializing...');

    try {
        // אתחול i18n ראשון (לפני הכל)
        await i18n.init();

        // אתחול ערכות נושא
        themeManager.init();

        // אתחול Audio Engine
        await audioEngine.init();

        // אתחול Decks
        deckManager.initDeck('A');
        deckManager.initDeck('B');

        // אתחול Mixer
        mixerManager.init();

        // אתחול UI
        uiManager.init();

        // אתחול כפתורי שפה
        initLanguageButtons();

        // אתחול פאנל מיקסינג
        // mixingPanel כבר מאותחל אוטומטית

        console.log('✅ HacKing-DJ Ready!');
    } catch (error) {
        console.error('❌ Error initializing HacKing-DJ:', error);
        alert(i18n.t('common.error', 'שגיאה באתחול התוכנה. אנא רענן את הדף.'));
    }
});

/**
 * אתחול כפתורי החלפת שפה
 */
function initLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const lang = btn.getAttribute('data-lang');
            await i18n.changeLanguage(lang);
        });
    });
}

// טיפול בטעינת אודיו אוטומטית (חלק מהדפדפנים דורשים אינטראקציה)
document.addEventListener('click', async () => {
    if (!audioEngine.initialized) {
        try {
            await audioEngine.init();
            console.log('✅ Audio Engine initialized after user interaction');
        } catch (error) {
            console.error('Error initializing audio:', error);
        }
    }
}, { once: true });

