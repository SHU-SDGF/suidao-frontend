(function (a) {
      a.fn.qrcode = function (p) {
          if (typeof p === "string") {
              p = {
                  text: p
              }
          }
          p = a.extend({},
          {
              text: "",
              width: 250,
              height: 250,
              typeNumber: -1,
              correctLevel: 2,
              background: "#ffffff",
              foreground: "#000000",
              jbcol: "#000000",
              jbtype: "x",
              dr: 1,
              old_dr: "no"
          },p);
          var m = function (q) {
              var u = p.foreground;
              var t = p.jbcol;
              var r = p.jbtype;
              q.globalCompositeOperation = "source-in";
              switch (r) {
                  case "r":
                      var s = p.width / 2;
                      var v = p.height / 2;
                      var w = s * 0.05;
                      var x = q.createRadialGradient(s, v, w, s, v, s * 1.5);
                      break;
                  case "h":
                      var x = q.createLinearGradient(0, 0, 0, p.height);
                      break;
                  case "w":
                      var x = q.createLinearGradient(0, 0, p.width, 0);
                      break;
                  case "x":
                      var x = q.createLinearGradient(0, 0, p.width, p.height);
                      break;
                  case "rx":
                      var x = q.createLinearGradient(p.width, 0, 0, p.height);
                      break
              }
              x.addColorStop(0, u);
              x.addColorStop(1, t);
              q.fillStyle = x;
              q.rect(0, 0, p.width, p.height);
              q.fill()
          };
          var o = function (q) {
              q.globalCompositeOperation = "destination-over";
              q.fillStyle = p.background;
              q.rect(0, 0, p.width, p.height);
              q.fill()
          };
          CanvasRenderingContext2D.prototype.roundRect = function (q, v, s, t, u) {
              this.beginPath();
              this.moveTo(q + u[0], v);
              this.arcTo(q + s, v, q + s, v + t, u[0]);
              this.arcTo(q + s, v + t, q, v + t, u[1]);
              this.arcTo(q, v + t, q, v, u[2]);
              this.arcTo(q, v, q + s, v, u[3])
              this.closePath();
              return this
          };
          CanvasRenderingContext2D.prototype.droundRectd = function (q, v, s, t, u) {
              this.beginPath();
              this.moveTo(q + u[0], v);
              this.arcTo(q + s, v, q + s, v + t, u[0]);
              this.lineTo(q + s, v);
              this.moveTo(q + s, v + t - u[1]);
              this.arcTo(q + s, v + t, q, v + t, u[1]);
              this.lineTo(q + s, v + t);
              this.moveTo(q + u[2], v + t);
              this.arcTo(q, v + t, q, v, u[2]);
              this.lineTo(q, v + t);
              this.moveTo(q, v + u[3]);
              this.arcTo(q, v, q + s, v, u[3]);
              this.lineTo(q, v)
              this.closePath();
              return this
          };
          var e = function (t, q, s, u) {
              by_arr = new Array(t, t, t, t);
              nr = 0
              if (q.MyisDark(u - 1, s) || q.MyisDark(u - 1, s - 1) || q.MyisDark(u, s - 1)) {
                  by_arr[3] = nr
              }
              if (q.MyisDark(u, s + 1) || q.MyisDark(u - 1, s + 1) || q.MyisDark(u - 1, s)) {
                  by_arr[0] = nr
              }
              if (q.MyisDark(u, s + 1) || q.MyisDark(u + 1, s + 1) || q.MyisDark(u + 1, s)) {
                  by_arr[1] = nr
              }
              if (q.MyisDark(u + 1, s) || q.MyisDark(u + 1, s - 1) || q.MyisDark(u, s - 1)) {
                  by_arr[2] = nr
              }
              return by_arr
          };
          var f = function (t, q, s, u) {
              nr = 0
              by_arr = new Array(nr, nr, nr, nr);
              if (q.MyisDark(u - 1, s) && q.MyisDark(u, s - 1)) {
                  by_arr[3] = t
              }
              if (q.MyisDark(u, s + 1) && q.MyisDark(u - 1, s)) {
                  by_arr[0] = t
              }
              if (q.MyisDark(u, s + 1) && q.MyisDark(u + 1, s)) {
                  by_arr[1] = t
              }
              if (q.MyisDark(u + 1, s) && q.MyisDark(u, s - 1)) {
                  by_arr[2] = t
              }
              return by_arr
          };
          var d = function (H, C, z, q, s, G) {
              var E = Array(q, q, q, q);
              var A = C.getModuleCount();
              var J = [[3, 3], [3, A - 4], [A - 4, 3]];
              arr = Array();
              for (D in J) {
                  if (z == 1) {
                      arr.push(J[D])
                  }
                  if (z == 2) {
                      arr.push([J[D][0] - z, J[D][1] - z]);
                      arr.push([J[D][0] + z, J[D][1] + z]);
                      arr.push([J[D][0] - z, J[D][1] + z]);
                      arr.push([J[D][0] + z, J[D][1] - z]);
                      continue
                  }
                  for (var u = J[D][0] - z; u <= J[D][0] + z; u++) {
                      arr.push([u, J[D][1] - z], [u, J[D][1] + z])
                  }
                  for (var u = J[D][0] - z + 1; u <= J[D][0] + z - 1; u++) {
                      arr.push([J[D][1] - z, u], [J[D][1] + z, u])
                  }
              }
              for (xy in arr) {
                  var t = arr[xy][0];
                  var I = arr[xy][1];
                  var F = (t + 1) * s - (t * s);
                  var v = (I + 1) * s - (I * s);
                  var D = G + t * s;
                  var B = G + I * s;
                  if (z == 2) {
                      var E = f(q, C, t, I);
                      H.droundRectd(D, B, F, v, E).fill()
                  } else {
                      aaaaa = 10;
                      if (p.dr < 0) {
                          E = e(q, C, t, I)
                      }
                      H.roundRect(D, B, F, v, E).fill()
                  }
              }
          };
          var b = function (I, s) {
              var C = Math.floor((p.width) / (s.getModuleCount() + 2));
              var M = Math.floor((p.height) / (s.getModuleCount() + 2));
              var q = Math.round((p.width - C * s.getModuleCount()) / 2);
              var E = Math.round((p.height - M * s.getModuleCount()) / 2);
              if (p.dr < 0) {
                  var H = 0 - p.dr
              } else {
                  var H = p.dr
              }
              var F = Math.round(C / 2 * H);
              if (F > C / 2) {
                  F = Math.round(C / 2)
              }
              if (p.old_dr == "no" && qr_old_dr == F) {
                  return
              }
              qr_old_dr = F;
              qr_old_canvas_w = p.width;
              qr_old_qr_w = C * s.getModuleCount();
              var D = Array(F, F, F, F);
              I.fillStyle = p.foreground;
              for (var u = 0; u < s.getModuleCount(); u++) {
                  for (var t = 0; t < s.getModuleCount(); t++) {
                      var B = (t + 1) * C - (t * C);
                      var L = (u + 1) * C - (u * C);
                      var A = q + t * C;
                      var z = E + u * M;
                      if (s.isDark(u, t)) {
                          if (p.dr < 0) {
                              D = e(F, s, t, u);
                              I.roundRect(A, z, B, L, D).fill()
                          } else {
                              I.roundRect(A, z, B, L, D).fill()
                          }
                      } else {
                          if (p.dr < 0) {
                              D = f(F, s, t, u);
                              I.droundRectd(A, z, B, L, D).fill()
                          }
                      }
                  }
              }
              if (p.jbtype != "no") {
                  m(I)
              }
              if (p.dan_w) {
                  I.globalCompositeOperation = "source-over";
                  I.fillStyle = p.dan_w;
                  d(I, s, 3, F, C, q);
                  if (p.dr < 0) {
                      d(I, s, 2, F, C, q)
                  }
              }
              if (p.dan_l) {
                  I.globalCompositeOperation = "source-over";
                  I.fillStyle = p.dan_l;
                  d(I, s, 1, F, C, q)
              }
              if (p.icon_src) {
                  I.globalCompositeOperation = "source-over";
                  var O = new Image();
                  O.src = p.icon_src;
                  var G = p.width * 0.3;
                  var N = p.height * 0.3;
                  var v = clacImgZoomParam(G, N, O.width, O.height);
                  var K = (p.width - v.width) / 2;
                  var J = (p.height - v.height) / 2;
                  I.drawImage(O, K, J, v.width, v.height)
              }
          };
          var c = function (t) {
              var r, s, q, u;
              r = "";
              q = t.length;
              for (s = 0; s < q; s++) {
                  u = t.charCodeAt(s);
                  if ((u >= 1) && (u <= 127)) {
                      r += t.charAt(s)
                  } else {
                      if (u > 2047) {
                          r += String.fromCharCode(224 | ((u >> 12) & 15));
                          r += String.fromCharCode(128 | ((u >> 6) & 63));
                          r += String.fromCharCode(128 | ((u >> 0) & 63))
                      } else {
                          r += String.fromCharCode(192 | ((u >> 6) & 31));
                          r += String.fromCharCode(128 | ((u >> 0) & 63))
                      }
                  }
              }
              return r
          };
          var h = function () {
              var s = new QRCode(p.typeNumber, p.correctLevel);
              p.text = c(p.text);
              s.addData(p.text);
              s.make();
              var r = document.getElementById("canvas");
              r.width = p.width;
              r.height = p.height;
              var q = r.getContext("2d");
              b(q, s);
              if (p.background) {
                  o(q)
              }
          };
          var n = function () {
              var x = new QRCode(p.typeNumber, p.correctLevel);
              x.addData(p.text);
              x.make();
              var r = document.getElementById("canvas");
              var y = r.getContext("2d");
              y.clearRect(0, 0, p.width, p.height);
              var q = p.width / x.getModuleCount();
              var u = p.height / x.getModuleCount();
              for (var z = 0; z < x.getModuleCount(); z++) {
                  for (var s = 0; s < x.getModuleCount(); s++) {
                      y.fillStyle = p.foreground;
                      var v = (Math.ceil((s + 1) * q) - Math.floor(s * q));
                      var t = (Math.ceil((z + 1) * q) - Math.floor(z * q));
                      if (x.isDark(z, s)) {
                          y.fillRect(Math.round(s * q), Math.round(z * u), v, t)
                      }
                  }
              }
          };
          h();
      }
  })(jQuery);
  function QR8bitByte(a) {
    this.mode = QRMode.MODE_8BIT_BYTE;
    this.data = a
}
QR8bitByte.prototype = {
    getLength: function (a) {
        return this.data.length
    },
    write: function (a) {
        for (var b = 0; b < this.data.length; b++) {
            a.put(this.data.charCodeAt(b), 8)
        }
    }
};
function QRCode(b, a) {
    this.typeNumber = b;
    this.errorCorrectLevel = a;
    this.modules = null;
    this.moduleCount = 0;
    this.dataCache = null;
    this.dataList = new Array()
}
QRCode.prototype = {
    addData: function (b) {
        var a = new QR8bitByte(b);
        this.dataList.push(a);
        this.dataCache = null
    },
    isDark: function (b, a) {
        if (b < 0 || this.moduleCount <= b || a < 0 || this.moduleCount <= a) {
            throw new Error(b + "," + a)
        }
        return this.modules[b][a]
    },
    MyisDark: function (b, a) {
        if (b < 0 || this.moduleCount <= b || a < 0 || this.moduleCount <= a) {
            return false
        }
        return this.modules[b][a]
    },
    getModuleCount: function () {
        return this.moduleCount
    },
    make: function () {
        if (this.typeNumber < 1) {
            var f = 1;
            for (f = 1; f < 40; f++) {
                var b = QRRSBlock.getRSBlocks(f, this.errorCorrectLevel);
                var a = new QRBitBuffer();
                var d = 0;
                for (var c = 0; c < b.length; c++) {
                    d += b[c].dataCount
                }
                for (var c = 0; c < this.dataList.length; c++) {
                    var e = this.dataList[c];
                    a.put(e.mode, 4);
                    a.put(e.getLength(), QRUtil.getLengthInBits(e.mode, f));
                    e.write(a)
                }
                if (a.getLengthInBits() <= d * 8) {
                    break
                }
            }
            this.typeNumber = f
        }
        this.makeImpl(false, this.getBestMaskPattern())
    },
    makeImpl: function (d, c) {
        this.moduleCount = this.typeNumber * 4 + 17;
        this.modules = new Array(this.moduleCount);
        for (var b = 0; b < this.moduleCount; b++) {
            this.modules[b] = new Array(this.moduleCount);
            for (var a = 0; a < this.moduleCount; a++) {
                this.modules[b][a] = null
            }
        }
        this.setupPositionProbePattern(0, 0);
        this.setupPositionProbePattern(this.moduleCount - 7, 0);
        this.setupPositionProbePattern(0, this.moduleCount - 7);
        this.setupPositionAdjustPattern();
        this.setupTimingPattern();
        this.setupTypeInfo(d, c);
        if (this.typeNumber >= 7) {
            this.setupTypeNumber(d)
        }
        if (this.dataCache == null) {
            this.dataCache = QRCode.createData(this.typeNumber, this.errorCorrectLevel, this.dataList)
        }
        this.mapData(this.dataCache, c)
    },
    setupPositionProbePattern: function (d, a) {
        for (var b = -1; b <= 7; b++) {
            if (d + b <= -1 || this.moduleCount <= d + b) {
                continue
            }
            for (var e = -1; e <= 7; e++) {
                if (a + e <= -1 || this.moduleCount <= a + e) {
                    continue
                }
                if ((0 <= b && b <= 6 && (e == 0 || e == 6)) || (0 <= e && e <= 6 && (b == 0 || b == 6)) || (2 <= b && b <= 4 && 2 <= e && e <= 4)) {
                    this.modules[d + b][a + e] = true
                } else {
                    this.modules[d + b][a + e] = false
                }
            }
        }
    },
    getBestMaskPattern: function () {
        var d = 0;
        var c = 0;
        for (var b = 0; b < 8; b++) {
            this.makeImpl(true, b);
            var a = QRUtil.getLostPoint(this);
            if (b == 0 || d > a) {
                d = a;
                c = b
            }
        }
        return c
    },
    createMovieClip: function (e, a, c) {
        var l = e.createEmptyMovieClip(a, c);
        var d = 1;
        this.make();
        for (var m = 0; m < this.modules.length; m++) {
            var g = m * d;
            for (var b = 0; b < this.modules[m].length; b++) {
                var h = b * d;
                var f = this.modules[m][b];
                if (f) {
                    l.beginFill(0, 100);
                    l.moveTo(h, g);
                    l.lineTo(h + d, g);
                    l.lineTo(h + d, g + d);
                    l.lineTo(h, g + d);
                    l.endFill()
                }
            }
        }
        return l
    },
    setupTimingPattern: function () {
        for (var a = 8; a < this.moduleCount - 8; a++) {
            if (this.modules[a][6] != null) {
                continue
            }
            this.modules[a][6] = (a % 2 == 0)
        }
        for (var b = 8; b < this.moduleCount - 8; b++) {
            if (this.modules[6][b] != null) {
                continue
            }
            this.modules[6][b] = (b % 2 == 0)
        }
    },
    setupPositionAdjustPattern: function () {
        var h = QRUtil.getPatternPosition(this.typeNumber);
        for (var d = 0; d < h.length; d++) {
            for (var b = 0; b < h.length; b++) {
                var f = h[d];
                var a = h[b];
                if (this.modules[f][a] != null) {
                    continue
                }
                for (var e = -2; e <= 2; e++) {
                    for (var g = -2; g <= 2; g++) {
                        if (e == -2 || e == 2 || g == -2 || g == 2 || (e == 0 && g == 0)) {
                            this.modules[f + e][a + g] = true
                        } else {
                            this.modules[f + e][a + g] = false
                        }
                    }
                }
            }
        }
    },
    setupTypeNumber: function (d) {
        var c = QRUtil.getBCHTypeNumber(this.typeNumber);
        for (var b = 0; b < 18; b++) {
            var a = (!d && ((c >> b) & 1) == 1);
            this.modules[Math.floor(b / 3)][b % 3 + this.moduleCount - 8 - 3] = a
        }
        for (var b = 0; b < 18; b++) {
            var a = (!d && ((c >> b) & 1) == 1);
            this.modules[b % 3 + this.moduleCount - 8 - 3][Math.floor(b / 3)] = a
        }
    },
    setupTypeInfo: function (f, e) {
        var d = (this.errorCorrectLevel << 3) | e;
        var c = QRUtil.getBCHTypeInfo(d);
        for (var b = 0; b < 15; b++) {
            var a = (!f && ((c >> b) & 1) == 1);
            if (b < 6) {
                this.modules[b][8] = a
            } else {
                if (b < 8) {
                    this.modules[b + 1][8] = a
                } else {
                    this.modules[this.moduleCount - 15 + b][8] = a
                }
            }
        }
        for (var b = 0; b < 15; b++) {
            var a = (!f && ((c >> b) & 1) == 1);
            if (b < 8) {
                this.modules[8][this.moduleCount - b - 1] = a
            } else {
                if (b < 9) {
                    this.modules[8][15 - b - 1 + 1] = a
                } else {
                    this.modules[8][15 - b - 1] = a
                }
            }
        }
        this.modules[this.moduleCount - 8][8] = (!f)
    },
    mapData: function (g, b) {
        var e = -1;
        var n = this.moduleCount - 1;
        var f = 7;
        var a = 0;
        for (var d = this.moduleCount - 1; d > 0; d -= 2) {
            if (d == 6) {
                d--
            }
            while (true) {
                for (var l = 0; l < 2; l++) {
                    if (this.modules[n][d - l] == null) {
                        var h = false;
                        if (a < g.length) {
                            h = (((g[a] >>> f) & 1) == 1)
                        }
                        var m = QRUtil.getMask(b, n, d - l);
                        if (m) {
                            h = !h
                        }
                        this.modules[n][d - l] = h;
                        f--;
                        if (f == -1) {
                            a++;
                            f = 7
                        }
                    }
                }
                n += e;
                if (n < 0 || this.moduleCount <= n) {
                    n -= e;
                    e = -e;
                    break
                }
            }
        }
    }
};
QRCode.PAD0 = 236;
QRCode.PAD1 = 17;
QRCode.createData = function (h, g, d) {
    var b = QRRSBlock.getRSBlocks(h, g);
    var a = new QRBitBuffer();
    for (var c = 0; c < d.length; c++) {
        var f = d[c];
        a.put(f.mode, 4);
        a.put(f.getLength(), QRUtil.getLengthInBits(f.mode, h));
        f.write(a)
    }
    var e = 0;
    for (var c = 0; c < b.length; c++) {
        e += b[c].dataCount
    }
    if (a.getLengthInBits() > e * 8) {
        throw new Error("code length overflow. (" + a.getLengthInBits() + ">" + e * 8 + ")")
    }
    if (a.getLengthInBits() + 4 <= e * 8) {
        a.put(0, 4)
    }
    while (a.getLengthInBits() % 8 != 0) {
        a.putBit(false)
    }
    while (true) {
        if (a.getLengthInBits() >= e * 8) {
            break
        }
        a.put(QRCode.PAD0, 8);
        if (a.getLengthInBits() >= e * 8) {
            break
        }
        a.put(QRCode.PAD1, 8)
    }
    return QRCode.createBytes(a, b)
};
QRCode.createBytes = function (n, q) {
    var c = 0;
    var u = 0;
    var s = 0;
    var b = new Array(q.length);
    var f = new Array(q.length);
    for (var l = 0; l < q.length; l++) {
        var m = q[l].dataCount;
        var a = q[l].totalCount - m;
        u = Math.max(u, m);
        s = Math.max(s, a);
        b[l] = new Array(m);
        for (var o = 0; o < b[l].length; o++) {
            b[l][o] = 255 & n.buffer[o + c]
        }
        c += m;
        var g = QRUtil.getErrorCorrectPolynomial(a);
        var t = new QRPolynomial(b[l], g.getLength() - 1);
        var d = t.mod(g);
        f[l] = new Array(g.getLength() - 1);
        for (var o = 0; o < f[l].length; o++) {
            var h = o + d.getLength() - f[l].length;
            f[l][o] = (h >= 0) ? d.get(h) : 0
        }
    }
    var p = 0;
    for (var o = 0; o < q.length; o++) {
        p += q[o].totalCount
    }
    var v = new Array(p);
    var e = 0;
    for (var o = 0; o < u; o++) {
        for (var l = 0; l < q.length; l++) {
            if (o < b[l].length) {
                v[e++] = b[l][o]
            }
        }
    }
    for (var o = 0; o < s; o++) {
        for (var l = 0; l < q.length; l++) {
            if (o < f[l].length) {
                v[e++] = f[l][o]
            }
        }
    }
    return v
};
var QRMode = {
    MODE_NUMBER: 1 << 0,
    MODE_ALPHA_NUM: 1 << 1,
    MODE_8BIT_BYTE: 1 << 2,
    MODE_KANJI: 1 << 3
};
var QRErrorCorrectLevel = {
    L: 1,
    M: 0,
    Q: 3,
    H: 2
};
var QRMaskPattern = {
    PATTERN000: 0,
    PATTERN001: 1,
    PATTERN010: 2,
    PATTERN011: 3,
    PATTERN100: 4,
    PATTERN101: 5,
    PATTERN110: 6,
    PATTERN111: 7
};
var QRUtil = {
    PATTERN_POSITION_TABLE: [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]],
    G15: (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0),
    G18: (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0),
    G15_MASK: (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1),
    getBCHTypeInfo: function (a) {
        var b = a << 10;
        while (QRUtil.getBCHDigit(b) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
            b ^= (QRUtil.G15 << (QRUtil.getBCHDigit(b) - QRUtil.getBCHDigit(QRUtil.G15)))
        }
        return ((a << 10) | b) ^ QRUtil.G15_MASK
    },
    getBCHTypeNumber: function (a) {
        var b = a << 12;
        while (QRUtil.getBCHDigit(b) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) {
            b ^= (QRUtil.G18 << (QRUtil.getBCHDigit(b) - QRUtil.getBCHDigit(QRUtil.G18)))
        }
        return (a << 12) | b
    },
    getBCHDigit: function (a) {
        var b = 0;
        while (a != 0) {
            b++;
            a >>>= 1
        }
        return b
    },
    getPatternPosition: function (a) {
        return QRUtil.PATTERN_POSITION_TABLE[a - 1]
    },
    getMask: function (c, b, a) {
        switch (c) {
            case QRMaskPattern.PATTERN000:
                return (b + a) % 2 == 0;
            case QRMaskPattern.PATTERN001:
                return b % 2 == 0;
            case QRMaskPattern.PATTERN010:
                return a % 3 == 0;
            case QRMaskPattern.PATTERN011:
                return (b + a) % 3 == 0;
            case QRMaskPattern.PATTERN100:
                return (Math.floor(b / 2) + Math.floor(a / 3)) % 2 == 0;
            case QRMaskPattern.PATTERN101:
                return (b * a) % 2 + (b * a) % 3 == 0;
            case QRMaskPattern.PATTERN110:
                return ((b * a) % 2 + (b * a) % 3) % 2 == 0;
            case QRMaskPattern.PATTERN111:
                return ((b * a) % 3 + (b + a) % 2) % 2 == 0;
            default:
                throw new Error("bad maskPattern:" + c)
        }
    },
    getErrorCorrectPolynomial: function (c) {
        var b = new QRPolynomial([1], 0);
        for (var d = 0; d < c; d++) {
            b = b.multiply(new QRPolynomial([1, QRMath.gexp(d)], 0))
        }
        return b
    },
    getLengthInBits: function (b, a) {
        if (1 <= a && a < 10) {
            switch (b) {
                case QRMode.MODE_NUMBER:
                    return 10;
                case QRMode.MODE_ALPHA_NUM:
                    return 9;
                case QRMode.MODE_8BIT_BYTE:
                    return 8;
                case QRMode.MODE_KANJI:
                    return 8;
                default:
                    throw new Error("mode:" + b)
            }
        } else {
            if (a < 27) {
                switch (b) {
                    case QRMode.MODE_NUMBER:
                        return 12;
                    case QRMode.MODE_ALPHA_NUM:
                        return 11;
                    case QRMode.MODE_8BIT_BYTE:
                        return 16;
                    case QRMode.MODE_KANJI:
                        return 10;
                    default:
                        throw new Error("mode:" + b)
                }
            } else {
                if (a < 41) {
                    switch (b) {
                        case QRMode.MODE_NUMBER:
                            return 14;
                        case QRMode.MODE_ALPHA_NUM:
                            return 13;
                        case QRMode.MODE_8BIT_BYTE:
                            return 16;
                        case QRMode.MODE_KANJI:
                            return 12;
                        default:
                            throw new Error("mode:" + b)
                    }
                } else {
                    throw new Error("type:" + a)
                }
            }
        }
    },
    getLostPoint: function (b) {
        var e = b.getModuleCount();
        var f = 0;
        for (var p = 0; p < e; p++) {
            for (var d = 0; d < e; d++) {
                var n = 0;
                var m = b.isDark(p, d);
                for (var a = -1; a <= 1; a++) {
                    if (p + a < 0 || e <= p + a) {
                        continue
                    }
                    for (var l = -1; l <= 1; l++) {
                        if (d + l < 0 || e <= d + l) {
                            continue
                        }
                        if (a == 0 && l == 0) {
                            continue
                        }
                        if (m == b.isDark(p + a, d + l)) {
                            n++
                        }
                    }
                }
                if (n > 5) {
                    f += (3 + n - 5)
                }
            }
        }
        for (var p = 0; p < e - 1; p++) {
            for (var d = 0; d < e - 1; d++) {
                var g = 0;
                if (b.isDark(p, d)) {
                    g++
                }
                if (b.isDark(p + 1, d)) {
                    g++
                }
                if (b.isDark(p, d + 1)) {
                    g++
                }
                if (b.isDark(p + 1, d + 1)) {
                    g++
                }
                if (g == 0 || g == 4) {
                    f += 3
                }
            }
        }
        for (var p = 0; p < e; p++) {
            for (var d = 0; d < e - 6; d++) {
                if (b.isDark(p, d) && !b.isDark(p, d + 1) && b.isDark(p, d + 2) && b.isDark(p, d + 3) && b.isDark(p, d + 4) && !b.isDark(p, d + 5) && b.isDark(p, d + 6)) {
                    f += 40
                }
            }
        }
        for (var d = 0; d < e; d++) {
            for (var p = 0; p < e - 6; p++) {
                if (b.isDark(p, d) && !b.isDark(p + 1, d) && b.isDark(p + 2, d) && b.isDark(p + 3, d) && b.isDark(p + 4, d) && !b.isDark(p + 5, d) && b.isDark(p + 6, d)) {
                    f += 40
                }
            }
        }
        var o = 0;
        for (var d = 0; d < e; d++) {
            for (var p = 0; p < e; p++) {
                if (b.isDark(p, d)) {
                    o++
                }
            }
        }
        var h = Math.abs(100 * o / e / e - 50) / 5;
        f += h * 10;
        return f
    }
};
var QRMath = {
    glog: function (a) {
        if (a < 1) {
            throw new Error("glog(" + a + ")")
        }
        return QRMath.LOG_TABLE[a]
    },
    gexp: function (a) {
        while (a < 0) {
            a += 255
        }
        while (a >= 256) {
            a -= 255
        }
        return QRMath.EXP_TABLE[a]
    },
    EXP_TABLE: new Array(256),
    LOG_TABLE: new Array(256)
};
for (var i = 0; i < 8; i++) {
    QRMath.EXP_TABLE[i] = 1 << i
}
for (var i = 8; i < 256; i++) {
    QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^ QRMath.EXP_TABLE[i - 5] ^ QRMath.EXP_TABLE[i - 6] ^ QRMath.EXP_TABLE[i - 8]
}
for (var i = 0; i < 255; i++) {
    QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i
}
function QRPolynomial(b, a) {
    if (b.length == undefined) {
        throw new Error(b.length + "/" + a)
    }
    var d = 0;
    while (d < b.length && b[d] == 0) {
        d++
    }
    this.num = new Array(b.length - d + a);
    for (var c = 0; c < b.length - d; c++) {
        this.num[c] = b[c + d]
    }
}
QRPolynomial.prototype = {
    get: function (a) {
        return this.num[a]
    },
    getLength: function () {
        return this.num.length
    },
    multiply: function (d) {
        var b = new Array(this.getLength() + d.getLength() - 1);
        for (var c = 0; c < this.getLength(); c++) {
            for (var a = 0; a < d.getLength(); a++) {
                b[c + a] ^= QRMath.gexp(QRMath.glog(this.get(c)) + QRMath.glog(d.get(a)))
            }
        }
        return new QRPolynomial(b, 0)
    },
    mod: function (d) {
        if (this.getLength() - d.getLength() < 0) {
            return this
        }
        var c = QRMath.glog(this.get(0)) - QRMath.glog(d.get(0));
        var a = new Array(this.getLength());
        for (var b = 0; b < this.getLength(); b++) {
            a[b] = this.get(b)
        }
        for (var b = 0; b < d.getLength(); b++) {
            a[b] ^= QRMath.gexp(QRMath.glog(d.get(b)) + c)
        }
        return new QRPolynomial(a, 0).mod(d)
    }
};
function QRRSBlock(a, b) {
    this.totalCount = a;
    this.dataCount = b
}
QRRSBlock.RS_BLOCK_TABLE = [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16], [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13], [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15], [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12], [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13], [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12], [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16], [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15], [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15], [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14], [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16], [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17], [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13], [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16], [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17], [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16], [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17], [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16], [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16], [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16], [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16], [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16], [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16], [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16], [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17], [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16], [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16], [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16], [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16], [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16], [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]];
QRRSBlock.getRSBlocks = function (c, l) {
    var b = QRRSBlock.getRsBlockTable(c, l);
    if (b == undefined) {
        throw new Error("bad rs block @ typeNumber:" + c + "/errorCorrectLevel:" + l)
    }
    var a = b.length / 3;
    var g = new Array();
    for (var e = 0; e < a; e++) {
        var f = b[e * 3 + 0];
        var m = b[e * 3 + 1];
        var h = b[e * 3 + 2];
        for (var d = 0; d < f; d++) {
            g.push(new QRRSBlock(m, h))
        }
    }
    return g
};
QRRSBlock.getRsBlockTable = function (b, a) {
    switch (a) {
        case QRErrorCorrectLevel.L:
            return QRRSBlock.RS_BLOCK_TABLE[(b - 1) * 4 + 0];
        case QRErrorCorrectLevel.M:
            return QRRSBlock.RS_BLOCK_TABLE[(b - 1) * 4 + 1];
        case QRErrorCorrectLevel.Q:
            return QRRSBlock.RS_BLOCK_TABLE[(b - 1) * 4 + 2];
        case QRErrorCorrectLevel.H:
            return QRRSBlock.RS_BLOCK_TABLE[(b - 1) * 4 + 3];
        default:
            return undefined
    }
};
function QRBitBuffer() {
    this.buffer = new Array();
    this.length = 0
}
QRBitBuffer.prototype = {
    get: function (a) {
        var b = Math.floor(a / 8);
        return ((this.buffer[b] >>> (7 - a % 8)) & 1) == 1
    },
    put: function (a, c) {
        for (var b = 0; b < c; b++) {
            this.putBit(((a >>> (c - b - 1)) & 1) == 1)
        }
    },
    getLengthInBits: function () {
        return this.length
    },
    putBit: function (b) {
        var a = Math.floor(this.length / 8);
        if (this.buffer.length <= a) {
            this.buffer.push(0)
        }
        if (b) {
            this.buffer[a] |= (128 >>> (this.length % 8))
        }
        this.length++
    }
}; 