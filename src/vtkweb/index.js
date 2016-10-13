import RemoteRenderer from 'ParaViewWeb/NativeUI/Canvas/RemoteRenderer';
import { onSizeChange, startListening } from 'ParaViewWeb/Common/Misc/SizeHelper';
/**
 * BEGIN simplified interface
 * @param {string} dataSpec.file  data file where to read the variables from
 * @param {string} dataSpec.variable variable or list of variables to plot (from dataSpec.file)
 * @param {object} dataSpec.subset same as subset in dataSpec.variables.
 *                 Subset is applied to all variables, so we assume
 *                 all variables have the same grid.
 * END simplified interface
 * @param {object[]} dataSpec.variables       The variable from the file to display
 *        A variable contains:
 *          - name: the name of the attribute to plot
 *          - file: the data file where to read the variable from
 *          - subset: a list of dictionary elements, each element has
 *              - name: index variable name
 *              - range: list with lower and upper range for the index varia
 */
export default function remoteRender(canvas, dataSpec, template,
                                     graphicsMethodType, graphicsMethodName) {
  return canvas.session.client()
    .then((client) => {
      // simplified interface
      if (dataSpec.file && dataSpec.variable) {
        if (typeof dataSpec.variable === 'string') {
          dataSpec.variables = [{
            name: dataSpec.variable,
            file: dataSpec.file,
          }];
        } else {
          dataSpec.variables = [];
          for (let i = 0; i < dataSpec.variable.length; i += 1) {
            dataSpec.variables.push({
              name: dataSpec.variable[i],
              file: dataSpec.file,
            });
          }
        }
        if (dataSpec.subset) {
          for (let i = 0; i < dataSpec.variables.length; i += 1) {
            const v = dataSpec.variables[i];
            v.subset = dataSpec.subset;
          }
        }
      }

      client.session.call(
        'cdat.view.create',
        [dataSpec.variables, template,
         graphicsMethodType, graphicsMethodName]).then((windowId) => {
           canvas.windowId = windowId;
           const renderer = new RemoteRenderer(client, canvas.el, windowId);
           onSizeChange(() => {
             renderer.resize();
           });
           startListening();
         });
    });
}
