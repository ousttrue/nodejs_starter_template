/*jslint browser: true, continue: true,
  plusplus: true,
  white: true
 */
/*global alert, console, m */

window.addEventListener('load', function () {
    "use strict";
    console.log('loaded');
        
    //カウンター
    var counter = 0;

    //タイマーでカウントアップ
    setInterval(function () {
        counter++;
        m.redraw(true);
    }, 1000);

    //ビュー
    function view() {
        return 'count: ' + counter;
    }

    //HTML要素にコンポーネントをマウント
    m.mount(document.body, { view: view });

});
