/** @format */

import * as udviz from 'ud-viz';

const app = new udviz.Templates.AllWidget();

app.start('../assets/config/config.json').then(() => {
  const layerManager = app.view3D.getLayerManager();

  ////// ABOUT MODULE
  const about = new udviz.Widgets.AboutWindow();
  app.addModuleView('about', about);
  ////// LAYER CHOICE MODULE
  const layerChoice = new udviz.Widgets.LayerChoice(layerManager);
  app.addModuleView('layerChoice', layerChoice);

  ////// 3DTILES DEBUG
  const debug3dTilesWindow = new udviz.Widgets.Debug3DTilesWindow(
    layerManager
  );
  app.addModuleView('3dtilesDebug', debug3dTilesWindow, {
    name: '3DTiles Debug',
  });

  const cameraPosition = new udviz.Widgets.CameraPositionerView(
    app.view3D.getItownsView(),
    app.controls
  );
  app.addModuleView('cameraPositioner', cameraPosition);
});
