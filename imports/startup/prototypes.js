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

Array.prototype.equalValues = function(array) {

    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}