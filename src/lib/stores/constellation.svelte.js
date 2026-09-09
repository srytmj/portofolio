// Reactive store for active constellation figure in hero canvas.
const defaultFigure = {
  id: 'Cap',
  name: 'Capricornus',
  coords: 'RA 21h 00m · Dec -20°'
};

export const constellation = $state({
  figure: defaultFigure,
  // True once a figure has actually been revealed (pointer proximity on
  // desktop, the auto-cycle on touch). Until then the HUD explains the
  // interaction instead of printing coordinates nobody asked for.
  traced: false
});

export function setConstellationFigure(fig) {
  if (fig && fig.name) {
    constellation.figure = fig;
    constellation.traced = true;
  }
}
