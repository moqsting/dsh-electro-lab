/**
 * Mount the panel inside the center column and wire open-state side effects:
 * the active attribute on <html>, cross-panel mutual exclusion, and closing
 * when the user picks another sidebar row. Returns one disposer that removes
 * the DOM, the React root and every listener.
 */
export declare function mountElectroLabPanel(): () => void;
/**
 * Mount the nav entry into the sidebar rail exactly like the SSH/task-board/
 * skills panels: a button appended inside the sidebar column root, anchored
 * after the existing entry family, with self-healing observers that re-place
 * it when the shell re-renders. Returns one disposer that removes it.
 */
export declare function mountElectroLabEntry(): () => void;
/** The panel body: title bar with a back-to-session button, tabs, content. */
export declare function ElectroLabPanel(): React.JSX.Element | null;
