'use strict';

// namespace the app
  var PP = {};
  var DOM = {};
  var ctx, pickerPaletteCtx, savedCanvas, savedCanvasArray, clipboard, rectangleSelection, historyPointer, drawPathId, ctxOverlay;
  var undoRedoHistory = [];
  var drawHistory = [];

  var classes = {
    selectionCanvas : 'selectionCanvas',
    current: 'current',
    currentTool: 'current-tool',
    dropperMode: 'dropper-mode',
    wait: 'wait',
    tipText: 'tip-text',
    color: 'color',
    transparent: 'transparent',
    activeTab: 'active',
    hidden: 'hidden',
    local: 'local',
    deleteItem: 'delete'
  };

  var mode = {
    dropper : false,
    drawing : false,
    save : false,
    paint : false,
    trill : true
  };

  var action = {
    draw : 'draw',
    fill : 'fill',
    cut : 'cut',
    paste : 'paste',
    save : 'save',
    index : 0
  };

  var copy = {
    selectionOff : 'turn off selection',
    selectionOn : 'save selection',
  };

  var pixel = {
    color: 'rgba(0, 0, 0, 1)',
  };

  var pxon = {
    exif: {
      software: 'http://make8bitart.com'
    },
    pxif: {
      pixels: []
    }
  };

  // you should register your own imgur app here https://api.imgur.com/
  var imgur = {
    clientId: '11112830fafe58a',
  };

  historyPointer = -1;