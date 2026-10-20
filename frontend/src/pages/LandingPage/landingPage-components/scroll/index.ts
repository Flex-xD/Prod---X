import { animate } from 'framer-motion';
import { useEffect, useState } from 'react';

/** Height of the sticky navbar (h-16). Sections are scrolled to just below it. */
export const NAV_OFFSET = 64;

export const SECTION_IDS = ['how-it-works', 'record', 'features', 'groups'] as const;

const reducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let running: { stop: () => void } | null = null;

/**
 * Animated scroll to a section. Uses an eased tween (instead of the browser's
 * fixed smooth-scroll) so the duration scales with distance, can be interrupted
 * by the user, and ends by marking the section as "arrived" so its heading
 * briefly highlights. Respects prefers-reduced-motion.
 */
export function scrollToSection(id: string): void {
    const el = document.getElementById(id);
    if (!el) return;

    running?.stop();

    const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET);

    const arrive = () => {
        running = null;
        history.replaceState(history.state, '', `#${id}`);
        el.dataset.arrived = 'true';
        window.setTimeout(() => {
            delete el.dataset.arrived;
        }, 1400);
        const heading = el.querySelector<HTMLElement>('h2');
        if (heading) {
            heading.tabIndex = -1;
            heading.focus({ preventScroll: true });
        }
    };

    if (reducedMotion()) {
        window.scrollTo({ top, behavior: 'instant' });
        arrive();
        return;
    }

    const distance = Math.abs(top - window.scrollY);
    const controls = animate(window.scrollY, top, {
        duration: Math.min(1.1, 0.35 + distance / 3000),
        ease: [0.22, 0.61, 0.36, 1],
        onUpdate: (value) => window.scrollTo({ top: value, behavior: 'instant' }),
        onComplete: arrive,
    });
    running = controls;

    // Any manual scroll input cancels the animation so the page never fights the user.
    const cancel = () => {
        controls.stop();
        running = null;
    };
    window.addEventListener('wheel', cancel, { once: true, passive: true });
    window.addEventListener('touchstart', cancel, { once: true, passive: true });
    window.addEventListener('keydown', cancel, { once: true });
}

/** Which nav section is currently under the reading line (null above the first section). */
export function useActiveSection(ids: readonly string[]): string | null {
    const [active, setActive] = useState<string | null>(null);

    useEffect(() => {
        const elements = ids
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActive(entry.target.id);
                });
            },
            { rootMargin: '-35% 0px -60% 0px' },
        );
        elements.forEach((el) => observer.observe(el));

        const onScroll = () => {
            const first = elements[0];
            if (first && first.getBoundingClientRect().top > window.innerHeight * 0.6) setActive(null);
        };
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', onScroll);
        };
    }, [ids]);

    return active;
}