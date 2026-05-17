'use client';

import { track } from '@vercel/analytics';
import type { CSSProperties, ReactNode } from 'react';

const APP_LOGIN_URL = 'https://centro-metabolico-pro.vercel.app/login';

interface Props {
  /** Where on the page this CTA lives — recorded as the `location` event prop */
  location: 'header' | 'hero' | 'final-cta' | 'footer';
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * Anchor to the NutriApp Pro login app that emits a Vercel Analytics
 * `login_cta_click` event tagged with the page location. Used to attribute
 * which surface drives the most conversions to the app.
 */
export default function TrackedAppLink({ location, className, style, children }: Props) {
  return (
    <a
      href={APP_LOGIN_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
      onClick={() => track('login_cta_click', { location })}
    >
      {children}
    </a>
  );
}
