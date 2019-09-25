function getCursorPosition(element) {
  var el = $(element).get(0);
  var pos = 0;
  if ('selectionStart' in el) {
    pos = el.selectionStart;
  } else if ('selection' in document) {
    el.focus();
    var Sel = document.selection.createRange();
    var SelLength = document.selection.createRange().text.length;
    Sel.moveStart('character', -el.value.length);
    pos = Sel.text.length - SelLength;
  }
  return pos;
}

function setSelectionRange(input, selectionStart, selectionEnd) {
  if (input.setSelectionRange) {
    input.focus();
    input.setSelectionRange(selectionStart, selectionEnd);
  }
  else if (input.createTextRange) {
    var range = input.createTextRange();
    range.collapse(true);
    range.moveEnd('character', selectionEnd);
    range.moveStart('character', selectionStart);
    range.select();
  }
}

// $(document).ready(function () { //document ready  dikkat !


$(".sayi_kutusu").keydown(function (event) {
  var ondalik_uzunluk = 8;
  var tam_sayi_uzunluk = 6;
  var imlec_yeri = getCursorPosition($(this));
  var t = ($(this).val()).toString();
  if (event.keyCode == 188 || event.keyCode == 110 || event.keyCode == 190) {
    event.preventDefault();
    if (t.indexOf(".") == -1) {
      if (imlec_yeri < t.length) {
        var t = t.slice(0, imlec_yeri) + "." + t.slice(imlec_yeri, t.length);

      } else {
        t = t + ".";
      }
      $(this).val(t);
      setSelectionRange(this, imlec_yeri + 1, imlec_yeri + 1);
    }
    else {
      $(this).val(t);
    }
  }
  else if ((event.keyCode > 47 && event.keyCode < 58) || (event.keyCode > 95 && event.keyCode < 106)) {
    if (t.indexOf(".") != -1) {
      var sayi = t.split(".");
      if ((sayi[1].length > (ondalik_uzunluk - 1) && (sayi[0].length + 1 < imlec_yeri)) || (sayi[0].length > tam_sayi_uzunluk && (sayi[0].length + 1 > imlec_yeri))) {
        event.preventDefault();
        return false;
      }
    }
    else {
      if (t.length > tam_sayi_uzunluk) {
        event.preventDefault();
        return false;
      }
    }
  }
  else if (!(event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 17 || event.keyCode == 13 || event.keyCode == 27 || event.keyCode == 35 || event.keyCode == 36 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 40 || event.keyCode == 45 || event.keyCode == 46 || (event.keyCode > 95 && event.keyCode < 106) || (event.keyCode > 47 && event.keyCode < 58)  )) {
    event.preventDefault();
    return false;
  }
});

// }); //document ready son
