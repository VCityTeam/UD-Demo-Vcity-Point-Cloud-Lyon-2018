/** @format */

import { Game, itowns } from 'ud-viz';
import { GameView } from 'ud-viz/src/View/GameView/GameView';
import { MenuAvatarView } from '../MenuAvatar/MenuAvatar';
import Constants from 'ud-viz/src/Game/Shared/Components/Constants';
import WorldStateDiff from 'ud-viz/src/Game/Shared/WorldStateDiff';
import WorldState from 'ud-viz/src/Game/Shared/WorldState';

import './GameApp.css';
import {
  LayerManager,
  TilesManager,
} from 'ud-viz/src/Widgets/Components/Components';

export class GameApp {
  constructor(webSocketService, assetsManager, config) {
    this.gameView = null;
    this.assetsManager = assetsManager;
    this.webSocketService = webSocketService;

    this.worldStateInterpolator = null;

    this.config = config;
  }

  start(onLoad, firstGameView, isGuest) {
    const _this = this;

    const worldStateInterpolator = new Game.Components.WorldStateInterpolator(
      this.config.worldStateInterpolator
    );
    this.worldStateInterpolator = worldStateInterpolator;

    this.gameView = new GameView({
      assetsManager: this.assetsManager,
      stateComputer: worldStateInterpolator,
      config: this.config,
      firstGameView: firstGameView,
    });

    const onFirstStateJSON = function (json) {
      const state = new WorldState(json.state);
      _this.worldStateInterpolator.onFirstState(state);
      _this.gameView.onFirstState(state, json.avatarUUID);

      addBaseMapLayer();
      addElevationLayer();
      add3DTilesLayer();
    };

    /**
     * Adds WMS elevation Layer of Lyon in 2012 and WMS imagery layer of Lyon in 2009 (from Grand Lyon data).
     */
    const addBaseMapLayer = function () {
      let wmsImagerySource = new itowns.WMSSource({
        extent: _this.gameView.extent,
        name: _this.config['background_image_layer']['name'],
        url: _this.config['background_image_layer']['url'],
        version: _this.config['background_image_layer']['version'],
        projection: _this.config['projection'],
        format: _this.config['background_image_layer']['format'],
      });

      // Add a WMS imagery layer
      let wmsImageryLayer = new itowns.ColorLayer(
        _this.config['background_image_layer']['layer_name'],
        {
          updateStrategy: {
            type: itowns.STRATEGY_DICHOTOMY,
            options: {},
          },
          source: wmsImagerySource,
          transparent: true,
        }
      );
      _this.gameView.getItownsView().addLayer(wmsImageryLayer);
    };

    const addElevationLayer = function () {
      // Add a WMS elevation source
      let wmsElevationSource = new itowns.WMSSource({
        extent: _this.gameView.extent,
        url: _this.config['elevation_layer']['url'],
        name: _this.config['elevation_layer']['name'],
        projection: _this.config['projection'],
        heightMapWidth: 256,
        format: _this.config['elevation_layer']['format'],
      });
      // Add a WMS elevation layer
      let wmsElevationLayer = new itowns.ElevationLayer(
        _this.config['elevation_layer']['layer_name'],
        {
          useColorTextureElevation: true,
          colorTextureElevationMinZ: 149,
          colorTextureElevationMaxZ: 622,
          source: wmsElevationSource,
        }
      );
      _this.gameView.getItownsView().addLayer(wmsElevationLayer);
    };

    const add3DTilesLayer = function () {
      const $3DTilesLayer = new itowns.C3DTilesLayer(
        _this.config['3DTilesLayer']['id'],
        {
          name: 'Lyon-2015-'.concat(_this.config['3DTilesLayer']['id']),
          source: new itowns.C3DTilesSource({
            url: _this.config['3DTilesLayer']['url'],
          }),
        },
        _this.gameView.getItownsView()
      );

      itowns.View.prototype.addLayer.call(
        _this.gameView.getItownsView(),
        $3DTilesLayer
      );
    };

    // Register callbacks
    this.webSocketService.on(
      Constants.WEBSOCKET.MSG_TYPES.JOIN_WORLD,
      (firstStateJSON) => {
        if (!firstStateJSON) throw new Error('no data');
        console.log('JOIN_WORLD ', firstStateJSON);

        //TODO mettre un flag initialized a la place de check this.view (wait refacto ud-vizView)
        if (!_this.gameView.getItownsView()) {
          //view was not intialized do it
          onFirstStateJSON(firstStateJSON);
        } else {
          //this need to be disposed
          _this.gameView.dispose();

          //reset websocketservices
          _this.webSocketService.reset([
            Constants.WEBSOCKET.MSG_TYPES.JOIN_WORLD,
            Constants.WEBSOCKET.MSG_TYPES.WORLDSTATE_DIFF,
          ]);

          _this.start(
            onFirstStateJSON.bind(_this, firstStateJSON),
            false,
            isGuest
          );
        }
      }
    );

    this.webSocketService.on(
      Constants.WEBSOCKET.MSG_TYPES.WORLDSTATE_DIFF,
      (diffJSON) => {
        worldStateInterpolator.onNewDiff(new WorldStateDiff(diffJSON));
      }
    );

    //register in tick of the gameview
    this.gameView.addTickRequester(function () {
      _this.gameView
        .getInputManager()
        .sendCommandsToServer(_this.webSocketService);
    });

    if (!isGuest) {
      //INIT UI
      const menuAvatarButton = document.createElement('div');
      menuAvatarButton.classList.add('button_GameApp');
      menuAvatarButton.innerHTML = 'Menu Avatar';
      this.gameView.appendToUI(menuAvatarButton);

      //INIT CALLBACKS
      menuAvatarButton.onclick = function () {
        const menuAvatar = new MenuAvatarView(
          _this.webSocketService,
          _this.config,
          _this.assetsManager
        );

        menuAvatar.setOnClose(function () {
          //render view
          _this.gameView.setPause(false);
          _this.gameView.getInputManager().setPause(false);
          //remove html
          menuAvatar.dispose();
          //append html
          document.body.appendChild(_this.gameView.html());
        });

        //remove html
        _this.gameView.html().remove();
        //stop rendering view
        _this.gameView.setPause(true);
        _this.gameView.getInputManager().setPause(true);
        //add menuavatar view
        document.body.appendChild(menuAvatar.html());
      };
    }


    onLoad();
  }
}
