import Promise from '../promise';
import isofill from './isofill';

function asyncPlot(canvas, dataObject, template,
                   graphicsMethodType, graphicsMethodName) {
  let plotObject;
  const spec = Object.assign(
    { el: canvas.el },
    dataObject
  );
  switch (graphicsMethodType) {
    case 'isofill':
      plotObject = isofill(spec);
      break;
    default:
      throw new Error(`Invalid graphicsMethodType:  ${graphicsMethodType}`);
  }
  return plotObject;
}

export default function dispatch(dataObject, template,
                                 graphicsMethodType, graphicsMethodName) {
  return Promise.method(asyncPlot)(dataObject, template,
                                   graphicsMethodType, graphicsMethodName);
}
