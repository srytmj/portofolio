// Reactive store for active constellation figure in hero canvas.
const defaultFigure = {
  id: 'Cap',
  name: 'Capricornus',
  coords: 'RA 21h 00m · Dec -20°'
};

export const constellation = $state({
  figure: defaultFigure
});

export function setConstellationFigure(fig) {
  if (fig && fig.name) {
    constellation.figure = fig;
  }
}
