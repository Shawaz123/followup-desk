import type { ReactNode, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };
type Icon = (props: IconProps) => ReactNode;
const icon = (children: ReactNode): Icon => ({ size = 24, ...props }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{children}</svg>;

export const Activity = icon(<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>);
export const CalendarDays = icon(<><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></>);
export const Check = icon(<polyline points="20 6 9 17 4 12"/>);
export const ChevronDown = icon(<polyline points="6 9 12 15 18 9"/>);
export const CirclePlus = icon(<><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></>);
export const Clock3 = icon(<><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>);
export const Search = icon(<><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></>);
export const Trash2 = icon(<><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5"/></>);
export const X = icon(<path d="m18 6-12 12M6 6l12 12"/>);
