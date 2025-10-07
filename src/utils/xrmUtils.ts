// utils/xrmUtils.ts
export const getXrm = (): any | null => {
    if ((window as any).Xrm) return (window as any).Xrm;
    if ((window.parent as any)?.Xrm) return (window.parent as any).Xrm;
    return null;
};