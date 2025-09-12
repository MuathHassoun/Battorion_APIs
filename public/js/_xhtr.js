document.addEventListener("keydown", e => {
  const key = e.key.toLowerCase();
  if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') {
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
  } if (
    key === "f12" ||
    (e.ctrlKey && e.shiftKey && ["i", "c", "j"].includes(key)) ||
    (e.ctrlKey && key === "u") ||
    (e.metaKey && e.altKey && key === "i")
  ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
  }
});

document.addEventListener("keypress", e => {
  if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') {
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
  }
});

document.addEventListener("contextmenu", e => e.preventDefault());

(function () {
  let _0xa1 = false, _0xb2 = false;

  function _0xc3() {
    return (window['outerWidth'] - window['innerWidth'] > 0xa0) || (window['outerHeight'] - window['innerHeight'] > 0xa0);
  }

  function _0xd4() {
    const _0xe5 = Date['now']();
    debugger;
    return Date['now']() - _0xe5 > 0x32;
  }

  function _0xf6() {
    let _0x17 = false;
    const _0x28 = new Image();
    Object['defineProperty'](_0x28, 'id', {
      'get': function () {
        _0x17 = true;
      }
    });
    const _0x39 = document['createElement']('div');
    _0x39['style']['display'] = 'none';
    _0x39['appendChild'](_0x28);
    document['body']['appendChild'](_0x39);
    setTimeout(function () {
      _0x39['parentNode'] && _0x39['parentNode']['removeChild'](_0x39);
    }, 0x64);
    return _0x17;
  }

  function _0xexit() {
    window['location']['href'] = 'https://www.google.com/';
  }

  setInterval(function () {
    if (_0xc3() && !_0xa1) {
      _0xa1 = true;
      _0xexit();
    } else if (!_0xc3() && _0xa1) {
      _0xa1 = false;
    }
  }, 0x5dc); // 1500ms

  setInterval(function () {
    if ((_0xd4() || _0xf6()) && !_0xb2) {
      _0xb2 = true;
      _0xexit();
    } else if (!(_0xd4() || _0xf6()) && _0xb2) {
      _0xb2 = false;
    }
  }, 0x3e8); // 1000ms
})();
