(function(){

  importJS('js/sprintf.js');
  importJS('js/preload-image.js');
  importJS('js/sudoku-model.js');

  var $editor;
  var $selected = null;
  var resizeTimer = false;

  // 画像などをプリロード
  function preload(){
    for (var i = 0; i < 9; i++) {
      var n = i+1;
      preloadImage('img/number/b'+n+'.png');
      preloadImage('img/number/br'+n+'.png');
    };
  }

  function refresh(){
    var w = $editor.width();
    $editor.height(w);
  }

  // セルがクリックされたとき
  function cellClicked(cell,x,y){
    var $cell = $(cell);
    if($selected != null){
      $selected.removeClass('selected');
      // $selected.html(''); // only for test
    }

    $selected = $cell;
    $selected.html('<img src="img/number/b'+(x+1)+'.png" style="width:100%;height:100%;"/>');  // only for test
    $cell.addClass('selected');
  }

  // 画面のリサイズが終了した時点で行う処理
  function windowResized(){ 
    refresh();
  }

  // 初期化処理
  function initialize(){
    $editor = $('#editor');
    refresh();

    // リサイズ処理
    // see http://www.webdesignleaves.com/wp/jquery/577/
    $(window).resize(function() {
      if (resizeTimer !== false) {
        clearTimeout(resizeTimer);
      }
      resizeTimer = setTimeout(function() {
        windowResized();
      }, 200);
    });

    // セルの配置
    // see http://jsperf.com/innerhtml-vs-addattribute-later
    var container = document.getElementById('cell_container');
    for (var y=0; y<9; y++) {
      for (var x=0; x<9; x++) {
        var cell = document.createElement('div');
        cell.setAttribute('id','c'+(x + y*9));
        cell.setAttribute('class','cell x'+x+' y'+y);
        cell.setAttribute('data-pos',''+(x + y*9));
        container.appendChild(cell);
      };
    };

    // clickだとiPhoneで300ms遅延がある
    // see http://text.moroya.net/entry/2013/05/06/122013
    $editor.on('tap click', function(e){

      // セルが背面にありクリックできないので、座標から探索
      e.preventDefault();

      var offset = $editor.offset();
      var w = $editor.width();
      var w_9 = w/9;
      var pageX = (e.type === 'tap')? e.x : e.pageX;
      var pageY = (e.type === 'tap')? e.y : e.pageY;
      var px = pageX - offset.left;
      var py = pageY - offset.top;
      var x = Math.floor(px / w_9);
      var y = Math.floor(py / w_9);

      // printf("#{x}, #{y}", {x: x, y: y});

      var target = document.getElementById('c'+(x + y*9));
      cellClicked(target,x,y);

      // return false;
    });
  }

  // ===================

  jQuery(function($){
    preload();
    initialize();
  });

})();