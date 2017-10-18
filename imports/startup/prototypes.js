Array.prototype.one = function(f, value) {
  if (typeof(f) === 'function') {
    for (var i = -1, n = this.length; ++i < n; ) {
      if (f(this[i])) return this[i];
    }
  }
  else {
    if (typeof(value) === 'undefined') value = true;
    for (var i = -1, n = this.length; ++i < n; ) {
      if (this[i][f] === value) return this[i];
    }
  }
  return null
};