const _uOF = {};

_uOF.get = (cb) => {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => cb(null, xhr.responseText);
  xhr.onerror = (err) => cb(err);
  xhr.open('POST', '');
  // xhr.setRequestHeader("Accept", "application/json");
  xhr.send();
};

