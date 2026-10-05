import { ArticleFormat } from '../generate.ts';
/**
 * The setup dialog for one format (the dialog never switches formats — the
 * caller picks Markdown or LaTeX by which button opened it).
 */
export declare function GenerationSetupDialog({ open, format, recordId, onClose }: {
    open: boolean;
    format: ArticleFormat;
    recordId: string;
    onClose: () => void;
}): React.JSX.Element | null;
/**
 * The generation overlay: the progress dialog and the minimized status pill,
 * rendered in a body-level React root (panel.tsx). Driven by the module-level
 * generation store, so a running job survives any navigation.
 */
export declare function GenerationOverlay(): React.JSX.Element | null;
