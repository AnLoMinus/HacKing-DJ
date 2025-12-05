/**
 * Markdown Renderer - מערכת רינדור מסמכים
 * HacKing-DJ
 */

class MarkdownRenderer {
    constructor() {
        this.modal = null;
        this.initModal();
    }

    /**
     * אתחול חלון מודל
     */
    initModal() {
        // יצירת מודל אם לא קיים
        if (!document.getElementById('doc-modal')) {
            const modalHTML = `
                <div id="doc-modal" class="doc-modal">
                    <div class="doc-modal-content">
                        <div class="doc-modal-header">
                            <h2 id="doc-modal-title"></h2>
                            <button class="doc-modal-close" id="doc-modal-close">&times;</button>
                        </div>
                        <div class="doc-modal-body" id="doc-modal-body"></div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Event listeners
            document.getElementById('doc-modal-close').addEventListener('click', () => {
                this.closeModal();
            });
            
            document.getElementById('doc-modal').addEventListener('click', (e) => {
                if (e.target.id === 'doc-modal') {
                    this.closeModal();
                }
            });
            
            // ESC key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal && this.modal.style.display === 'block') {
                    this.closeModal();
                }
            });
        }
        
        this.modal = document.getElementById('doc-modal');
    }

    /**
     * טעינת מסמך Markdown והצגתו
     */
    async loadDocument(filePath, title) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Failed to load document: ${filePath}`);
            }
            
            const markdown = await response.text();
            const html = this.markdownToHTML(markdown);
            
            document.getElementById('doc-modal-title').textContent = title || filePath;
            document.getElementById('doc-modal-body').innerHTML = html;
            
            this.openModal();
        } catch (error) {
            console.error('Error loading document:', error);
            alert(i18n.t('common.error', 'שגיאה') + ': ' + error.message);
        }
    }

    /**
     * המרת Markdown ל-HTML (פשוט)
     */
    markdownToHTML(markdown) {
        let html = markdown;
        
        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        
        // Bold
        html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
        
        // Italic
        html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
        
        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank">$1</a>');
        
        // Code blocks
        html = html.replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>');
        html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');
        
        // Lists
        html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
        html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
        html = html.replace(/^(\d+)\. (.*$)/gim, '<li>$2</li>');
        
        // Wrap consecutive list items
        html = html.replace(/(<li>.*<\/li>\n?)+/gim, '<ul>$&</ul>');
        
        // Paragraphs
        html = html.split('\n\n').map(para => {
            if (para.trim() && !para.match(/^<[hul]/)) {
                return '<p>' + para.trim() + '</p>';
            }
            return para;
        }).join('\n');
        
        // Horizontal rules
        html = html.replace(/^---$/gim, '<hr>');
        
        return html;
    }

    /**
     * פתיחת מודל
     */
    openModal() {
        if (this.modal) {
            this.modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * סגירת מודל
     */
    closeModal() {
        if (this.modal) {
            this.modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
}

// יצירת instance גלובלי
const markdownRenderer = new MarkdownRenderer();

// הוספת event listeners לקישורי מסמכים
document.addEventListener('DOMContentLoaded', () => {
    // עדכון קישורי מסמכים בפוטר
    document.querySelectorAll('footer a[href$=".md"], footer a[href$="LICENSE"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filePath = link.getAttribute('href');
            const title = link.textContent.trim();
            markdownRenderer.loadDocument(filePath, title);
        });
    });
});

