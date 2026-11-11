import { describe, it, expect } from 'vitest';
import { createEmailMessage, plainTextToHtml } from './utl.js';

describe('plain-text bodies get an HTML part so Gmail keeps line breaks', () => {
    it('converts lines and blank lines to Gmail-style divs, escaping HTML', () => {
        expect(plainTextToHtml('Hi <Liz> & co,\n\nLine two\r\nLine three'))
            .toBe('<div dir="ltr"><div>Hi &lt;Liz&gt; &amp; co,</div><div><br></div><div>Line two</div><div>Line three</div></div>');
    });

    it('builds multipart/alternative when only body is given', () => {
        const raw = createEmailMessage({ to: ['a@b.com'], subject: 'S', body: 'One\n\nTwo', mimeType: 'text/plain' });
        expect(raw).toContain('Content-Type: multipart/alternative');
        expect(raw).toContain('Content-Type: text/plain; charset=UTF-8');
        expect(raw).toContain('<div>One</div><div><br></div><div>Two</div>');
    });

    it('keeps a caller-supplied htmlBody untouched', () => {
        const raw = createEmailMessage({ to: ['a@b.com'], subject: 'S', body: 'x', htmlBody: '<p>custom</p>', mimeType: 'multipart/alternative' });
        expect(raw).toContain('<p>custom</p>');
        expect(raw).not.toContain('<div dir="ltr">');
    });
});
