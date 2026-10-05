/**
 * ElectroLab shared client UI: themed dialog + buttons and typed-value
 * display helpers. Pure presentational code with no record imports, so any
 * page (record list, detail, editors) can use it without import cycles.
 */
import { type ReactNode } from 'react';
/** Render one typed value as human text. Slot values are returned as "@name" markers. */
export declare function displayValue(value: unknown): string;
/** Shared modal: mask, themed panel, title (optionally with right-side content), body, footer. */
export declare function Dialog({ open, title, width, height, dismissible, headerRight, footer, children, onClose }: {
    open: boolean;
    title: string;
    width?: number;
    /** Fixed panel height: content scrolls within the body. */
    height?: number;
    dismissible?: boolean;
    headerRight?: ReactNode;
    footer?: ReactNode;
    children: ReactNode;
    onClose: () => void;
}): React.JSX.Element | null;
/** Ghost button (secondary action). */
export declare function GhostButton({ children, onClick, disabled, style }: {
    children: ReactNode;
    onClick: () => void;
    disabled?: boolean;
    style?: React.CSSProperties;
}): React.JSX.Element;
/** Primary button (primary action). */
export declare function PrimaryButton({ children, onClick, disabled }: {
    children: ReactNode;
    onClick: () => void;
    disabled?: boolean;
}): React.JSX.Element;
