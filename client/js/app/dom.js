(function(){
    DOM = {
      $window : $(window),
      $body : $('body'),

      $color : $('.color'),
      $colorHistoryModule : $('#color-history'),
      
      $colorCustomPalette : $('.color-custom-list'),
      $pickers : $('#pickers'),
      $customPalettes : $('#custom-palettes'),
      $defaultPalettes : $('#default-palettes'),
      $8bitPicker : $('#eight-bit-colors'),
      $colorPickerDemo : $('.color-demo'),
      $hex : $('#hex-color'),
      $dropper : $('#color-dropper'),

      $toolButtons: $('.icon-button'),

      $pencil : $('#pencil'),
      $paint : $('#paint'),

      $buttonNewCanvas : $('#new-canvas'),
      $buttonSaveLocal : $('#save-local'),
      $buttonSaveFull : $('#save-full'),
      $buttonSaveSelection : $('#save-selection'),
      $buttonSaveImgur : $('#save-imgur'),
      $buttonOpenFile : $('#open-file'),
      $buttonOpenLocal : $('#open-local'),
      $buttonImportPXON : $('#import-pxon'),
      $buttonExportPXON : $('#export-pxon'),
      $buttonExportLed : $('#export-led'),

      $pixelSizeInput : $('.pixel-size-input'),
      $pixelSizeDemoDiv : $('#pixel-size-demo'),

      $minimizedToolsList : $('#minimized-tools-list'),
      $draggydivs : $('.draggy'),
      $saveInstruction : $('.instructions.save'),
      $pasteInstructions : $('.instructions.paste'),

      $undo : $('#undo'),
      $redo : $('#redo'),

      $cut : $('#cut'),
      $copy : $('#copy'),
      $paste : $('#paste'),

      $modalContainers : $('.modal'),
      $modalExit : $('.modal .ui-hider'),

      $saveModalContainer : $('#save-modal-container'),
      $saveImg : $('#finished-art'),
      $linkImgur : $('#link-imgur'),

      $openLocalModalContainer : $('#open-modal-container'),
      $openFile: $('#open-file'),
      $openLocalForm : $('#open-local-form'),
      $openLocal: $('#open-local'),
      $openLocalGallery : $('#open-modal .gallery'),
      $openLocalGalleryItems : $('#open-modal .gallery li'),
      $colorHistoryTools : {
        clearPalette: $('#color-history-tools .clear'),
        exportPalette: $('#color-history-tools .export'),
      },

      $colorCustomTools : {
        clearPalette: $('#color-custom-tools .clear'),
        importPalette: $('#color-custom-tools .import')
      }
    }
}())

var windowCanvas = {
    height: DOM.$window.height() - (DOM.$window.height() % 15),
    width: DOM.$window.width() - (DOM.$window.width() % 15),
    background: 'url("assets/bg.png")'
};

DOM.$customPalettes.addClass(classes.hidden);