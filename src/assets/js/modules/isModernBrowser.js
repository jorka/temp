export function isModernBrowser() {
  return window.CSS && CSS.supports('color', 'var(--fake-var)');
}
